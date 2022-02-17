import { connection, initServer, getSocket, join, send } from 'mercurius-chat';

const initApp = async () => {

  const server = await initServer(3001);

  const io = getSocket(server);

  connection(io, () => {
    console.log('Some corno connected');
  });

  join(io, (payload: any) => {
    console.log('Some corno joined: ', payload.room, payload.from);
  });

  send(io, (payload: any) => {
    console.log('Save corno conversarion data on rabbit: ', payload);
  });
}

initApp();
