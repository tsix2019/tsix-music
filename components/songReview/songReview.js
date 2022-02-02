import {
  request
} from "../../utils/request"
Component({
  lifetimes:{
    // 组件进入节点树时执行
    attached:function(){
      this.getSongReview(this.properties.musicId)
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    touchmoveTop:{
      type:String
    },
    musicId:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    songReview:'',// 评论
  },
  created(){
  },
  /**
   * 组件的方法列表
   */
  methods: {
    async getSongReview(id){
      console.log(id);
      try{
        const data = await request({url:'/comment/new?type=0&sortType=2&id='+id})
        if(data && data.code === 200){
          this.setData({
            songReview:data.data.comments
          })
        }
      }catch(err){
        console.log(err);
      }
    },
  }
})