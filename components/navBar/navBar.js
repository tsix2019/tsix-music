// components/navBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    backImgUrl:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goHome(){
      wx.reLaunch({
        url: '/pages/index/index'
      })
    },
    goBack(){
      wx.navigateBack()
    }
  }
})
