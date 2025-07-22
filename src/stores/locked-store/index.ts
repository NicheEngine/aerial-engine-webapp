import { defineStore } from 'pinia'
import type { StoreDefinition, Store } from 'pinia'

import { LOCKED_INFO_KEY } from '@ems/cacheTypes'
import { Persistent } from 'persistent-extend'
import { useUserStore } from 'user-store'
import type { LockedInfo, LockedContext, LockedStore } from 'locked-store'
import { reactive } from 'vue'
import store from '@/stores'

const storeId: string = 'locked'

const storeOptions = (): LockedStore => {
  const context: LockedContext = reactive({
    lockedInfo: Persistent.getLocal(LOCKED_INFO_KEY),
  })

  function getLockedInfo(): Nullable<LockedInfo> {
    return context.lockedInfo
  }
  function setLockedInfo(lockedInfo: LockedInfo) {
    context.lockedInfo = Object.assign({}, context.lockedInfo, lockedInfo)
    Persistent.setLocal(LOCKED_INFO_KEY, context.lockedInfo, true)
  }

  function resetLockedInfo() {
    Persistent.removeLocal(LOCKED_INFO_KEY, true)
    context.lockedInfo = null
  }

  async function asyncUnlocked(password?: string) {
    const userStore = useUserStore()
    if (context.lockedInfo?.passwd === password) {
      resetLockedInfo()
      return true
    }
    const tryUserLogin = async () => {
      try {
        const username = userStore.getUserInfo()?.username
        const result = await userStore.asyncUserLogin({
          username,
          password: password!,
          goHome: false,
          mode: 'none',
        })
        if (result) {
          resetLockedInfo()
        }
        return result
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (ignoredError) {
        return false
      }
    }
    return await tryUserLogin()
  }
  return {
    /* 持久化 */
    persist: true,
    context,
    getLockedInfo,
    setLockedInfo,
    resetLockedInfo,
    asyncUnlocked,
  } as LockedStore
}

const lockedStore: StoreDefinition<
  string,
  Pick<LockedStore, never>,
  Pick<LockedStore, never>,
  Pick<LockedStore, keyof LockedStore>
> = defineStore(storeId, storeOptions)

export function useLockedStore(): Store<
  string,
  Pick<LockedStore, never>,
  Pick<LockedStore, never>,
  Pick<LockedStore, keyof LockedStore>
> {
  return lockedStore(store)
}

export default lockedStore
