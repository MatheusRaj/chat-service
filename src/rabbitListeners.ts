import { listenRabbitTopic } from 'mercurius-chat/dist/rabbit';
import { IConversation } from './interfaces';
import { ApplicationModel } from "./models/Application";
import axios from 'axios';

export const dataPersister = () => {
    listenRabbitTopic({
        queue: "mercurius.data.persister",
        topic: "mercurius.data.persister",
      }, async (payload: IConversation) => {
        const application = await ApplicationModel.findOne({ token: payload.token });
  
        if (!application?.endpoint) {
          return false;
        }
  
        axios.post(application.endpoint, payload)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    );
}
