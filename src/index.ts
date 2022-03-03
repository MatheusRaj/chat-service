import { config, listenWebsocket, Socket } from "mercurius-chat";
import { listenRabbitTopic, publishRabbitMessage } from "mercurius-chat/dist/rabbit";

const initApp = async () => {
  await config({
    port: 3001,
    sentryKey: "",
    rabbitParams: {
      dsn: "",
      exchange: "eduzz",
      exchangeType: "topic",
      connectionName: "jobzz-service-chat",
    },
  });

  listenRabbitTopic({
      queue: "jobzz.chat.service",
      topic: "jobzz.chat.service",
    }, (msg: any) => {
      console.log('Persist this: ', msg);
    }
  );

  listenWebsocket('join', (socket: Socket, payload: any) => {
    console.log('emitting: join');
    socket.join(payload.room);
  });

  listenWebsocket('send', (socket: Socket, payload: any) => {
    console.log('emitting: send');
    socket.to(payload.room).emit('receive', payload);

    publishRabbitMessage('jobzz.chat.service', payload);
  });
};

initApp();
