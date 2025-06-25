/**
 * 監聽 scroll 事件並回傳 scroll 資訊
 * @param {Window|HTMLElement} target - 要監聽的元素，預設為 window
 * @param {Function} callback - 當滾動時觸發的函式，會帶入 scrollTop, scrollHeight, clientHeight
 * @returns {Function} 移除監聽的函式
 */

export function listenScroll(target = window, callback) {
  if (!target || typeof callback !== "function") return () => {};

  const handler = () => {
    let scrollTop, scrollHeight, clientHeight;

    if (target === window) {
      // 有些瀏覽器支援 scrollY，有些只能從 document.documentElement.scrollTop 取得
      scrollTop = window.scrollY || document.documentElement.scrollTop;
      // 網頁的總內容高度
      scrollHeight = document.documentElement.scrollHeight;
      // 視窗高度(可視畫面)
      clientHeight = window.innerHeight;
      // 如果目標是一個HTML元素
    } else if (target instanceof HTMLElement) {
      scrollTop = target.scrollTop;
      scrollHeight = target.scrollHeight;
      clientHeight = target.clientHeight;
    } else {
      return;
    }
    callback({ scrollTop, scrollHeight, clientHeight });
  };

  target.addEventListener("scroll", handler);

  // 初始立即執行一次
  handler();

  // 回傳移除函式
  return () => {
    target.removeEventListener("scroll", handler);
  };
}
