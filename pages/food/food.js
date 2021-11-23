// pages/category/category.js

import {
  Category
} from 'food-model.js';
import {Cart} from "../cart/cart-model.js"
import { Base } from '../utils/base.js';
var category = new Category;
var cart = new Cart();
var BaseObj = new Base();
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryTypeArr: {},
    categoryProducts: {},
    currentMenuIndex: 0,
    loadedData: {},
    bannerArr:[],

    is_nodata:false,  
    nav_act_content:1, //控制显示 菜品或者商家
    sysData:'', //系统数据
    recommendProduct:[],

    bannerHeight:0,
    navHeight:0,
    categoryBoxHeight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._loadData();
    this.getBanner();
    this.getClientHeight();
  },
  getBanner:function(){
    var bannerArr = [
      {'image':"../../imgs/baner1.jpg"},
      {'image':"../../imgs/baner2.jpg"},
      {'image':"../../imgs/baner2.jpg"},
      {'image':"../../imgs/baner2.jpg"}
    ];
    this.setData({bannerArr:bannerArr})
  },

  getClientHeight:function(){
    var that = this;
    wx.getSystemInfo({
      success: (result) => {
        var screeHight = wx.getSystemInfoSync().windowHeight;//获取屏幕高度
        that.setData({clientHight:screeHight});
      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
     
  },

  //判断当前分类下的商品数据是否已经被加载过
  isLoadedData: function(index) {
    if (this.data.loadedData[index]) {
      return true;
    }
    return false;
  },

  _loadData: function() {
    category.getCategoryType((categoryData) => {
      this.setData({
        'categoryTypeArr': categoryData
      });

      //一定要在回调里再进行获取分类详情的方法调用
      category.getProductsByCategory(categoryData[0].id, (data) => {
        if(data == 0){
            var dataObj = {};
            var is_nodata = true;
        }else{
          var dataObj = {
            products: data,
            topImgUrl: categoryData[0].img.url,
            title: categoryData[0].name
          };
          var is_nodata = false;
        }
       
         
        //数据绑定
        this.setData({
          'categoryProducts': dataObj,
           is_nodata :is_nodata
        });
        //第一次加载保存到loadedData中
        this.data.loadedData[0] = dataObj;
      });
    })


  },

  onProductsItemTap: function(event) {
    var id = category.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  },

  changeCategory: function(event) {
    var id = category.getDataSet(event, 'id');
    var index = category.getDataSet(event, 'index');

    this.setData({
      'currentMenuIndex': index
    });
    //内容回滚顶部
    var scrollTopUp = this.data.categoryBoxHeight == 0? 355:this.data.categoryBoxHeight;
    wx.pageScrollTo({
      scrollTop: scrollTopUp
    });

    if (!this.isLoadedData(index)) {
      //如果没有加载过当前分类的商品数据
      category.getProductsByCategory(id, (data) => {
        var dataObj = {};
        if(data == 0){
          var is_nodata = true;
        }else{
          var dataObj = {
            products: data,
            topImgUrl: this.data.categoryTypeArr[index].img.url,
            title: this.data.categoryTypeArr[index].name
          };
          var is_nodata = false;
        }
        // console.log(Object.keys(dataObj).length);
        this.setData({
          'categoryProducts': dataObj,
          'is_nodata' :is_nodata
        });
        //第一次加载保存到loadedData中
        this.data.loadedData[index] = dataObj;
      });
    } else {
      //不是第一次加载就使用loadedData
      var getData = this.data.loadedData[index];
      var is_nodata = false;
      if(Object.keys(getData).length == 0)
          is_nodata = true;
      this.setData({
        'categoryProducts': getData,
        is_nodata : is_nodata
      });
    }
  },
  onShow:function(){
    var that = this;
    setTimeout(function(){
      wx.setNavigationBarTitle({
        title: app.globalData.web_title
      })
      that.setData({sysData:app.globalData.sysData});
      
    },1000)
    setTimeout(function(){
      //获取nav 高度  页面加载完毕需要时间，所以延迟计算
      that.getNodeInfoById('navHeight');
      that.getNodeInfoById('categoryBoxHeight');
    },4000)
    //获取推荐
    this.getRecommendProduct();
   
  },
  getRecommendProduct:function(res){
    var that = this;
    var parame ={
      url:'product/recommend',
      sCallback:function(res){
       if(Object.keys(res).length > 0){
          that.setData({recommendProduct:res})
       }  
      }
    };
    BaseObj.request(parame);
  },
  stopMaopao:function(){
    console.log(1);
    return false;
  },

  addToCart: function(event) {
    var this_id = category.getDataSet(event, 'id');
    var category_id = category.getDataSet(event, 'category_id');
    var categoryProducts = this.data.categoryProducts;
    var products_arr = categoryProducts.products;
    var this_product = {};
    for(var i=0;i<products_arr.length;i++){
      var one_item = products_arr[i];
      if(one_item.id == this_id){
        this_product = one_item;
      }
    }
    // console.log(products_arr);
    var tempObj = {};
    var keys = ['id', 'name', 'main_img_url', 'price'];

    //遍历商品的详情数据对象,根据keys对tempObj赋值
    for (var key in this_product) {
      if (keys.indexOf(key) >= 0) {
        tempObj[key] = this_product[key];
      }
    }
    cart.add(tempObj, 1);
    BaseObj._showMessageToast('已加购物车');
  },
  choose_nav:function(e){
    var nav_act_content = category.getDataSet(e,'act')
    this.setData({nav_act_content:nav_act_content})
  },
  onPageScroll: function (e) {//监听页面滚动 
    console.log(e);
    this.setData({
      scrollTop: e.scrollTop
    })
  },


  // 获取页面节点信息的方法(nodeName 节点id名称)
  getNodeInfoById(nodeName) {
    var that = this;
    const query = this.createSelectorQuery();
    query.select(`#${nodeName}`).boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec(res => {
      console.log(res);//有 height top left width等
      if(nodeName == 'navHeight'){
        that.setData({navHeight:res[0].height});
      }
      if(nodeName == 'categoryBoxHeight'){
        that.setData({categoryBoxHeight:res[0].top});
      }
     
    });
  },


  callMobile:function(){
    var mobile = app.globalData.sysData.tel;
    // console.log(mobile);
    wx.makePhoneCall({
      phoneNumber: mobile,
    })
  },
})