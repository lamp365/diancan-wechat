// pages/my/my-add-address/index.js
import {Base} from "../utils/base.js";
import {Addrerss, Address} from "../utils/address.js";

var city_new = require('../utils/city.js');
var cityData_new = city_new.data.RECORDS;
var app = getApp();
var BaseObj = new Base();
var address = new Address();

var provinceName = '' // 选择省区 -名字
var province_id = ''; // 选择省区 -id

var cityName = '' // 选择市区 - 名字
var city_id = ''; // 选择省区 -id

var countyName = '' // 选择县区 -名字
var county_id = ''; // 选择省区 -id

// 所有的 省市区 集合  
var result_province = cityData_new.filter(
  function (value) {
    return (value.level_type == 1);
  }
);
var result_city = cityData_new.filter(
  function (value) {
    return (value.level_type == 2);
  }
);
var result_county = cityData_new.filter(
  function (value) {
    return (value.level_type == 3);
  }
);

// 当前的 省市区 集合
var province_s = result_province
var city_s = []; // “市区”集合
var county_s = [];// “县区”集合

Page({
  /**
    * 控件当前显示的数据
    * provinces:所有省份
    * citys 选择省对应的所有市,
    * areas 选择市对应的所有区
    * consigneeRegion：点击确定时选择的省市县结果
    * animationAddressMenu：动画
    * addressMenuIsShow：是否可见
    */
  /**
   * 页面的初始数据
   */
  data: {

    consigneeName: "", 
    phone: "",
    consigneeRegion: "",
    detailedAddress: "",
    labelList: ["家", "公司", "学校"],            //标签
    labelDefault: 0,              // 标签默认,

     // 城市数据
     provinces: province_s,
     citys: city_s,
     countys: county_s,
     cityValue: [0, 0, 0],
     cityText: '',
     cityCode: '',
     isCity: true, // 是否选择弹出 选择城市
     provinceName:provinceName,
     cityName:cityName,
     countyName:countyName
     
  },

    // 点击所在地区弹出选择框
    select: function (e) {
      this.setData({
        isCity: false
      })
    },

     /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    if(id){
      //目前系统设定只有一条的规则
      this.getAddrerss();
    }
    //城市
    // 获取第一列元素 -- 北京
    city_s = this.selectResultAction(result_city, 110000);//130000
    // console.log(result_city);console.log(city_s);
    county_s = this.selectResultAction(result_county, 110100); //130100    秀屿区或者县区
      //  console.log(result_county);console.log(county_s);
    this.setData({
      provinces: province_s,
      citys: city_s,
      countys: county_s,
      // isAddAdress: data.isAddAdress
    });
    // this.setData({
    //   cityValue: data.cityValue
    // });
  },
  selectResultAction: function (data, event) {

    var result = data.filter(
      function (value) {
        return (value.parent_id == event);
      }
    );
    return result;
  },

  //城市选择器
  cityChange: function (e) {
    var val = e.detail.value // 改变的picker 每一列对应的下标位置
    var t = this.data.cityValue; // 原本的位置 
    if (val[0] != t[0]) { // 第一列改变
      city_s = [];
      county_s = [];
      var current_id = province_s[val[0]].id;
      city_s = this.selectResultAction(result_city, current_id);
      var current_city_id = city_s[0].id;
      county_s = this.selectResultAction(result_county, current_city_id);
      this.setData({
        citys: city_s,
        countys: county_s,
        cityValue: [val[0], 0, 0]
      })
      return;
    }
    if (val[1] != t[1]) {// 第二列改变
      county_s = [];
      var current_city_id = city_s[val[1]].id;
      county_s = this.selectResultAction(result_county, current_city_id);
      this.setData({
        countys: county_s,
        cityValue: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {// 第三列改变
      this.setData({
        county: this.data.countys[val[2]],
        cityValue: val
      }) 
      return;
    }
  },


  //取消后者确定选择
  ideChoice: function (e) {
    var that = this;
    var $act = e.currentTarget.dataset.act;
    var $mold = e.currentTarget.dataset.mold;

    //城市
    if ($act == 'confirm' && $mold == 'city') {

      var t = this.data.cityValue; // 原本的位置 

      // 记录当前选择的省市区ID  
      province_id = province_s[t[0]].id;
      city_id = city_s[t[1]].id;
      county_id = county_s[t[2]].id;
    
    // 记录当前选择的省市区名称
      provinceName = province_s[t[0]].name;
      cityName = city_s[t[1]].name;
      countyName = county_s[t[2]].name;

      that.cityText = provinceName + ' - ' + cityName + ' - ' + countyName
      that.cityCode = province_id + ' - ' + city_id + ' - ' + county_id
      that.setData({
        cityText: that.cityText,
        cityCode: that.cityCode,
        provinceName:provinceName,
        cityName:cityName,
        countyName:countyName
      })
    }

    that.setData({
      isCity: true
    })
  },

  getAddrerss:function(){
    var that = this;
    address.getAddress((addressInfo) => {
      var addres_name = addressInfo.province+'-'+addressInfo.city+'-'+addressInfo.country;
      that.setData({
        consigneeName: addressInfo.name, 
         phone: addressInfo.mobile,
         consigneeRegion: addres_name,
         detailedAddress: addressInfo.detail,
      })
    });
  },

  consigneeNameInput: function(e) {
    
    this.setData({
      consigneeName: e.detail.value
    })
  },
  phoneInput: function(e) {
    
    this.setData({
      phone: e.detail.value
    })
  },
  detailedAddressInput: function (e) {
    this.setData({
      detailedAddress: e.detail.value
    })
  },
  chooseLabelSelect: function(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      labelDefault: index
    })
  },
  submit: function() {
    var formData = {};
    formData.name = this.data.consigneeName;
    formData.mobile = this.data.phone;
    formData.province = this.data.provinceName;
    formData.city = this.data.cityName;
    formData.country = this.data.countyName;
    formData.detail = this.data.detailedAddress;
    formData.is_default = this.data.labelDefault;

    var consigneeRegion = this.data.cityText;
    if (formData.name == "") {
      BaseObj._showMessageToast('请输入姓名');
      return false
    }
    if (formData.mobile == "") {
      BaseObj._showMessageToast('请输入手机号码');
      return false
    }
     if (consigneeRegion == "") {
      BaseObj._showMessageToast('请选择所在地区');
      return false
    }
     if (formData.detail == "") {
      BaseObj._showMessageToast('请输入详细地址');
      return false
    }
    var param = {
      url: 'address',
      type: 'post',
      data: formData,
      sCallback: function(res) {
        console.log(res);
      },
      eCallback(res) {
        console.log(res);
      }
    };
    BaseObj.request(param);
    
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