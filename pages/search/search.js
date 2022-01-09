// pages/search/search.js
import { request } from "../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hotList: [],
    queryList:[],
    queryCode:'',
    historySearch:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHotList();
  },
  onShow:function(){
    this.getHistorySearch()
  },
  async getHotList() {
    try {
      const data = await request({
        url: "/search/hot/detail",
      });
      if (data && data.code === 200) {
        const hotList = data.data;
        this.setData({
          hotList,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  getHistorySearch(){
    let that = this
    wx.getStorage({
      key: "his",
      success(res) {
        let {data} = res
        that.setData({historySearch:data})
      }})
  },
  TimeId : -1,
  // 用户输入 搜索
  inputSearch(e) {
    let { value } = e.detail;
    // 防抖
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.getQueryList(value);
    }, 1000);
    this.setData({
      queryCode: value,
    });
  },
  async getQueryList(val){
    try {
      const data = await request({
        url: '/search/suggest?keywords='+val+'&type=mobile'
      });
      if (data && data.code === 200) {
        console.log(data.result.allMatch);
        this.setData({
          queryList:data.result.allMatch
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  // 删除历史记录
  handleDelect(){
    let that = this
    wx.removeStorage({
      key: 'his',
      success () {
        that.setData({historySearch:[]})
      }
    })
  }
});
