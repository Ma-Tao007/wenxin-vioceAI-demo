# weixin-vioce-demo

> 一个基于微信公众平台的语音识别接口

##### 项目说明
    这项目是我最近做的一个需求中测试的，语音识别公众号，刚开始就是用了微信的接口，之后测试了百度和讯飞的，我都有记载，
 最后选择了讯飞的，为了以后可能需要，所以在此保存一下，项目运行需要有一个后台的接口来提供访问的access_token以及获取config

 下面是我本地的接口代码：
  ```
    //controller
    @ApiOperation("获取JS-SDK验证")
    @GetMapping("getSDK")
    public JsonWrite getJS_SDK(String url){
        return JsonWrite.SUCCESS("查询成功",weiXinUtil.getJsapi_ticket(url));
    }

    //接口
    public Map<String,Object> getJsapi_ticket(String wxurl){
        Map map = new HashMap();
        //这里是获取access_token的接口
        String url = JSAPI_TICKET_URL.replace("ACCESS_TOKEN", getAccess_Token());
        JSONObject json = doGetstr(url);
        log.info("数字签名结果："+json);
        /**
         * {
         *   "errcode":0,
         *   "errmsg":"ok",
         *   "ticket":"bxLdikRXVbTPdHSM05e5u5sUoXNKd8-41ZO3MhKoyN5OfkWITDGgnr2fwJ0m9E8NYzWKVZvdVtaUgWvsdshFKA",
         *   "expires_in":7200
         * }
         */
        String noncestr= "Wm3WZYTPz0wzccnW";
        String jsapi_ticket = json.getStr("ticket");
        long timestamp = DateUtil.currentSeconds();
        String str = "jsapi_ticket="+jsapi_ticket+"&noncestr="+noncestr+"&timestamp="+timestamp+"&url="+wxurl;
        String signature = sha1(str);
        map.put("signature",signature);
        map.put("timestamp",timestamp);
        map.put("noncestr",noncestr);
        map.put("jsapi_ticket",jsapi_ticket);
        map.put("wxurl",wxurl);
        return map;
    }
  ```
  返回的数据在前端利用来访问语音识别接口。

## Build Setup

# 下载依赖
npm install

# 运行项目
npm run dev

# 运行效果

项目运行：

开始录音：

结束录音：
