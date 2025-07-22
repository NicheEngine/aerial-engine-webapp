## Options

| 参数                | 说明                                  | 类型      | 默认值                            |
|-------------------|-------------------------------------|---------|--------------------------------|
| alt               | 视频流地址没有指定情况下, 视频所在区域显示的文字           | String  | 无信号                            |
| aspect            | 视频显示区域的宽高比                          | String  | 16:9                           |
| autoplay          | 自动播放                                | Boolean | true                           |
| currentTime       | 设置当前播放时间                            | Number  | 0                              |
| decode-type       | 解码类型 仅支持flv (soft: 强制使用wasm模式）      | String  | auto                           |
| debug             | 是否debug模式输出debug日志                  | Boolean | false                          |
| hiddenRightMenu   | 是否隐藏右侧目录                            | Boolean | false                          |
| easyStretch       | 是否不同分辨率强制铺满窗口                       | Boolean | false                          |
| isH265            | 是否使用H265编码格式                        | Boolean | false                          |
| live              | 是否直播, 标识要不要显示进度条                    | Boolean | true                           |
| loop              | 是否轮播。                               | Boolean | false                          |
| muted             | 是否静音                                | Boolean | true                           |
| playerStyle       | 播放器样式                               | String  | -                              |
| poster            | 视频封面图片                              | String  | -                              |
| reconnection      | 视频出错时自动重连                           | Boolean | false                          |
| restartTime       | FLV视频重新开始时间                         | Number  | 60 * 60 * 6                    |
| resolution        | 仅支持hls流; 供选择的清晰度 fhd:超清，hd:高清，sd:标清 | String  | "yh,fhd,hd,sd"                 |
| resolutionDefault | 仅支持hls流                             | String  | "hd"                           |
| showEnterprise    | ？显示企业信息                             | Boolean | true                           |
| iceServers        | ？ICE服务器地址                           | Array   | []                             |
| video-url         | 视频地址                                | String  | -                              |
| video-title       | 视频右上角显示的标题                          | String  | -                              |
| watermark         | 水印                                  |         | [Object, String]               |
| isTransCoding     | ？是否跨编码                              | Boolean | false                          |
| has-audio         | 是否渲染音频（音频有问题,请设置成false）仅支持flv       | Boolean | true                           |
| recordMaxFileSize | 录像文件大小(MB)                          | Number  | 200                            |
| progress          | ？展示进度条                              | Boolean | true                           |
| remoteHost        | 远程主机地址                              | String  | https://demo.easycvr.com:18000 |
| recordFileName    | 远程文件名                               | String  | ""                             |

## Callbacks

* 注：IOS Safari浏览器仅支持 canplaythrough

| 方法名        | 说明        | 参数               |
|------------|-----------|------------------|
| snapshot   | 截屏事件      | blob             |
| recording  | 播放器录像回调   | data             |
| play       | 播放事件      | event            |
| pause      | 暂时事件      | event            |
| error      | 播放异常      |                  |
| ended      | 播放结束或直播断流 |                  |
| timeupdate | 当前播放时间回调  | currentTime 当前时间 |

## Methods

| 方法名             | 说明                                           | 参数                                         |
| ------------------ | ---------------------------------------------- | -------------------------------------------- |
| handlePoster       | 处理显示视频封面                               |                                              |
| getH265SnapData    | H265截图数据                                   |                                              |
| getCurrentTime     | 视频当前时间                                   |                                              |
| snapshot           | 保存快照                                       |                                              |
| seek               | HLS 快进                                       | seekTime 快进时间                            |
| switchRecording    | 录像开关                                       |                                              |
| changeStretch      | 视频拉伸模式                                   |                                              |
| exitFullscreen     | 退出全屏                                       |                                              |
| fullscreen         | 全屏                                           |                                              |
| switchVideo        | 播放开关                                       |                                              |
| switchAudio        | 静音开关                                       |                                              |
| handlerVideOption  | 设置播放器配置问题                             | src 视频源                                   |
| initPlayer         | 初始化播放器                                   |                                              |
| debounce           | 镜头去抖动                                     | （player,args）=>{} 处理方法, delay 延时参数 |
| setRestartPlay     | flv长时间播放问题设置定时重置参数为restartTime |                                              |
| _autoPlay          | 自动播放方法                                   |                                              |
| initWebRTCPlayer   | 初始化WebRTCPlayer播放器                       |                                              |
| play               | 播放器播放                                     |                                              |
| replay             | 播放器重播                                     |                                              |
| restartPlayer      | 重启播放器                                     |                                              |
| easyPlayerPushMsg  | 添加消息（弹幕）                               | msg 消息/弹幕                                |
| easyPlayerCleanMsg | 清除消息（弹幕）                               |                                              |
| loadWasmKit        | 加载Wasm工具                                   |                                              |
| changeStream       | 切换视频流                                     | stream 视频流                                |
| isIPhone           | 是否是苹果                                     |                                              |
| destroyPlayer      | 销毁播放器                                     |                                              |
