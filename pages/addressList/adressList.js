// pages/addressList/adressList.js

import {
  Address
} from '../../pages/utils/address.js';

var address = new Address();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getAddressInfo();
  },
 //获取地址信息
 _getAddressInfo: function() {
   var that = this;
  address.getAddress((addressInfo) => {
    that.setData({
      addressInfo:addressInfo
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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