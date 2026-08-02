import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";
import { build, createServer, resolveConfig } from "vite";

const projectRoot = new URL("../../", import.meta.url);
const publicAssetPathPattern = /\bpublic\//m;
const consoleCallPattern = /\bconsole\s*(?:\?\.\s*|\.\s*)[A-Za-z_$][\w$]*\s*\(/;

function readProjectFile(path) {
  return readFileSync(new URL(path, projectRoot), "utf8");
}

function listSourceFiles(directory = "src") {
  const absoluteDirectory = new URL(`${directory}/`, projectRoot);
  return readdirSync(absoluteDirectory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (path === "src/views/beetleLab/child") return [];
    return entry.isDirectory() ? listSourceFiles(path) : [path];
  });
}

test("正式入口不以 eager glob 載入所有元件，且開發 demo 檔案已移除", () => {
  const mainSource = readProjectFile("src/main.js");
  assert.equal(
    /import\.meta\.glob/.test(mainSource),
    false,
    "main.js must not eager-glob components",
  );
  assert.equal(
    /app\.component/.test(mainSource),
    false,
    "main.js must not globally register views",
  );

  const obsoletePaths = [
    "src/api/testData.js",
    "src/components/BeLine.vue",
    "src/components/BeSwiper.vue",
    "src/components/BeTags.vue",
    "src/components/layout/BeCard.vue",
    "src/components/layout/BeContainer.vue",
    "src/components/layout/BeFloatPanel.vue",
    "src/style/page/_test.scss",
    "src/utils/useDevice.js",
    "src/views/system/PagePlaceholder.vue",
    "src/views/test/index.vue",
    "src/views/test/child/testChild.vue",
    "src/views/test/child/child/testChildJr.vue",
  ];

  for (const path of obsoletePaths) {
    assert.equal(existsSync(new URL(path, projectRoot)), false, `${path} should be removed`);
  }
});

test("正式 source 不含測試路由、錯誤 public URL、console 或 debugger", () => {
  const routerSource = readProjectFile("src/router/index.js");
  assert.equal(
    /path:\s*["']\/test/.test(routerSource),
    false,
    "router must not expose test routes",
  );

  const source = listSourceFiles()
    .filter((path) => [".js", ".vue", ".scss"].includes(extname(path)))
    .map((path) => readProjectFile(path))
    .join("\n");

  assert.equal(
    publicAssetPathPattern.test(source),
    false,
    "formal source must not contain /public asset paths",
  );
  assert.equal(
    consoleCallPattern.test(source),
    false,
    "formal source must not contain debug console calls",
  );
  assert.equal(/\bdebugger\b/.test(source), false, "formal source must not contain debugger");
});

test("public asset path contract 涵蓋絕對與相對 URL", () => {
  const invalidSources = [
    'src="/public/img/a.png"',
    'src="public/img/a.png"',
    'src="../public/img/a.png"',
    'src=" /public/img/a.png"',
    "src=/public/img/a.png",
    "const image = `/public/img/a.png`",
  ];

  for (const source of invalidSources) {
    assert.equal(
      publicAssetPathPattern.test(source),
      true,
      `must reject public asset path in ${source}`,
    );
  }
});

test("console contract 涵蓋所有正式 console method calls", () => {
  for (const source of [
    'console.log("debug")',
    'console.warn("warning")',
    'console.error("failure")',
    'console?.info("debug")',
  ]) {
    assert.equal(consoleCallPattern.test(source), true, `must reject ${source}`);
  }
});

test("非根 base production build 不保留 origin-root 動態圖片 URL", async () => {
  const buildResult = await build({
    base: "/__beetles_base_contract__/",
    build: { write: false },
    logLevel: "silent",
  });
  const outputs = Array.isArray(buildResult) ? buildResult : [buildResult];
  const productionSource = outputs
    .flatMap((output) => output.output)
    .filter((output) => output.type === "chunk")
    .map((output) => output.code)
    .join("\n");

  assert.doesNotMatch(productionSource, /["']\/img\//);
  assert.match(productionSource, /["']\/__beetles_base_contract__\/img\//);
});

test("正式 views 與 Footer 只透過可替換 boundary 消費 Mock 資料", () => {
  const viewSource = listSourceFiles("src/views")
    .filter((path) => extname(path) === ".vue")
    .map((path) => readProjectFile(path))
    .join("\n");
  const footerSource = readProjectFile("src/components/layout/BeFooter.vue");
  const orderCompleteSource = readProjectFile("src/views/order/OrderCompleteView.vue");

  assert.doesNotMatch(viewSource, /from\s+["'][^"']*\/mocks\//);
  assert.match(footerSource, /@\/services\/contactService/);
  assert.doesNotMatch(footerSource, /bulletinService/);
  assert.match(orderCompleteSource, /@\/services\/contactService/);
  assert.doesNotMatch(
    footerSource,
    /https:\/\/(?:www\.)?(?:facebook|instagram)\.com|https:\/\/line\.me/,
  );
});

test("ESLint 會攔截未解析的 Vue components", async () => {
  const eslint = new ESLint({ cwd: fileURLToPath(projectRoot) });
  const [result] = await eslint.lintText(
    "<template><BeMissing /></template><script setup></script>",
    { filePath: "src/__release_fixture__.vue" },
  );

  assert.ok(
    result.messages.some((message) => message.ruleId === "vue/no-undef-components"),
    "vue/no-undef-components must reject missing local imports",
  );
});

test("package 提供完整 Node test 命令且不保留未使用 toolkit", () => {
  const packageJson = JSON.parse(readProjectFile("package.json"));
  assert.equal(packageJson.scripts.test, "node --test tests/**/*.test.js");
  assert.equal(packageJson.dependencies["@mysterio1001/toolkit"], undefined);
});

test("production i18n 實際保留 compiler、resolver、插值與 fallback", async () => {
  const packageJson = JSON.parse(readProjectFile("package.json"));
  const config = await resolveConfig({}, "build", "production");
  const originalWarn = console.warn;
  console.warn = () => {};
  const server = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "silent",
  });

  try {
    const { default: runtimeI18n } = await server.ssrLoadModule("/src/locale/index.js");
    runtimeI18n.global.locale.value = "zh-TW";
    assert.equal(runtimeI18n.global.t("route.home"), "首頁");
    assert.equal(runtimeI18n.global.t("bulletin.callUs", { phone: "0922" }), "撥打 0922");
    runtimeI18n.global.locale.value = "en";
    assert.equal(runtimeI18n.global.t("route.home"), "Home");
  } finally {
    await server.close();
    console.warn = originalWarn;
  }

  assert.equal(config.define.__INTLIFY_DROP_MESSAGE_COMPILER__, false);
  assert.equal(typeof packageJson.dependencies["@intlify/core-base"], "string");
});

test("README 記錄實際命令、資料邊界、i18n、樣式與 hash 部署", () => {
  const readme = readProjectFile("README.md");
  const requiredContent = [
    "npm run dev",
    "npm test",
    "npm run lint",
    "npm run format:check",
    "npm run build",
    "npm run preview",
    "src/mocks/",
    "src/locale/i18n/",
    "src/style/page/",
    "src/style/main.scss",
    "Hash Router",
    "beetles_demo",
    "Beetle2026",
  ];

  for (const content of requiredContent) {
    assert.equal(readme.includes(content), true, `README must include ${content}`);
  }
  assert.equal(
    readme.includes("assets/scss/page"),
    false,
    "README must use the current style path",
  );
});
