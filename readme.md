# Mihoyo sign in
自动完成米游币任务
- 论坛区签到
- 阅读帖子
- 点赞帖子
- 分享帖子

## 快速入门
### 安装依赖
```
yarn install
```

### 获取 cookie
1, 登录 https://bbs.mihoyo.com/ys/

2, 在控制台输入以下指令，并将结果复制
```
var a=function getCookie(name){var strCookie=document.cookie;var arrCookie=strCookie.split("; ");for(var i=0;i<arrCookie.length;i++){var arr=arrCookie[i].split("=");if(arr[0]==name)return arr[1]}return""};var b={};b.ltoken=a("ltoken");b.ltuid=a("ltuid");b.stoken=a("stoken");b.stuid=a("stuid");console.log(JSON.stringify(b));
```

### 运行程序
直接在控制台运行
```
COOKIE_STRING='TOKEN的字符串' node index.js
```

也可以通过其他方式设置环境变量后直接运行
```
node index.js
```

### 感谢
受 https://github.com/lhllhx/miyoubi 项目启发  

感谢 https://github.com/lhllhx/miyoubi 的作者 [@lhllhx](https://github.com/lhllhx)  

感谢 [@2314933036](https://github.com/2314933036) 提供了签名 DS 字段的加密算法  
