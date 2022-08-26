import { WebSocketServer } from "ws";
import { fnBroadcast, MSG_TYPE, ONLINE_TYPE, SYS_TYPE } from "./src/utils.js";

// 用户数
let userCount = 0;
let userList = [];
// 创建WS服务
const wss = new WebSocketServer({ port: 3000 });

// 监听连接
wss.on("connection", (ws) => {
  userCount++;
  ws.userName = `[${userCount}]`;
  const fnRadio = fnBroadcast(wss, ws);

  // 谁加入聊天室
  console.log(ws.userName, "进入频道！");
  userList.unshift(ws.userName);
  fnRadio(SYS_TYPE, ws.userName, "进入了房间！");
  fnRadio(ONLINE_TYPE, undefined, userList);

  ws.on("message", (data) => {
    // 收到信息时，公开信息内容
    console.log(ws.userName, data);
    fnRadio(MSG_TYPE, ws.userName, data);
  });

  ws.on("close", () => {
    // 公布用户离开信息
    console.log(ws.userName, "离开频道！");
    fnRadio(SYS_TYPE, ws.userName, "离开频道！");
    fnRadio(
      ONLINE_TYPE,
      undefined,
      userList.filter((val) => val !== ws.userName)
    );
  });

  ws.on("error", () => {
    console.log("ERROR");
  });
});
