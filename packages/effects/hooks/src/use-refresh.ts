import { useRouter } from 'vue-router';

import { useTabbarStore } from '@aerial-engine/stores';

export function useRefresh() {
  const router = useRouter();
  const tabbarStore = useTabbarStore();

  async function refresh() {
    await tabbarStore.refresh(router);
  }

  return {
    refresh,
  };
}
