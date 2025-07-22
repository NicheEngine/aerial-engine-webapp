declare module 'locked-store' {
  import type { DefineStoreOptionsBase } from 'pinia'
  export interface LockedInfo {
    // Password required
    passwd?: string | undefined
    // Is it locked?
    locked?: boolean
  }

  export interface LockedContext {
    lockedInfo: Nullable<LockedInfo>
  }

  export interface LockedStore extends DefineStoreOptionsBase {
    context: LockedContext
    getLockedInfo: () => Nullable<LockedInfo>
    setLockedInfo: (lockedInfo: LockedInfo) => void
    resetLockedInfo: () => void
    asyncUnlocked: (password?: string) => void
  }

  export { lockedStore, useLockedStore } from './index.ts'
}
