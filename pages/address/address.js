// pages/address/address.js


const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  //通过微信添加地址
  wxAddress: function () {
    var that=this;
    var temp_addres = that.data.areaList;
    wx.chooseAddress({
      success: function (res) {
        var address = {
          "name": res.userName,
          "phone": res.telNumber,
          "province": res.provinceName,
          "city": res.cityName,
          "county": res.countyName,
          "detailInfo": res.detailInfo,
        };
        temp_addres.push(address);
         //获取到的地址存到data里的areaList中
        that.setData({     
          areaList:temp_addres
        });
        console.log(that.data.areaList);
      },
      fail: () => {
        this.openConfirm()   // 如果获取地址权限失败，弹出确认弹窗，让用户选择是否要打开设置，手动去开权限
      }
    })
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