// index.js
// 获取应用实例
import { request } from "../../utils/request";
Page({
  data: {
    renkingList: [],
    nickName: "",
    avatarUrl: "",
  },
  onShow() {
    this.getRanking();
  },
  // 获取热榜
  async getRanking() {
    try {
      const data = await request({
        url: "/toplist/detail",
      });
      if (data && data.code === 200) {
        this.setData({
          renkingList: data.list,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  // 点击登录
  goLogin() {
    wx.getUserProfile({
      desc: "用于完善会员资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res);
        let { nickName, avatarUrl } = res.userInfo;
        this.setData({
          nickName,
          avatarUrl,
        });
      },
    });
  },
});
