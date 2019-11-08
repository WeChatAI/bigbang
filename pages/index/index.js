//Page Object
var plugin = requirePlugin("myPlugin");
Page({
  data: {
    value: '',
    words: [],
    checked: false,
    choosePOSs: 0,
    flag: true
  },
  //options(Object)
  onLoad: function(options){
    let _this = this
    wx.getSystemInfo({
      success: res => {
        let isIOS = res.system.indexOf("iOS") > -1;
        let navHeight = 0;
        if (!isIOS) {
          navHeight = 48;
        } else {
          navHeight = 44;
        }
        this.setData(
          {
            windowWidth: res.windowWidth - 110,
            backgroundHeight: res.windowHeight,
            status: res.statusBarHeight,
            navHeight: navHeight,
            statusBarHeight: res.statusBarHeight + navHeight
          },
          () => {
            this.setData({
              show: true
            });
          }
        );
      }
    });
    let val = '在微信智言与微信智聆两大技术的支持下，微信AI团队推出了“微信对话开放平台”和“腾讯小微”智能硬件两大核心产品。微信支付团队最新发布的“微信青蛙Pro”在现场设置了体验区，让大家感受AI认脸的本事。'
    _this.getData(val)
  },
  onReady: function(){
  },
  onShow: function(){
    
  },
  onHide: function(){

  },
  onUnload: function(){

  },
  onPullDownRefresh: function(){

  },
  onReachBottom: function(){

  },
  onShareAppMessage: function(){

  },
  onPageScroll: function(){

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item){

  },
  chooseP:function(e) {
    this.setData({
      choosePOSs: e.currentTarget.dataset.code,
      flag: true
    })
  },
  chooseW:function(e) {
    this.setData({
      choosePOSs: e.currentTarget.dataset.code,
      currentIndex: e.currentTarget.dataset.index,
      flag: false
    })
  },
  back:function() {
    wx.navigateBack({
     
    });
  },
  bindconfirm:function (e) {
    let _this = this
    if (_this.data.value === '') {
      return false
    }
    _this.getData(e.detail.value)
  },
  bindinput:function(e) {
    this.setData({
      value: e.detail.value
    })
  },
  btn:function() {
    let _this = this
    if (_this.data.value === '') {
      return false
    }
    _this.getData(_this.data.value)
  },
  getData:function(val) {
    let _this = this
    plugin.api.tokenize(val).then(e => {
      let entitiesBoolean = false
      if (e.entities.length !== 0) {
         entitiesBoolean = true
      }
      let words = []
      e.words.forEach((item, index) => {
        if (item === ' ') {
          item = '空格'
        }
        words.push({date: e.POSs[index], data: item})
      })

      let words_mix = []
      e.words_mix.forEach((item, index) => {
        if (item === ' ') {
          item = '空格'
        }
        words_mix.push({date: e.POSs_mix[index], data: item})
      })

      let obj = { entities: e.entities, entity_types: e.entity_types }

      let typeArr = [...obj.entity_types]
      let entArr = [...obj.entities]
      let objs = {}
      typeArr.forEach((item, index) => {
        if (!objs[item]) {
          objs[item] = new Array()
          objs[item].push(entArr[index])
        } else {
          objs[item].push(entArr[index])
        }
      })
      let properNoun = []
      for(var i in objs) {
        properNoun.push({date: i, data:objs[i]})
      }
      let POSs = [...new Set(e.POSs)]
      let POSs_mix = [...new Set(e.POSs_mix)]
      _this.setData({
        choosePOSs: _this.data.checked ? e.POSs_mix[0] : e.POSs[0],
        terms_top_border: true,
        value: val,
        words: words,
        words_mix: words_mix,
        POSs: POSs,
        POSs_mix: POSs_mix,
        entities: e.entities,
        entity_type: e.entity_types,
        properNoun: properNoun,
        entitiesBoolean: entitiesBoolean
      })
    })
  },
  change:function(e) {
    if (e.detail.value) {
      this.setData({
        checked: e.detail.value
      })
    }else {
      this.setData({
        checked: e.detail.value
      })
    }
  }
});