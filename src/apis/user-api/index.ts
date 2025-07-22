import { axiosHttp } from 'axios-https';
import type { HttpErrorMode } from 'app-https'
import type { LoginRequest, LoginResult, UserModel } from 'user-api'
import { ApiUrl } from 'user-api'

export class UserApi {
  static async test(test: Nullable<any>) {

  }

  static async userLogin(params: LoginRequest, mode: HttpErrorMode = 'modal') {
    return axiosHttp.post<LoginResult>(
      {
        url: ApiUrl.LOGIN,
        params,
      },
      {
        errorMessageMode: mode,
      },
    )
  }

  static async userInfo() {
    return axiosHttp.get<UserModel>({ url: ApiUrl.USER_INFO }, { errorMessageMode: 'none' })
  }

  static async userLogout() {
    return axiosHttp.get({ url: ApiUrl.LOGOUT })
  }

  static async userTestRetry() {
    return axiosHttp.get(
      { url: ApiUrl.TEST_RETRY },
      {
        retryRequest: {
          isOpenRetry: true,
          count: 5,
          waitTime: 1000,
        },
      },
    )
  }
}
