// components/playControl/playControl.js
import {formateTime} from '../../utils/formateTime'
const bgm = wx.getBackgroundAudioManager()
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes:{
    // 组件进入节点树时执行
    attached:function(){
      this.setData({
        songInfo:app.globalData.songInfo[0]
      })
      // 获取音乐的总时长
      let {duration} = bgm
      duration = formateTime(duration)
      this.setData({duration})
      // 监听 bgm的播放
      bgm.onTimeUpdate(()=>{
        let {currentTime,duration} = bgm // 当前播放的时间
        let sliderValue = (currentTime / duration) * 100
        currentTime = formateTime(currentTime)
        this.setData({sliderValue,currentTime})
      }),
      // 监听bgm需要停下来加载
      bgm.onError(()=>{
        wx.showToast({
          title:"加载中,很快就好...",
          icon:"icon",
          mask:"false"
        })
      })
    }
  },
  pageLifetimes:{
    show: function() {

    },
  },
  created(){
    
  },
  /**
   * 组件的初始数据
   */
  data: {
    songInfo:[],
    sliderValue:0,
    duration:'0:00',// 音乐的总时长
    currentTime:'0:00',// 已经播放了的时间
    playState:1,// 播放状态 1播放 0暂停
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 去播放页
    goPlayPage(){
      wx.navigateTo({
        url:'/pages/playPage/playPage'})
    },
    // 暂停
    pause(){
      bgm.pause()
      this.setData({
        playState: 0
      })
    },
    // 播放
    start(){
      bgm.play()
      this.setData({
        playState: 1
      })
    },
  }
})
