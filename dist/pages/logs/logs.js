;require('../../runtime');require('../../common');require('logs');(wx["webpackChunk"] = wx["webpackChunk"] || []).push([[3],{

/***/ 3:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

// logs.js
var util = __webpack_require__(2);

Page({
  data: {
    logs: []
  },
  onLoad: function onLoad() {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(function (log) {
        return {
          date: util.formatTime(new Date(log)),
          timeStamp: log
        };
      })
    });
  }
});

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, [1], () => (__webpack_exec__(3)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZXMvbG9ncy9sb2dzLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQSxJQUFNQSxJQUFJLEdBQUdDLG1CQUFPLENBQUMsQ0FBRCxDQUFwQjs7QUFFQUMsSUFBSSxDQUFDO0FBQ0hDLEVBQUFBLElBQUksRUFBRTtBQUNKQyxJQUFBQSxJQUFJLEVBQUU7QUFERixHQURIO0FBSUhDLEVBQUFBLE1BSkcsb0JBSU07QUFDUCxTQUFLQyxPQUFMLENBQWE7QUFDWEYsTUFBQUEsSUFBSSxFQUFFLENBQUNHLEVBQUUsQ0FBQ0MsY0FBSCxDQUFrQixNQUFsQixLQUE2QixFQUE5QixFQUFrQ0MsR0FBbEMsQ0FBc0MsVUFBQUMsR0FBRyxFQUFJO0FBQ2pELGVBQU87QUFDTEMsVUFBQUEsSUFBSSxFQUFFWCxJQUFJLENBQUNZLFVBQUwsQ0FBZ0IsSUFBSUMsSUFBSixDQUFTSCxHQUFULENBQWhCLENBREQ7QUFFTEksVUFBQUEsU0FBUyxFQUFFSjtBQUZOLFNBQVA7QUFJRCxPQUxLO0FBREssS0FBYjtBQVFEO0FBYkUsQ0FBRCxDQUFKIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vcGFnZXMvbG9ncy9sb2dzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGxvZ3MuanNcbmNvbnN0IHV0aWwgPSByZXF1aXJlKCcuLi8uLi91dGlscy91dGlsLmpzJylcblxuUGFnZSh7XG4gIGRhdGE6IHtcbiAgICBsb2dzOiBbXVxuICB9LFxuICBvbkxvYWQoKSB7XG4gICAgdGhpcy5zZXREYXRhKHtcbiAgICAgIGxvZ3M6ICh3eC5nZXRTdG9yYWdlU3luYygnbG9ncycpIHx8IFtdKS5tYXAobG9nID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBkYXRlOiB1dGlsLmZvcm1hdFRpbWUobmV3IERhdGUobG9nKSksXG4gICAgICAgICAgdGltZVN0YW1wOiBsb2dcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG59KVxuIl0sIm5hbWVzIjpbInV0aWwiLCJyZXF1aXJlIiwiUGFnZSIsImRhdGEiLCJsb2dzIiwib25Mb2FkIiwic2V0RGF0YSIsInd4IiwiZ2V0U3RvcmFnZVN5bmMiLCJtYXAiLCJsb2ciLCJkYXRlIiwiZm9ybWF0VGltZSIsIkRhdGUiLCJ0aW1lU3RhbXAiXSwic291cmNlUm9vdCI6IiJ9