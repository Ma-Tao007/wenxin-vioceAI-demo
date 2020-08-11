<template>
  <div class="body">
      <div style="background-color: #ffffff;">
        <!-- 语音输入 -->
        <!-- 内容展示 -->
        <div>
           识别的内容：{{contain}}

        </div>
        <div>
          <button @touchstart='start()' @touchend='stop()' style="font-size:35px" > {{btntext}}</button>
        </div>
                <!-- 录音图标 -->
        <div :class="dialog" id="iosDialog2">
            <!-- 不要蒙层 -->
            <!-- <div class="weui-mask"></div> -->
            <div class="weui-dialog">
                <div class="popup weui-dialog__bd" id="popup">
                    <img width="50%" style="margin: auto;" src="../../static/image/timg.gif" alt="">
                    <label v-if="showTimer" class='timer'>{{timer}}s</label>
                </div>
            </div>
        </div>
      </div>
  </div>
</template>

<script>
//获取签名的服务器方法（需要自己写）
import { getSDK } from "@/api/wxconfig"
export default {
  data() {
    return {
      contain:'',
      dialog:'js_dialog',//js_dialog
      timer:null,//录音时长
      showTimer:null,//是否展示时间
      endTime:null,//结束时间
      startTime:null,//开始时间
      autoCloseRecord:null,//自动关闭的定时器
      btntext:'按下录音'
    };
  },
  created(){
    this.getWinData()
  },
  methods: {
    getWinData(){
      //请求接口，获取签名认证
      getSDK({url:location.href.split('#')[0]}).then(res=>{
        /** 返回的数据格式（自定义）
         *  jsapi_ticket: "sM4AOVdWfPE4DxkXGEs8VDb3tCZLwWh-jvUS-Wl7l7HumrACgR-IM5YmedNesCw-7ECnqNye1F93UNkjO80lSA"
            //必须
            noncestr: "Wm3WZYTPz0wzccnW"
            //必须
            signature: "2e5e8aeaf6b90fa4b6055907fa94fee5f9e0ef99"
            //必须
            timestamp: 1597105774
            wxurl: "http://192.168.1.136:8080/contain"
         */
        console.log("返回的结果：",res)
        wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: 'wx26fee60efc7b000e', // 必填，公众号的唯一标识
        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.data.noncestr, // 必填，生成签名的随机串
        signature: res.data.signature,// 必填，签名
        jsApiList: [
           "chooseImage",
                "startRecord",
                "stopRecord",
                "onVoiceRecordEnd",
                "playVoice",
                "pauseVoice",
                "stopVoice",
                "onVoicePlayEnd",
                "translateVoice"
        ] // 必填，需要使用的JS接口列表
      });
      })
      var that = this
      wx.ready(function(){
                wx.checkJsApi({
                    jsApiList: ['chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                    success: function(res) {
                        // 以键值对的形式返回，可用的api值true，不可用为false
                        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                        console.log("ready返回",res);
                    }
                });
            });
            wx.error(function(res){
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
              alert("config验证失败")
              console.log("config验证失败");
            });

    },
    start(){
      this.btntext = '松开结束'
      this.startTime = new Date().getTime()
      this.dialog = ''
      this.timer = 60
      //一分钟自动停止录音
      this.autoCloseRecord = setInterval(()=>{
          this.timer --
          if(this.timer == 10){
              this.showTimer = true
          }
          if(this.timer==0){
              this.stop()
          }
      },1000)
      wx.startRecord();
    },
    stop(){
      this.btntext = '按下录音'
      this.dialog = 'js_dialog'
      var _this = this
      this.timer = 60
      this.showTimer = false
      clearTimeout(this.autoCloseRecord)
      this.endTime = new Date().getTime()
      let duration = ((this.endTime - this.startTime)/1000).toFixed(0)
      if(this.contain.length>=10){
        wx.stopRecord()
        return
      }
      if(duration<2){
          alert("录音时间太短")
          wx.stopRecord()
        }else{
          wx.stopRecord({
              success: function (res) {
                console.log("录音结束：",res)
                  var localId = res.localId;
                  wx.translateVoice({
                      localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
                      isShowProgressTips: 1, // 默认为1，显示进度提示
                      success: function (res) {
                          // 语音识别的结果
                          const result = res.translateResult
                          var str =  _this.contain + result
                          //截取前maxNum
                          _this.contain = str.substring(0,_this.maxNum)
                      }
              });
              },
              error:function(res){
                  alert("未检测到内容")
              }
        });
      }
    },
  }
};
</script>
<style>
/* 整体的样式 */
.body {
  height: 100%;
  font-size: 15px;
  user-select: none;
}

.time {
  border-top: 1px #e0e0e0 solid;
}

/*所有的图标 */
.dream {
  font-size: 20px;
}
.js_dialog{
  display: none;
}

.popup{
  width: 100%;
   height: 200px;
  margin: auto;
  border-radius: 12px;
}

</style>
