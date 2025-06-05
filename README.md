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

### 元件說明 

#### Dialog.vue

多用途對話框，支援三種顯示模式，根據 type 屬性切換行為與內容

**custom 模式**  
- 支援自訂內容插槽（`<slot>`），可用於表單、複雜排版等用途。  
- 顯示標題（透過 `title` 傳入）。  
```vue
  <Dialog
  v-model:visible="showCustomDialog"
  title="自訂表單"
  type="custom"
  @close="handleClose">
  <div>這裡可以放入任何自定義內容</div>
</Dialog>
```
**alert 模式**
- 僅顯示警告訊息（透過 `message` 傳入）。 
- 僅包含一個「確認」按鈕。 
- 適用於單向通知、阻斷性提示。

  ```vue
<Dialog
  v-model:visible="showAlert"
  type="alert"
  message="請確認所有欄位皆已填寫"
  @close="handleClose"
  @confirm="handleConfirm" /> 
```

**confirm 模式**
- 顯示確認訊息（透過 message 傳入）。
- 提供「確認」與「取消」兩個按鈕。
- 適合處理需用戶明確同意的操作（例如刪除、提交等）。 

```vue
<Dialog
  v-model:visible="showAlert" 
  type="alert" 
  message="請確認所有欄位皆已填寫" 
  @close="handleClose" 
  @confirm="handleConfirm" /> 
``` 