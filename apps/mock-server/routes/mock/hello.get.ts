import { useResponseSuccess } from '~/utils/response';

export default eventHandler(async () => {
  return useResponseSuccess('hello mock server!');
});
