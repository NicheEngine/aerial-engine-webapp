import { defaultHttp } from '../https';
import Api from './api';

export const serverApi = {
  async serverHello() {
    return defaultHttp.get<string>({ url: Api.hello });
  },

  async serverTest() {
    return defaultHttp.get<string>({ url: Api.test });
  },
};

export default serverApi;
