import { config, listenWebsocket, Socket } from "mercurius-chat";
import { listenRabbitTopic, publishRabbitMessage } from "mercurius-chat/dist/rabbit";
import { persistMessage, listMessages } from "mercurius-chat/dist/mongo";

interface IConversation {
  room: string;
  message: {
    from: { key: string };
    content: string;
  }
}

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
    mongoParams: {
      mongoDatabase: 'jobzz-chat',
      mongoUrl: ''
    }
  });

  listenRabbitTopic({
      queue: "jobzz.chat.service",
      topic: "jobzz.chat.service",
    }, (payload: IConversation) => {
      persistMessage({ ...payload });
    }
  );

  listenWebsocket('join', (socket: Socket, payload: IConversation) => {
    socket.join(payload.room);

    const messages = listMessages(payload, (messages: IConversation[]) => {
      console.log(messages);
      socket.emit('list-messages', messages);
    });
  });

  listenWebsocket('send', (socket: Socket, payload: IConversation) => {
    socket.to(payload.room).emit('receive', payload);

    publishRabbitMessage('jobzz.chat.service', payload);
  });
};

initApp();
