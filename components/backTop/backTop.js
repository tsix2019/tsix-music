// components/backTop/backTop.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    right:{
      type:Number,
      default: 40
    },
    bottom:{
      type:Number,
      default: 40
    },
    visibilityHeight: {
      type: Number,
      default: 200
    },
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
    backTop(){
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0
        })
      }
    }
  },
  lifetimes:{
    ready(){
      console.log('ready');
    }
  }
})
