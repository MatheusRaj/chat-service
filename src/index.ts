import { config, listenWebsocket, Socket } from "mercurius-chat";
import { listenRabbitTopic, publishRabbitMessage } from "mercurius-chat/dist/rabbit";
import { persistMessage, listMessages } from "mercurius-chat/dist/mongo";

interface IConversation {
  room: string;
  message: {
    from: string;
    content: string;
  }
}

const initApp = async () => {
  await config({
    port: 3001,
    sentryKey: "",
    rabbitParams: {
      dsn: "<YOUR-RABBIT-CONNECTION-HERE>",
      exchange: "test",
      exchangeType: "topic",
      connectionName: "test",
    },
    mongoParams: {
      mongoDatabase: "test",
      mongoUrl: "<YOUR-MONGO-CONNECTION-HERE>"
    },
    redisUrl: "<YOUR-REDIS-CONNECTION-HERE>"
  });

  listenRabbitTopic({
      queue: "test",
      topic: "test",
    }, (payload: IConversation) => {
      persistMessage({ ...payload });
    }
  );

  listenWebsocket('join', async (socket: Socket, payload: IConversation) => {
    socket.join(payload.room);

    const messages = await listMessages(payload);

    socket.emit('list-messages', messages);
  });

  listenWebsocket('send', (socket: Socket, payload: IConversation) => {
    socket.to(payload.room).emit('receive', payload);

    publishRabbitMessage('test', payload);
  });
};

initApp();
