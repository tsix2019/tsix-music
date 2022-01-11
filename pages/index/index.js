// index.js
// 获取应用实例
import { request } from "../../utils/request";
Page({
  data: {
    renkingList: [],
    renkingMore:[],
    nickName: "",
    avatarUrl: "",
  },
  onLoad(){
    let that = this
    wx.getStorage({
      key:"userInfo",
      success(res){
        console.log(res);
        let {avatarUrl,nickName} = res.data
        that.setData({
          nickName,
          avatarUrl,
        });
      }
    })
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
         let tmpList = data.list.splice(4) // 保留前4个用于滑动第一页
         // splice 会改变原来的数组 
        this.setData({
          renkingList: data.list,
          renkingMore:tmpList
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
        wx.setStorage({
          key:"userInfo",
          data:{nickName,avatarUrl}
        })
      },
    });
  },
  // 退出登陆
  outLogin(){
    let that = this
    wx.removeStorage({
      key: 'userInfo',
      success () {
        that.setData({
          avatarUrl:"",
          nickName:""
        })
        wx.showToast({title:"退出登陆成功",icon:"none"}) 
      }
    })
  },
});
