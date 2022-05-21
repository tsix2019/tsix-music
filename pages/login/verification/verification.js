// pages/login/verification/verification.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    outTime:10,  // 验证码60s
    phone:null,
    code:[], // 6位验证码
  },
  onLoad(options) {
    console.log(options);
    let {phone} = options
    this.setData({
      phone
    })
  },
})