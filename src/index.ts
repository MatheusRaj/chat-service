import { config, listenWebsocket, Socket, getIoConnection } from "mercurius-chat";
import { publishRabbitMessage } from "mercurius-chat/dist/rabbit";
import { IConversation } from "./interfaces";
import { ApplicationModel } from "./models/Application";
import { dataPersister } from "./rabbitListeners";

const initApp = async () => {
  await config({
    port: 3001,
    sentryKey: "",
    rabbitParams: {
      dsn: "amqp://guest:guest@localhost:5672",
      exchange: "eduzz",
      exchangeType: "topic",
      connectionName: "mercurius.data.persister",
    },
    mongoParams: {
      mongoDatabase: "Mercurius",
      mongoUrl: "mongodb://root:root@localhost:27017/"
    },
    redisUrl: 'redis://localhost:6379'
  });

  const io = getIoConnection();

  const applications = await ApplicationModel.find();

  io.use((socket, next) => {
    const token = socket.handshake.query.token;

    if (!Object.values(applications).filter((app) => app.token === token).length) {
      return;
    }

    next();
  });

  listenWebsocket('join', async (socket: Socket, payload: IConversation) => {
    socket.join(payload.room);
  });

  listenWebsocket('send', (socket: Socket, payload: IConversation) => {
    socket.to(payload.room).emit('receive', payload);

    if (payload.persist) {
      publishRabbitMessage('mercurius.data.persister', payload);
    }
  });

  dataPersister();
};

initApp();
