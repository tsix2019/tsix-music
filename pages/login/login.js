// pages/login/login.js
Page({
  data: {
    phone:null,
  },
  // 输入手机号
  inputPhone(e){
    let value = e.detail
    this.setData({
      phone:value,
    });
  },
  // 输完手机号 下一步
  next(){
    console.log(this);
    let phone = this.data.phone.value
    wx.navigateTo({
      url:'/pages/login/verification/verification?phone=' + phone,
    })
  }
})