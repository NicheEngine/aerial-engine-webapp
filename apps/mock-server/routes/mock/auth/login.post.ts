import {
  clearRefreshTokenCookie,
  setRefreshTokenCookie,
} from '~/utils/cookie-utils';
import { generateAccessToken, generateRefreshToken } from '~/utils/jwt-utils';
import { forbiddenResponse } from '~/utils/response';

export default defineEventHandler(async (event) => {
  const { password, username, guestUser = false } = await readBody(event);
  let userInfo: UserInfo;
  if (guestUser) {
    userInfo = GUEST_USER;
  } else {
    if (!password || !username) {
      setResponseStatus(event, 400);
      return useResponseError(
        'BadRequestException',
        'Username and password are required',
      );
    }
    userInfo = MOCK_USERS.find(
      (item) => item.username === username && item.password === password,
    );
  }

  if (!userInfo) {
    clearRefreshTokenCookie(event);
    return forbiddenResponse(event, 'Username or password is incorrect.');
  }

  const accessToken = generateAccessToken(userInfo);
  const refreshToken = generateRefreshToken(userInfo);

  setRefreshTokenCookie(event, refreshToken);

  return useResponseSuccess({
    ...userInfo,
    accessToken,
  });
});
