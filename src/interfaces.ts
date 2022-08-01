export interface IConversation {
    room: string;
    token: string;
    message: {
      from: string;
      content: string;
    }
    persist?: boolean;
  }
  
 export interface IApplication {
    token: string;
    name: string;
    endpoint: string;
  }