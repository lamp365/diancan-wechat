// pages/my/my.js

import {
  My
} from 'my-model.js';

import {
  Order
} from '../order/order-model.js';

import {
  Address
} from '../../pages/utils/address.js';
import {Config} from '../../pages/utils/config.js';

var my = new My();
var address = new Address();
var order = new Order();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    orderArr: [],
    isLoadedAll: false,
    status:0,

    picBaseUrl:Config.picUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._loadData();
  },

  onShow: function() {
    var newOrderFlag = order.hasNewOrder();
    if (newOrderFlag) {
      this.refresh();
    }

  },

  //重新加载历史订单
  refresh: function() {
    var that = this;
    this.data.orderArr = []; //订单初始化
    this._getOrders(() => {
      that.data.isLoadedAll = false; //是否加载完全
      that.data.index = 1;
      order.execSetStorageSync(false);
    });
  },




  //初始化
  _loadData: function() {
    //获取用户名称与头像信息(接口升级已废弃)
    /*
    my.getUserInfo((data) => {
      this.setData({
        userInfo: data
      });
    });
    */

    this._getOrders();
  },

  _getOrders: function(callback) {
    order.getOrders(this.data.pageIndex, this.data.status,(res) => {
      var data = res.data;
      if (data.length) {
        this.data.orderArr.push.apply(this.data.orderArr, data);
        this.setData({
          orderArr: this.data.orderArr
        });
      } else {
        this.setData({isLoadedAll:true})
      }
      callback && callback();
    });
  },

  getOrderItem:function(e){
    var status = e.currentTarget.dataset.status;
    this.setData({status:status,orderArr:[],isLoadedAll:false,pageIndex:1});
    this._getOrders();
  },
  onReachBottom: function() {
    if (!this.data.isLoadedAll) {
      var newPage = this.data.pageIndex+1;
      this.setData({pageIndex:newPage});
      this._getOrders();
    }
  },

  //去订单详情页面
  showOrderDetailInfo: function(event) {
    var id = order.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../order/order?from=order&id=' + id,
    });
  },

  //历史订单的再次付款
  rePay: function(event) {
    var id = order.getDataSet(event, 'id'),
      index = order.getDataSet(event, 'index');
    this._execPay(id, index);
    // this.showTips('支付提示', '本产品仅用于演示，支付系统已屏蔽');
  },

  _execPay: function(id, index) {
    var that = this;
    order.execPay(id, (statusCode) => {
      if (statusCode > 0) {
        var flag = statusCode == 2;

        //更新订单显示状态
        if (flag) {
          that.data.orderArr[index].status = 2;
          that.setData({
            orderArr: that.data.orderArr
          });
        }

        //跳转到成功页面
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=my',
        });
      } else {
        that.showTips('支付失败', '该商家不支持收款');
      }
    });
  },

  addressList:function(){
    wx.navigateTo({
      url: '../addressList/adressList',
    })
  },


  /*
   *提示窗口
   *title-{string}标题
   *content{string}内容
   */
  showTips: function(title, content) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function(res) {}
    })
  }
})