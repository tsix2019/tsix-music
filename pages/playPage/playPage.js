// pages/playPage/playPage.js
import {
  request
} from "../../utils/request"
import {formateTime} from '../../utils/formateTime'
import {formatLyric} from '../../utils/formatLyric'
const bgm = wx.getBackgroundAudioManager();
const app = getApp()
Page({

  data: {
    musicUrl: [],
    bgm: null,
    index:0, // 当前播放的第几首 
    songInfo:[],// 当前播放歌曲的信息
    playState:1,// 播放状态 1播放 0暂停
    musicLenth:null,// 音乐的时间长度 
    sliderValue:0,// 音乐播放的进度
    musicAUnitTime:0,// 音乐长度百分之1所占的时间(音乐一个单位的时间)
    musicPlayTime:0,//音乐当前播放的时间
    musicTime:'0:00',// 音乐的时间
    currentTime:'0:00', // 已经播放的时间
    lyric:'',// 处理过的歌词
    lyricIndex:0,// 当前歌词的下标
    touchmoveTop:0,// 向上滑动了多少px
    showSongReview:false,
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
    // 监听bgm的播放
    bgm.onTimeUpdate(()=>{
      let {currentTime,duration} = bgm // 当前播放的时间
      let {lyric,lyricIndex} = this.data
      currentTime = parseInt(currentTime)
      // 查找当前播放时间，在歌词里面时间的 index，false会返回-1，其他的正常返回lyric数组的index
      let index = lyric.findIndex(item=>{
        if(item.time === currentTime){
          return item
        }
      })
      // 如果index 为false && lyricIndex 重复 跳出去，避免重复设置data
      if(index !== -1 && lyricIndex !== index){
        this.setData({
          lyricIndex:index
        })
      }
      // console.log(currentTime);
      // TODO: 歌词还没有完成
      // console.log(this.data.lyric)
      // 当前播放的进度 进度条 总的秒/当前秒
      let sliderValue = (currentTime / duration) * 100
      currentTime = formateTime(currentTime)
      this.setData({currentTime,sliderValue})
    }),
    // 监听bgm需要停下来加载
    bgm.onError(()=>{
      wx.showToast({
        title:"加载中,很快就好...",
        icon:"icon",
        mask:"false"
      })
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
          musicUrl.push({id:item.id,url:item.url})
        })
        this.setData({
          musicUrl,
        })
        this.setAudio()
      }
    } catch (err) {
      console.log(err);
    }
  },
  // 单次移动进度条
  bindchange(e){
    let {value} = e.detail
    console.log('单次',value);
    let {musicAUnitTime} = this.data
    let musicPlayTime = musicAUnitTime * value
    // 控制 播放 跳转到指定的位置
    bgm.seek(musicPlayTime)
    this.start()
    this.setData({
      musicPlayTime,
    })
  },
  // 一直拖动进度条
/*   bindchanging(e){
    let {value} = e.detail
    console.log('一直拖动',value);
  }, */
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
  async setAudio() {
    let {id,url} = this.data.musicUrl[this.data.index]
    // 获取当前播放歌曲的详情（歌手，名字，歌曲图片,mv...）
    let name = ''
    try{
      const data = await request({
        url:'/song/detail?ids='+id
      })
      if(data&&data.code===200){
        let {songs} = data
        console.log(songs);
        name = songs[0].name
        this.setData({
          songInfo : songs
        })
        app.globalData.songInfo = songs
      }
    }catch(err){
      console.log(err);
    }
    // 获取歌词
    try{
      const data = await request({
        url:'/lyric?id='+id
      })
      if(data&&data.code===200){
        let {lyric} = data.lrc
        // 借助外部函数 处理一下歌词
        lyric = formatLyric(lyric)
        this.setData({
          lyric
        })
      }
    }catch(err){
      console.log(err);
    }
    bgm.title = name;
    bgm.src = url;
    // 当前歌曲的名字设置成 navigationBarTitle
    wx.setNavigationBarTitle({
      title: name
    })
    let that = this
    // 这里不延迟一下，小程序捕捉不到歌曲的总时长
    setTimeout(()=>{
      let musicLenth = bgm.duration
      let musicTime = formateTime(musicLenth)
      // 计算1%进度条的时间
      let musicAUnitTime =  musicLenth/100
      that.setData({
        playState: 1,
        musicLenth,
        musicTime,
        musicAUnitTime
      })
    },1000)
  },
  // 记录按住的第一个点
  startClientY : 0,
  touchstart(e){
    this.startClientY = e.changedTouches[0].clientY
    // console.log("startClientY",e.changedTouches[0].clientY);
  },
  // 按住移动
  touchmove(e){
    console.log(e);
    if(!(this.data.showSongReview)){
      this.setData({
        showSongReview:true
      })
    }
    // console.log(-(e.changedTouches[0].clientY - this.startClientY)); // 获取按住上滑了多少px 上滑得到的是负数
    this.setData({
      touchmoveTop:-(e.changedTouches[0].clientY - this.startClientY)
    })
  },
  // 关闭评论区
  closeReview(e){
    console.log(e);
    this.setData({
      showSongReview:false
    })
  },
  onUnload(){
    // 当页面关闭时，把音乐信息给全局data
    
  }
})