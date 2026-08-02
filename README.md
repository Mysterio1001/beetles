# 開發規則 / Development Guidelines

本專案採用明確的樣式與結構分層原則，以維持高可讀性與擴展性，請依照以下規則開發。

## Mock 測試帳號

會員功能是純前端展示流程，資料只保存在目前瀏覽器，請勿輸入真實密碼或敏感個資。

- 帳號：`beetles_demo`
- 電子信箱：`demo@beetles.test`
- 密碼：`Beetle2026`

## 頁面（Page View）

- 邏輯與結構統一寫在 `.vue` 檔案中。
- 樣式需寫在獨立的 `.scss` 檔案，放置於 `assets/scss/page/` 資料夾中。
- 每個頁面樣式需包裹在 `body[data-page="xxx"]` selector 中，以避免全域污染。
- `data-page` 的值應與對應的 route `name` 一致。

## 元件（Component）

- 所有結構、邏輯與樣式統一寫在 `.vue` 檔案內部。
- 樣式請使用 `<style scoped lang="scss">`，以避免影響其他元件。
- 複用元件命名請使用 `PascalCase`，並建議搭配 BEM 命名法提升清晰度與一致性。

## 元件說明

---

### `BeDialog.vue`

多用途對話框元件，支援三種 `type` 模式，可依情境切換顯示樣式與操作邏輯。\
**預設提供底部按鈕區塊，亦可透過插槽自定義 footer。**

| Props             | 說明                                    |
| ----------------- | ------------------------------------- |
| `v-model:visible` | 控制對話框開關（`Boolean`）                    |
| `title`           | 對話框標題                                 |
| `type`            | 模式類型：`"custom"`、`"alert"`、`"confirm"` |
| `message`         | 顯示訊息（適用於 `alert`、`confirm` 模式）        |
| `show-footer-btn` | 是否顯示預設「確認 / 取消」按鈕（`Boolean`）          |
| `prompt`          | 警告對話框的提示標題，僅適用於 `alert` 模式            |

| Events     | 說明      |
| ---------- | ------- |
| `@close`   | 關閉時觸發   |
| `@confirm` | 按下確認時觸發 |

| Slot      | 說明             |
| --------- | -------------- |
| `default` | 對話框主要內容插槽      |
| `footer`  | 自訂底部內容，覆蓋預設按鈕區 |

#### **custom 模式：**

```vue
<BeDialog
  v-model:visible="isDialogVisible"
  title="自訂表單"
  type="custom"
  @close="handleClose">
  <div>這裡可以放入任何自定義內容</div>

  <template #footer>自定義底部</template>
</BeDialog>
```

#### **alert 模式：**

```vue
<BeDialog
  v-model:visible="isAlertVisible"
  type="alert"
  message="請確認所有欄位皆已填寫"
  @close="handleClose"
  @confirm="handleConfirm" />
```

#### **confirm 模式：**

```vue
<BeDialog
  v-model:visible="isConfirmVisible"
  type="confirm"
  message="確定要執行此操作？"
  @close="handleClose"
  @confirm="handleConfirm" />
```

---

### `BeTags.vue`

標籤元件，支援單選與多選模式，並可綁定 icon。

| Props    | 說明                                  |
| -------- | ----------------------------------- |
| `data`   | 標籤資料，格式為 `{ label, value, icon }[]` |
| `option` | 標籤設定物件，支援：                          |
|          | • `multiple`：是否為多選模式（Boolean）       |
|          | • `selectedTagNo`：預設選中的 tag 編號      |
|          | • `disableTagNo`：禁用點選的 tag 編號陣列     |

| Events        | 說明                           |
| ------------- | ---------------------------- |
| `@tags-click` | 點選標籤後觸發，回傳 value（或 value 陣列） |
| `@ready`      | 載入完成後觸發                      |

**範例：**

```vue
<BeTags
  :data="tagsData"
  :option="{
    selectedTagNo: [1, 2],
    disableTagNo: [3],
    multiple: true
  }"
  @tags-click="handleClick"
  @ready="handleReady" />
```

---

### `BeInput.vue`

輸入框元件，支援 `text`、`password`、`textarea` 三種輸入型態，並可透過 slot 插入自定義內容。

| Props         | 說明                                  |
| ------------- | ----------------------------------- |
| `v-model`     | 綁定輸入內容                              |
| `type`        | 類型：`text` / `password` / `textarea` |
| `label`       | 欄位標題                                |
| `placeholder` | 提示文字                                |
| `disabled`    | 是否禁用                                |
| `readonly`    | 是否唯讀                                |
| `maxlength`   | 最長輸入字元數                             |
| `labelTop`    | （textarea 限用）標題是否置上（Boolean）        |
| `size`        | 僅支援 input 類型：`default` / `small`    |
| `clearable`   | 是否顯示清除按鈕（預設為 true）                  |

| Events   | 說明               |
| -------- | ---------------- |
| `@input` | 輸入變更時觸發，回傳當前內容文字 |
| `@enter` | 按下 Enter 鍵時觸發    |

| Slots     | 位置與用途         |
| --------- | ------------- |
| `#prefix` | 標題後、輸入框前的插槽區域 |
| `#suffix` | 輸入框右側插槽區域     |

---

### `BeSelect.vue`

下拉選單元件，提供自訂樣式、禁用選項、標題寬度等設定。

| Props         | 說明                              |
| ------------- | ------------------------------- |
| `v-model`     | 綁定選中的 value                     |
| `label`       | 標題文字                            |
| `labelWidth`  | 標題欄寬度                           |
| `placeholder` | 提示文字                            |
| `options`     | 下拉選項陣列，格式為 `{ label, value }[]` |
| `size`        | 尺寸類型：`default` / `small`        |
| `disabled`    | 是否禁用選單                          |

| Events    | 說明                                  |
| --------- | ----------------------------------- |
| `@select` | 點選選項後觸發，回傳整個選項物件 `{ label, value }` |
