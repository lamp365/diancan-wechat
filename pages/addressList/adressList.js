// pages/addressList/adressList.js
import {
  Base
} from '../../pages/utils/base.js';
import {
  Address
} from '../../pages/utils/address.js';

var address = new Address();
var BaseObj = new Base();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo:[],
    isNoData:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this._getAddressInfo();
  },
 //获取地址信息
 _getAddressInfo: function() {
   var that = this;
  address.getAddress((addressInfo_res) => {
    var isNoData = true;
    if(Object.keys(addressInfo_res).length>0){
         isNoData = false;
    }
    that.setData({
      'addressInfo':addressInfo_res,
      isNoData:isNoData
    })
  
  });
 
},

gotoAdd:function(){
  wx.navigateTo({
    url: '../myAddress/myAddress',
  })
},


bindEdit:function(e){
  var id = e.currentTarget.dataset.id;
  wx.navigateTo({
    url: '../myAddress/myAddress?id='+id,
  }) 
},

bindDel:function(e){
  var id = e.currentTarget.dataset.id;
  var that = this;
  var parame = {
    url:'delAddress', 
    data:{id:id},
    type:'post',
    sCallback:function(res){
        that.setData({addressInfo:[],isNoData:true});
    }
  }
  BaseObj.request(parame);
  
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this._getAddressInfo();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})