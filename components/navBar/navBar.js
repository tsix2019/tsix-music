// components/navBar.js
Component({
  // 在组件实例进入页面节点树时执行
  attached(){
    // 计算navbar的高度 = 通知栏的高度(android约22 ,ios 约 44) + 微信的nav固定44
    let statusBarHeight = 0
    wx.getSystemInfo({success:(res)=>{
      statusBarHeight = res.statusBarHeight
    }})
    let navHeight = statusBarHeight + 44
    console.log(navHeight);
    this.setData({
      statusBarHeight,
      navHeight
    })
  },
  properties: {
    backImgUrl:{
      type:String
    },
    musicName:{
      type:String
    },
    singer:{
      type:Array
    },
    rankingName:{
      type:String
    },
    playPage:{
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    navHeight:0
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
