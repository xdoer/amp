;require('runtime');require('app');(wx["webpackChunk"] = wx["webpackChunk"] || []).push([[0],[
/* 0 */
/***/ (() => {

// app.js
App({
  onLaunch: function onLaunch() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs); // 登录

    wx.login({
      success: function success(res) {// 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });
  },
  globalData: {
    userInfo: null
  }
});

/***/ })
],
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__(0));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBQSxHQUFHLENBQUM7QUFDRkMsRUFBQUEsUUFERSxzQkFDUztBQUNUO0FBQ0EsUUFBTUMsSUFBSSxHQUFHQyxFQUFFLENBQUNDLGNBQUgsQ0FBa0IsTUFBbEIsS0FBNkIsRUFBMUM7QUFDQUYsSUFBQUEsSUFBSSxDQUFDRyxPQUFMLENBQWFDLElBQUksQ0FBQ0MsR0FBTCxFQUFiO0FBQ0FKLElBQUFBLEVBQUUsQ0FBQ0ssY0FBSCxDQUFrQixNQUFsQixFQUEwQk4sSUFBMUIsRUFKUyxDQU1UOztBQUNBQyxJQUFBQSxFQUFFLENBQUNNLEtBQUgsQ0FBUztBQUNQQyxNQUFBQSxPQUFPLEVBQUUsaUJBQUNDLEdBQUQsRUFBUyxDQUNoQjtBQUNEO0FBSE0sS0FBVDtBQUtELEdBYkM7QUFjRkMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLFFBQVEsRUFBRTtBQURBO0FBZFYsQ0FBRCxDQUFIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGFwcC5qc1xuQXBwKHtcbiAgb25MYXVuY2goKSB7XG4gICAgLy8g5bGV56S65pys5Zyw5a2Y5YKo6IO95YqbXG4gICAgY29uc3QgbG9ncyA9IHd4LmdldFN0b3JhZ2VTeW5jKCdsb2dzJykgfHwgW11cbiAgICBsb2dzLnVuc2hpZnQoRGF0ZS5ub3coKSlcbiAgICB3eC5zZXRTdG9yYWdlU3luYygnbG9ncycsIGxvZ3MpXG5cbiAgICAvLyDnmbvlvZVcbiAgICB3eC5sb2dpbih7XG4gICAgICBzdWNjZXNzOiAocmVzKSA9PiB7XG4gICAgICAgIC8vIOWPkemAgSByZXMuY29kZSDliLDlkI7lj7DmjaLlj5Ygb3BlbklkLCBzZXNzaW9uS2V5LCB1bmlvbklkXG4gICAgICB9LFxuICAgIH0pXG4gIH0sXG4gIGdsb2JhbERhdGE6IHtcbiAgICB1c2VySW5mbzogbnVsbCxcbiAgfSxcbn0pXG4iXSwibmFtZXMiOlsiQXBwIiwib25MYXVuY2giLCJsb2dzIiwid3giLCJnZXRTdG9yYWdlU3luYyIsInVuc2hpZnQiLCJEYXRlIiwibm93Iiwic2V0U3RvcmFnZVN5bmMiLCJsb2dpbiIsInN1Y2Nlc3MiLCJyZXMiLCJnbG9iYWxEYXRhIiwidXNlckluZm8iXSwic291cmNlUm9vdCI6IiJ9