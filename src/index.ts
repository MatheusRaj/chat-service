import { config, listenWebsocket, Socket } from "mercurius-chat";
import { listenRabbitTopic, publishRabbitMessage } from "mercurius-chat/dist/rabbit";
import { persistMessage, listMessages, model, Schema } from "mercurius-chat/dist/mongo";

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
      dsn: "amqp://aquzikoa:8fKSvFoTLXwXj93KHNGBwn4YDoMEY1z9@small-ant.rmq.cloudamqp.com:5672/jobzz",
      exchange: "eduzz",
      exchangeType: "topic",
      connectionName: "jobzz.chat.service",
    },
    mongoParams: {
      mongoDatabase: "jobzz-chat",
      mongoUrl: "mongodb+srv://matheus:0388Dac4.@cluster0.yhcjh.mongodb.net/jobzz-chat"
    }
  });

  const ConversationModel = model('Conversation', new Schema({ room: String, message: { from: String, content: String } }));

  listenRabbitTopic({
      queue: "jobzz.chat.service",
      topic: "jobzz.chat.service",
    }, async (payload: IConversation) => {
      console.log('PERSISTING THIS: ', payload);
      persistMessage({ ...payload }, ConversationModel);

      return true;
    }
  );

  listenWebsocket('join', async (socket: Socket, payload: IConversation) => {
    socket.join(payload.room);

    const messages = await listMessages(payload, ConversationModel);

    socket.emit('list-messages', messages);
  });

  listenWebsocket('send', (socket: Socket, payload: IConversation) => {
    console.log('EMITTING THIS: ', payload);
    socket.to(payload.room).emit('receive', payload);

    publishRabbitMessage('jobzz.chat.service', payload);
  });
};

initApp();
