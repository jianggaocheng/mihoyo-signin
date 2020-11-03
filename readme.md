# Mihoyo sign in
自动完成米游币任务
- 论坛区签到
- 阅读帖子
- 点赞帖子
- 分享帖子

## 更新记录  
[2020.11.02] 受 https://github.com/y1ndan/genshin-impact-helper 启发，支持 workflow 运行，每天 8 点定时进行签到

## 快速入门
### Fork 项目  

项目地址：https://github.com/jianggaocheng/mihoyo-signin  

点击右上角 `Fork` 到自己的账号下

### 获取 cookie
1, 登录 https://bbs.mihoyo.com/ys/

2, 在控制台输入以下指令，并将结果复制
```
var a=function getCookie(name){var strCookie=document.cookie;var arrCookie=strCookie.split("; ");for(var i=0;i<arrCookie.length;i++){var arr=arrCookie[i].split("=");if(arr[0]==name)return arr[1]}return""};var b={};b.ltoken=a("ltoken");b.ltuid=a("ltuid");b.stoken=a("stoken");b.stuid=a("stuid");console.log(JSON.stringify(b));
```

### 添加 Cookie 至 Secrets
回到项目页面，依次点击Settings-->Secrets-->New secret

建立名为 `COOKIE_STRING` 的 secret，值为上一步中复制的 Cookie 内容，最后点击 Add secret

### 启动 Github Action

> Actions 默认为关闭状态，Fork 之后需要手动执行一次，若成功运行其才会激活。

返回项目主页面，点击上方的`Actions`，再点击左侧的`Genshin Impact Helper`，再点击`Run workflow`

至此，部署完毕。

## 查看结果

当你完成上述流程，可以在 `Actions` 页面点击 `Genshin Impact Helper` --> `build` --> `run sign`查看结果。

## 感谢
受 https://github.com/lhllhx/miyoubi 项目启发  

感谢 https://github.com/lhllhx/miyoubi 的作者 [@lhllhx](https://github.com/lhllhx)  

感谢 [@2314933036](https://github.com/2314933036) 提供了签名 DS 字段的加密算法  
