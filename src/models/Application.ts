
import { model, Schema } from "mercurius-chat/dist/mongo";

export const ApplicationModel = model('application', new Schema({ token: String, name: String, endpoint: String }));