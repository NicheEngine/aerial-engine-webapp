import { defaultHttp } from '../axios-https';
import Api from './api';

export const ServerApi = {
  async serverHello() {
    return defaultHttp.get<string>({ url: Api.hello });
  },

  async serverTest() {
    return defaultHttp.get<string>({ url: Api.test });
  },
};

export default ServerApi;
