// pages/renking/renking.js
import {
  request
} from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankingInfo:{},
    rankingDetailList:[]
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
  }
})