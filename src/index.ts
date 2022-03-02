import { config, listenRabbitTopic, publishRabbitMessage, listenWebsocket, Socket } from "mercurius-chat";

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
      console.log('Persist data: ', msg);
    }
  );

  listenWebsocket('send', (socket: Socket, payload: any) => {
    socket.emit('receive', payload);

    publishRabbitMessage('jobzz.chat.service', payload);
  });
};

initApp();
