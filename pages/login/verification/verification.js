// pages/login/verification/verification.js
import {
  request
} from "../../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    outTime: 60, // 验证码60s
    phone: null,
    inputLen: 4,
    iptValue: "",
    isFocus: false,

  },
  onLoad(options) {
    console.log(options);
    let {
      phone
    } = options
    this.setData({
      phone
    })
    // 发送验证码
    this.sendCode(phone)
  },

  onFocus(e) {
    this.setData({
      isFocus: true
    });
  },
  setValue(e) {
    let {
      cursor,
      value
    } = e.detail
    let {
      phone,inputLen
    } = this.data
    console.log(value);
    this.setData({
      iptValue: value
    });
    // 当输入的是最后一位，校验code
    if (cursor == inputLen) {
      try {
        const data = request({
          url: `/captcha/verify?phone=${phone}&captcha=${value}`
        })
        if(data.data && data.code === 200){
          wx.showToast({
            title: '验证码发送成功',
            icon: 'none'
          })
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
  // 发送验证码
   async sendCode(phone){
    try {
      const data = await request({
        url: `/captcha/sent?phone=${phone}`
      })
      if(data.data && data.code === 200){
        wx.showToast({
          title: '验证码发送成功',
          icon: 'none'
        })
      }
    } catch (err) {
      console.log(err);
    }
  }
})