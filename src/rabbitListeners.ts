import { listenRabbitTopic } from 'mercurius-chat/dist/rabbit';
import { IConversation } from './interfaces';
import { ApplicationModel } from "./models/Application";
import axios from 'axios';

export const dataPersister = () => {
    listenRabbitTopic({
        queue: "mercurius.data.persister",
        topic: "mercurius.data.persister",
      }, async (payload: IConversation) => {
        console.log('PERSISTING THIS: ', payload);
  
        const application = await ApplicationModel.findOne({ token: payload.token });
  
        if (!application?.endpoint) {
          return;
        }
  
        axios.post(application.endpoint, payload)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
  
        return true;
      }
    );
}
