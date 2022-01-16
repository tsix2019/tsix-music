// pages/renking/renking.js
import {
  request
} from "../../utils/request"
const bgm = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankingInfo:{},
    rankingDetailList:[],
    showPlayControl:false,// 是否展示底部的播放控制
    rankingName:'', // 热榜的名字，传给navBar组件
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#6092df',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    let {id} = options
    this.getRenkingDetail(id)
  },
  onShow: function(){
    // 判断bgm里面的一个值，如果有的话就显示底部的播放控制
    console.log(bgm);
    if(bgm.src){
      this.setData({
        showPlayControl : true
      })
    }else{
      this.setData({
        showPlayControl : false
      })
    }
  },
  async getRenkingDetail(id){
    try{
      const data = await request({url:'/playlist/detail?id='+id})
      if(data && data.code === 200){
        // console.log(data.playlist.tracks);
        this.setData({
          rankingInfo:data.playlist,
        })
        wx.setNavigationBarTitle({
          title: data.playlist.name
      })
      }
    }catch(err){
      console.log(err);
    }
  },
  // 点击一首歌曲
  handAMusic(musicInfo){
    let playList = musicInfo.currentTarget.dataset.item
    console.log(playList);
    let {name,id,al:{picUrl}} = playList
    console.log(name);
    const playAllList = [[id,name,picUrl]]
    console.log(playAllList);
    wx.navigateTo({
      url:'/pages/playPage/playPage',
      success:function(res){
        res.eventChannel.emit('openPlay',{data:playAllList})
      }
    })
  },
  // 点击播放全部
  playAll(){
    let {tracks} = this.data.rankingInfo
    // 播放全部 把name picUrl 和 id 提取出来
    const playAllList = []
    tracks.forEach(item=>{
      playAllList.push([item.id,item.name,item.al.picUrl])
    })
    wx.navigateTo({
      url:'/pages/playPage/playPage',
      success:function(res){
        res.eventChannel.emit('openPlay',{data:playAllList})
      }
    })
  },
  // onPageScroll 当屏幕滚动
  onPageScroll:function(e){
    // console.log(e); // 220px = bg-wrap 滚动
    // 当滚动距离覆盖住bg-wrap navbar 就显示榜单名字
    if(e.scrollTop >= 220){
      if(this.data.rankingName) return  // 当榜单的nav名字不空时，就不必要执行setData
      let {name} = this.data.rankingInfo
      this.setData({
        rankingName:name
      })
    }else{
      if(!this.data.rankingName) return
      this.setData({
        rankingName:''
      })
    }
  }
})