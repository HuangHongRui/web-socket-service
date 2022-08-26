import WebSocket from "ws";

// 0:系统 1:信息 2:在线人员
export const SYS_TYPE = 0;
export const MSG_TYPE = 1;
export const ONLINE_TYPE = 2;

// 广播
export const fnBroadcast = (wss, ws) => {
  return (type = 0, name, message) => {
    wss.clients.forEach((client) => {
      if (ws !== client && client.readyState === WebSocket.OPEN) {
        const data = {
          type,
          msg: type === ONLINE_TYPE ? message : `${name}：${message}`,
          time: new Date().toLocaleTimeString()
        };
        client.send(JSON.stringify(data), { binary: false });
      }
      if (ws === client) {
        const data = {
          type,
          msg: type === ONLINE_TYPE ? message : `[你]：${message}`,
          time: new Date().toLocaleTimeString()
        };
        client.send(JSON.stringify(data), { binary: false });
      }
    });
  };
};
