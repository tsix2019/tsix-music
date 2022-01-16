let ajaxTimes=0 //同时发送异步代码的次数

export const request = (params) => {
  //判断url中是否带有 /my/ 请求的是私有路径，带上header token
  let header={...params.header}
  // if(params.url.includes("/my")){
  //   //拼接header 带上token
  //   header["Authorization"]=wx.getStorageSync('token')
  // }
  ajaxTimes++
  //显示加载中 效果
  wx.showToast({
    title: '加载中...',
    icon:'none',
    mask:true
  })
  //定义公共的url
  const baseUrl = 'http://192.168.7.135:3000';
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header:header,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result.data)
      },
      fail: (err) => {
        reject(err)
      },
      complete:() => {
        ajaxTimes--
        if(ajaxTimes ===0){
          //关闭等待loading
          wx.hideToast()
        }      }
    })
  })
}