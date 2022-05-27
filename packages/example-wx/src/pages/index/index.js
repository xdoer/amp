Page({
  onShow() {
    console.log("----------------onShow");
  },
  onShareAppMessage() {
    return {
      title: "iView Weapp",
      imageUrl: "https://file.iviewui.com/iview-weapp-logo.png",
    };
  },
});
