# 開發規則 / Development Guidelines

本專案採用明確的樣式與結構分層原則，以維持高可讀性與擴展性，請依照以下規則開發。

## 頁面（Page View）

- 邏輯與結構統一寫在 `.vue` 檔案中。
- 樣式需寫在獨立的 `.scss` 檔案，放置於 `assets/scss/view/` 資料夾中。
- 每個頁面樣式需包裹在 `body[data-page="xxx"]` selector 中，以避免全域污染。
- `data-page` 的值應與對應的 route `name` 一致。

## 元件（Component）

- 所有結構、邏輯與樣式統一寫在 `.vue` 檔案內部。
- 樣式請使用 `<style scoped lang="scss">`，以避免影響其他元件。
- 複用元件命名請使用 `PascalCase`，並建議搭配 BEM 命名法提升清晰度與一致性。

## 檔案結構建議
