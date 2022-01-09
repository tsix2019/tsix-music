// pages/playPage/playPage.js
import {
  request
} from "../../utils/request"
Page({

  data: {
    musicUrl: '',
    backgroundAudioManager: null
  },
  onLoad: function (options) {
    let {
      id,
      name
    } = options
    this.getMusicPlay(id, name)
  },
  async getMusicPlay(id, name) {
    try {
      const data = await request({
        url: '/song/url?id=' + id
      })
      if (data && data.code === 200) {
        this.setData({
          musicUrl: data.data[0].url
        })
        this.backgroundAudioManager = wx.getBackgroundAudioManager();
        this.backgroundAudioManager.title = name,
          this.backgroundAudioManager.src = data.data[0].url
      }
    } catch (err) {
      console.log(err);
    }
  }
})