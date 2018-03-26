# chatroom
后端部分使用了Node.js + express 实现<br/>
前端部分的布局使用了CSS3的flex来布局<br/>
聊天页面的交互使用socket进行了聊天消息的发送与接收的消息机制，避免了用Ajax有时会丢失聊天消息的情况<br/>
兼容性目前测试通过的有Chrome 58、Opera 45、Firefox 53、IE 11

已解决问题：<br/>
添加 总路由 监视每个请求  ok  
监视功能重新设计  ok  
添加 聊天功能 ok  
退出后的跳转页面 ok  
聊天记录显示时间 ok  
手机自适应    ok  
浏览器消息提醒 ok  
添加用户列表 ok  
    获取所有人 ok  
聊天室框架重新设计  ok  
获取用户的IP   ok  
根据IP获取地址  ok  
用户名重复没有检测 ok  
首次加入显示最新五条消息   ok  
统一  使用服务器时间  OK  


