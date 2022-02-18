import { connection, initServer, getSocket, join, send } from 'mercurius-chat';

const initApp = async () => {

  const server = await initServer(3001);

  const io = getSocket(server);

  connection(io, () => {
    console.log('Some user connected');
  });

  join(io, (payload: any) => {
    console.log('Some user joined: ', payload.room, payload.from);
  });

  send(io, (payload: any) => {
    console.log('Save user conversarion data on rabbit: ', payload);
  });
}

initApp();
