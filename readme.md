# Mihoyo sign in

![badge](https://github.com/jianggaocheng/mihoyo-signin/workflows/Mihoyo%20SignIn/badge.svg)

自动完成米游币任务
- 论坛区签到
- 阅读帖子
- 点赞帖子
- 分享帖子

## 免责声明
本项目使用脚本模拟米游社 app 进行自动化任务，存在封号、米游币清零等风险。   
如意外情况与作者无关。虽然目前没有出现封号情况不代表以后不会没有吧。先免责一下，本项目的只是兴趣爱好（如果天外飞锅，我是万万不会接的。）   
使用本程序默认接收免责协议。   

## 安全提醒  
1 Workflow 是所有注册用户都可见的，包括 log，在旧版本中有一些 log 可能会泄露你们的 cookie string，请所有运行旧版本的及时更换成新版本，
并且修改现有 mihoyo 账户密码！！！

2 目前仅调用了米游币任务所必须的接口，并未 100% 模拟读取帖子点赞的所有流程，存在一定不可知的风险，请使用前务必知晓，下一步的开发会尝试尽可能模拟手动做任务的全部接口调用。

## 更新记录 
[2021.10.09] 重构部分代码，加入企业微信消息通知。

[2021.09.22] 通过网页获取 cookie 的方式已失效，请通过抓包方式获取 App 使用的 cookie。

[2020.11.16] 修复一时间后 cookie 失效的问题，重构部分代码以支持后期优化。

[2020.11.14] 感谢 [@lhllhx](https://github.com/lhllhx) 提醒，删除可能泄露 Cookie 的 log。

[2020.11.10] 重新加回本地运行的说明，修改了 cookie 的获取，重构代码加入随机延时防止检测。

[2020.11.02] 受 https://github.com/y1ndan/genshin-impact-helper 启发，支持 workflow 运行，每天 8 点定时进行签到。

## 快速入门

### 安装依赖
```
yarn
```

### 获取 cookie (20210922 该方法已失效，请使用抓包工具获取 stuid, stoken, login_ticket)
~~1, 登录 https://bbs.mihoyo.com/ys/, 如果已经登录需要退出再重新登录。~~

~~2, 在控制台输入以下指令, 取得 login_ticket, 并将结果复制~~

~~3, 本地运行 cookie.js, 传入上一步的 login_ticket, 获取用于爬虫的 stoken~~

### 环境变量
名称 | 值 |  备注  
-|-|-
COOKIE_STRING | stuid=;stoken=;login_ticket= | 通过抓包自行获取 |
QY_WECHAT= | `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=` | 企业微信机器人 URL |
DEBUG | 1 | 默认 info 级别, DEBUG = 1 则开启 debug 级别日志输出 |

### 本地运行
```bash
COOKIE_STRING='stuid=*******;stoken=****************;login_ticket=********************;' node dist/main.js
```

## Workflow 运行 (谨慎选择)
### Fork 项目  

项目地址：https://github.com/jianggaocheng/mihoyo-signin  

点击右上角 `Fork` 到自己的账号下

### 添加 Cookie 至 Secrets
回到项目页面，依次点击Settings-->Secrets-->New secret

建立名为 `COOKIE_STRING` 的 secret，值为获取 cookie 中 COOKIE_STRING 的内容，最后点击 Add secret

### 启动 Github Action

> Actions 默认为关闭状态，Fork 之后需要手动执行一次，若成功运行其才会激活。

返回项目主页面，点击上方的`Actions`，再点击左侧的`Mihoyo sign in`，再点击`Run workflow`

至此，部署完毕。

### 查看结果

当你完成上述流程，可以在 `Actions` 页面点击 `Mihoyo sign in` --> `build` --> `run sign`查看结果。

### 更新程序

因为程序目前还在不断更新中，因此你 Fork 的仓库需要及时更新，更新的步骤如下。

```
git clone https://github.com/<Your GitHub ID>/mihoyo-signin.git
cd ./mihoyo-signin
git pull https://github.com/jianggaocheng/mihoyo-signin.git master
git push origin master
```

## 感谢
受 https://github.com/lhllhx/miyoubi 项目启发  

感谢 https://github.com/lhllhx/miyoubi 的作者 [@lhllhx](https://github.com/lhllhx)  

感谢 [@2314933036](https://github.com/2314933036) 提供了签名 DS 字段的加密算法  
