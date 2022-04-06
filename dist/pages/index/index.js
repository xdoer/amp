;require('../../runtime');require('../../common');require('index');(wx["webpackChunk"] = wx["webpackChunk"] || []).push([[2],[
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var util = __webpack_require__(2);

console.log(util.formatTime(new Date())); // index.js
// 获取应用实例

var app = getApp();
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false

  },
  // 事件处理函数
  bindViewTap: function bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    });
  },
  onLoad: function onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    }
  },
  getUserProfile: function getUserProfile(e) {
    var _this = this;

    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息',
      // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: function success(res) {
        console.log(res);

        _this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      }
    });
  },
  getUserInfo: function getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e);
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  }
});

/***/ })
],
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, [1], () => (__webpack_exec__(1)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZXMvaW5kZXgvaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxJQUFNQSxJQUFJLEdBQUdDLG1CQUFPLENBQUMsQ0FBRCxDQUFwQjs7QUFFQUMsT0FBTyxDQUFDQyxHQUFSLENBQVlILElBQUksQ0FBQ0ksVUFBTCxDQUFnQixJQUFJQyxJQUFKLEVBQWhCLENBQVosR0FFQTtBQUNBOztBQUNBLElBQU1DLEdBQUcsR0FBR0MsTUFBTSxFQUFsQjtBQUVBQyxJQUFJLENBQUM7QUFDSEMsRUFBQUEsSUFBSSxFQUFFO0FBQ0pDLElBQUFBLEtBQUssRUFBRSxhQURIO0FBRUpDLElBQUFBLFFBQVEsRUFBRSxFQUZOO0FBR0pDLElBQUFBLFdBQVcsRUFBRSxLQUhUO0FBSUpDLElBQUFBLE9BQU8sRUFBRUMsRUFBRSxDQUFDRCxPQUFILENBQVcsOEJBQVgsQ0FKTDtBQUtKRSxJQUFBQSxxQkFBcUIsRUFBRSxLQUxuQjtBQU1KQyxJQUFBQSxlQUFlLEVBQ2JGLEVBQUUsQ0FBQ0QsT0FBSCxDQUFXLDhCQUFYLEtBQ0FDLEVBQUUsQ0FBQ0QsT0FBSCxDQUFXLDZCQUFYLENBUkUsQ0FReUM7O0FBUnpDLEdBREg7QUFXSDtBQUNBSSxFQUFBQSxXQVpHLHlCQVlXO0FBQ1pILElBQUFBLEVBQUUsQ0FBQ0ksVUFBSCxDQUFjO0FBQ1pDLE1BQUFBLEdBQUcsRUFBRTtBQURPLEtBQWQ7QUFHRCxHQWhCRTtBQWlCSEMsRUFBQUEsTUFqQkcsb0JBaUJNO0FBQ1AsUUFBSU4sRUFBRSxDQUFDTyxjQUFQLEVBQXVCO0FBQ3JCLFdBQUtDLE9BQUwsQ0FBYTtBQUNYUCxRQUFBQSxxQkFBcUIsRUFBRTtBQURaLE9BQWI7QUFHRDtBQUNGLEdBdkJFO0FBd0JITSxFQUFBQSxjQXhCRywwQkF3QllFLENBeEJaLEVBd0JlO0FBQUE7O0FBQ2hCO0FBQ0FULElBQUFBLEVBQUUsQ0FBQ08sY0FBSCxDQUFrQjtBQUNoQkcsTUFBQUEsSUFBSSxFQUFFLFFBRFU7QUFDQTtBQUNoQkMsTUFBQUEsT0FBTyxFQUFFLGlCQUFDQyxHQUFELEVBQVM7QUFDaEJ4QixRQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWXVCLEdBQVo7O0FBQ0EsYUFBSSxDQUFDSixPQUFMLENBQWE7QUFDWFgsVUFBQUEsUUFBUSxFQUFFZSxHQUFHLENBQUNmLFFBREg7QUFFWEMsVUFBQUEsV0FBVyxFQUFFO0FBRkYsU0FBYjtBQUlEO0FBUmUsS0FBbEI7QUFVRCxHQXBDRTtBQXFDSGUsRUFBQUEsV0FyQ0csdUJBcUNTSixDQXJDVCxFQXFDWTtBQUNiO0FBQ0FyQixJQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWW9CLENBQVo7QUFDQSxTQUFLRCxPQUFMLENBQWE7QUFDWFgsTUFBQUEsUUFBUSxFQUFFWSxDQUFDLENBQUNLLE1BQUYsQ0FBU2pCLFFBRFI7QUFFWEMsTUFBQUEsV0FBVyxFQUFFO0FBRkYsS0FBYjtBQUlEO0FBNUNFLENBQUQsQ0FBSiIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3BhZ2VzL2luZGV4L2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHV0aWwgPSByZXF1aXJlKCcuLi8uLi91dGlscy91dGlsLmpzJylcblxuY29uc29sZS5sb2codXRpbC5mb3JtYXRUaW1lKG5ldyBEYXRlKCkpKVxuXG4vLyBpbmRleC5qc1xuLy8g6I635Y+W5bqU55So5a6e5L6LXG5jb25zdCBhcHAgPSBnZXRBcHAoKVxuXG5QYWdlKHtcbiAgZGF0YToge1xuICAgIG1vdHRvOiAnSGVsbG8gV29ybGQnLFxuICAgIHVzZXJJbmZvOiB7fSxcbiAgICBoYXNVc2VySW5mbzogZmFsc2UsXG4gICAgY2FuSVVzZTogd3guY2FuSVVzZSgnYnV0dG9uLm9wZW4tdHlwZS5nZXRVc2VySW5mbycpLFxuICAgIGNhbklVc2VHZXRVc2VyUHJvZmlsZTogZmFsc2UsXG4gICAgY2FuSVVzZU9wZW5EYXRhOlxuICAgICAgd3guY2FuSVVzZSgnb3Blbi1kYXRhLnR5cGUudXNlckF2YXRhclVybCcpICYmXG4gICAgICB3eC5jYW5JVXNlKCdvcGVuLWRhdGEudHlwZS51c2VyTmlja05hbWUnKSwgLy8g5aaC6ZyA5bCd6K+V6I635Y+W55So5oi35L+h5oGv5Y+v5pS55Li6ZmFsc2VcbiAgfSxcbiAgLy8g5LqL5Lu25aSE55CG5Ye95pWwXG4gIGJpbmRWaWV3VGFwKCkge1xuICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgdXJsOiAnLi4vbG9ncy9sb2dzJyxcbiAgICB9KVxuICB9LFxuICBvbkxvYWQoKSB7XG4gICAgaWYgKHd4LmdldFVzZXJQcm9maWxlKSB7XG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBjYW5JVXNlR2V0VXNlclByb2ZpbGU6IHRydWUsXG4gICAgICB9KVxuICAgIH1cbiAgfSxcbiAgZ2V0VXNlclByb2ZpbGUoZSkge1xuICAgIC8vIOaOqOiNkOS9v+eUqHd4LmdldFVzZXJQcm9maWxl6I635Y+W55So5oi35L+h5oGv77yM5byA5Y+R6ICF5q+P5qyh6YCa6L+H6K+l5o6l5Y+j6I635Y+W55So5oi35Liq5Lq65L+h5oGv5Z2H6ZyA55So5oi356Gu6K6k77yM5byA5Y+R6ICF5aal5ZaE5L+d566h55So5oi35b+r6YCf5aGr5YaZ55qE5aS05YOP5pi156ew77yM6YG/5YWN6YeN5aSN5by556qXXG4gICAgd3guZ2V0VXNlclByb2ZpbGUoe1xuICAgICAgZGVzYzogJ+WxleekuueUqOaIt+S/oeaBrycsIC8vIOWjsOaYjuiOt+WPlueUqOaIt+S4quS6uuS/oeaBr+WQjueahOeUqOmAlO+8jOWQjue7reS8muWxleekuuWcqOW8ueeql+S4re+8jOivt+iwqOaFjuWhq+WGmVxuICAgICAgc3VjY2VzczogKHJlcykgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMpXG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgdXNlckluZm86IHJlcy51c2VySW5mbyxcbiAgICAgICAgICBoYXNVc2VySW5mbzogdHJ1ZSxcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgfSlcbiAgfSxcbiAgZ2V0VXNlckluZm8oZSkge1xuICAgIC8vIOS4jeaOqOiNkOS9v+eUqGdldFVzZXJJbmZv6I635Y+W55So5oi35L+h5oGv77yM6aKE6K6h6IeqMjAyMeW5tDTmnIgxM+aXpei1t++8jGdldFVzZXJJbmZv5bCG5LiN5YaN5by55Ye65by556qX77yM5bm255u05o6l6L+U5Zue5Yy/5ZCN55qE55So5oi35Liq5Lq65L+h5oGvXG4gICAgY29uc29sZS5sb2coZSlcbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgdXNlckluZm86IGUuZGV0YWlsLnVzZXJJbmZvLFxuICAgICAgaGFzVXNlckluZm86IHRydWUsXG4gICAgfSlcbiAgfSxcbn0pXG4iXSwibmFtZXMiOlsidXRpbCIsInJlcXVpcmUiLCJjb25zb2xlIiwibG9nIiwiZm9ybWF0VGltZSIsIkRhdGUiLCJhcHAiLCJnZXRBcHAiLCJQYWdlIiwiZGF0YSIsIm1vdHRvIiwidXNlckluZm8iLCJoYXNVc2VySW5mbyIsImNhbklVc2UiLCJ3eCIsImNhbklVc2VHZXRVc2VyUHJvZmlsZSIsImNhbklVc2VPcGVuRGF0YSIsImJpbmRWaWV3VGFwIiwibmF2aWdhdGVUbyIsInVybCIsIm9uTG9hZCIsImdldFVzZXJQcm9maWxlIiwic2V0RGF0YSIsImUiLCJkZXNjIiwic3VjY2VzcyIsInJlcyIsImdldFVzZXJJbmZvIiwiZGV0YWlsIl0sInNvdXJjZVJvb3QiOiIifQ==