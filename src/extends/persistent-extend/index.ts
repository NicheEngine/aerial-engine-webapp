import { createLocalStorage, createSessionStorage } from 'storage-extend'
import { Memory } from 'memory-extend'
import {
  ACCESS_TOKEN_KEY,
  USER_INFO_KEY,
  LOCKED_INFO_KEY,
  APP_LOCAL_CACHE_KEY,
  APP_SESSION_CACHE_KEY,
} from '@ems/cacheTypes'
import { DEFAULT_CACHE_TIME } from 'app-settings'
import { toRaw } from 'vue'
import { pick, omit } from 'lodash-es'
import type { LocalKeys, LocalStore, SessionKeys, SessionStore } from 'persistent-extend'

const localStorage = createLocalStorage()
const sessionStorage = createSessionStorage()

const localMemory = new Memory(DEFAULT_CACHE_TIME)
const sessionMemory = new Memory(DEFAULT_CACHE_TIME)

function initPersistentMemory() {
  const localCache = localStorage.get(APP_LOCAL_CACHE_KEY)
  const sessionCache = sessionStorage.get(APP_SESSION_CACHE_KEY)
  localCache && localMemory.resetCache(localCache)
  sessionCache && sessionMemory.resetCache(sessionCache)
}

export class Persistent {
  static getLocal<T>(key: LocalKeys) {
    return localMemory.get(key)?.value as Nullable<T>
  }

  static setLocal(key: LocalKeys, value: LocalStore[LocalKeys], immediate = false): void {
    localMemory.set(key, toRaw(value))
    immediate && localStorage.set(APP_LOCAL_CACHE_KEY, localMemory.getCache)
  }

  static removeLocal(key: LocalKeys, immediate = false): void {
    localMemory.remove(key)
    immediate && localStorage.set(APP_LOCAL_CACHE_KEY, localMemory.getCache)
  }

  static clearLocal(immediate = false): void {
    localMemory.clear()
    immediate && localStorage.clear()
  }

  static getSession<T>(key: SessionKeys) {
    return sessionMemory.get(key)?.value as Nullable<T>
  }

  static setSession(key: SessionKeys, value: SessionStore[SessionKeys], immediate = false): void {
    sessionMemory.set(key, toRaw(value))
    immediate && sessionStorage.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache)
  }

  static removeSession(key: SessionKeys, immediate = false): void {
    sessionMemory.remove(key)
    immediate && sessionStorage.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache)
  }
  static clearSession(immediate = false): void {
    sessionMemory.clear()
    immediate && sessionStorage.clear()
  }

  static clearAll(immediate = false) {
    sessionMemory.clear()
    localMemory.clear()
    if (immediate) {
      localStorage.clear()
      sessionStorage.clear()
    }
  }
}

window.addEventListener('beforeunload', function () {
  // TOKEN_KEY 在登录或注销时已经写入到storage了，此处为了解决同时打开多个窗口时token不同步的问题
  // LOCKED_INFO_KEY 在锁屏和解锁时写入，此处也不应修改
  localStorage.set(APP_LOCAL_CACHE_KEY, {
    ...omit(localMemory.getCache, LOCKED_INFO_KEY),
    ...pick(localStorage.get(APP_LOCAL_CACHE_KEY), [
      ACCESS_TOKEN_KEY,
      USER_INFO_KEY,
      LOCKED_INFO_KEY,
    ]),
  })
  sessionStorage.set(APP_SESSION_CACHE_KEY, {
    ...omit(sessionMemory.getCache, LOCKED_INFO_KEY),
    ...pick(sessionStorage.get(APP_SESSION_CACHE_KEY), [
      ACCESS_TOKEN_KEY,
      USER_INFO_KEY,
      LOCKED_INFO_KEY,
    ]),
  })
})

function storageChange(e: any) {
  const { key, newValue, oldValue } = e

  if (!key) {
    Persistent.clearAll()
    return
  }

  if (!!newValue && !!oldValue) {
    if (APP_LOCAL_CACHE_KEY === key) {
      Persistent.clearLocal()
    }
    if (APP_SESSION_CACHE_KEY === key) {
      Persistent.clearSession()
    }
  }
}

window.addEventListener('storage', storageChange)

initPersistentMemory()
