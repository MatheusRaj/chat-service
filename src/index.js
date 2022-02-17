"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mercurius_chat_1 = require("mercurius-chat");
const port = 3003;
console.log('Script started');
const initChatService = async () => {
    (0, mercurius_chat_1.initSentry)('https://6ede726e956c441da7aa8ce87a18af41@sentry.io/1415763');
    const server = await (0, mercurius_chat_1.initServer)(port);
    console.log(`Server listening port: ${port}`);
    const io = (0, mercurius_chat_1.getSocket)(server);
    (0, mercurius_chat_1.join)(io, (payload) => {
        io.to(payload.room).emit('joined', payload);
    });
    (0, mercurius_chat_1.typing)(io);
    (0, mercurius_chat_1.send)(io, (payload) => {
        console.log('Enviar mensagem por sms', payload);
    });
    (0, mercurius_chat_1.disconnect)(io, (payload) => {
        console.log('Handle metrics about user session', payload);
    });
};
initChatService();
