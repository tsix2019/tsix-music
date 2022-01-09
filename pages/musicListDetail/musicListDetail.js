// pages/musicListDetail/musicListDetail.js
import { request } from "../../utils/request";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    keyword: "",
    musicDetailList: [],
    page: 0,
  },
  // 历史搜索记录
  /**
   * 生命周期函数--监听页面加载
   */
   historyList:[],
  onLoad: function (options) {
    let { keyword } = options;
    this.setData({ keyword });
    this.getMusicDetailList();
    // 保存用户搜索的记录
    wx.getStorage({
      key: "his",
      success(res) {
        let {data} = res
        // 去重
        let arr = new Set(data)
        let newA = new Set([...data,keyword])
        // 如果两个的长度一样就重合了
        if(arr.size !== newA.size){
          let newArr = [...data,keyword]
          wx.setStorage({
            key: "his",
            data: newArr,
          });
        }
      },
      // 第一次使用会导致找不到 his
      fail(){
        wx.setStorage({
          key: "his",
          data: keyword,
        });
      }
    });

  },
  async getMusicDetailList() {
    try {
      let { keyword, musicDetailList } = this.data;
      const data = await request({
        url: "/search?keywords=" + keyword + "&offset=" + this.data.page,
      });
      if (data && data.code === 200) {
        this.setData({
          musicDetailList: [...musicDetailList, ...data.result.songs],
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  // 上拉触底
  onReachBottom: function () {
    this.setData({ page: this.data.page++ });
    this.getMusicDetailList();
  },
});
