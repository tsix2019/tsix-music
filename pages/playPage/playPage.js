// pages/playPage/playPage.js
import {
  request
} from "../../utils/request"
Page({

  data: {
    musicUrl: [],
    bgm: null,
    index:0, // 当前播放的第几首 
  },
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('openPlay',({data})=>{
      console.log(data);
      let idStr = ''
      data.forEach((item,index)=>{
        // 最后一个id后面不用加 ,
        idStr+=item[0]
        if(data.length !== index+1){
          idStr += ','
        }
      })
      console.log(idStr);
      this.getMusicPlay(idStr)
    })
  },
  async getMusicPlay(idStr, name) {
    try {
      const data = await request({
        url: '/song/url?id=' + idStr
      })
      if (data && data.code === 200) {
        console.log(data);
        let musicUrl = []
        data.data.forEach(item=>{
          musicUrl.push(item.url)
        })
        this.setData({
          musicUrl,
        })
        this.bgm = wx.getBackgroundAudioManager();
        this.setAudio()
      }
    } catch (err) {
      console.log(err);
    }
  },
  // 暂停
  pause(){
    this.bgm.pause()
  },
  // 播放
  start(){
    this.bgm.play()
  },
  // 上一首
  playPrev(){
    let {index} = this.data
    if(index === 0) return wx.showToast({title:"已经是第一首了",icon:"none"}) 
    index -=1
    this.setData({
      index,
    })
    this.setAudio();
  },
  // 下一首
  playNext(){
    let {index,musicUrl} = this.data
    if(index === musicUrl.length-1) return wx.showToast({title:"已经是最后一首了",icon:"none"}) 
    index +=1
    this.setData({
      index
    })
    this.setAudio();
  },
  // 播放新的音频
  setAudio() {
    this.bgm.title = '的撒旦撒旦';
    this.bgm.src = this.data.musicUrl[this.data.index]
    console.log(this.bgm.src);
  },
})