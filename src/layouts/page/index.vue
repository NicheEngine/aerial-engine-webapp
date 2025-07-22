<template>
  <RouterView>
    <template #default="{ Component, route }">
      <transition
        :name="
          getTransitionName({
            route,
            openCache: computedOpenCache,
            enableTransition: computedEnableTransition,
            cacheTabs: computedCacheTabs,
            defaultValue: computedBasicTransition,
          })
        "
        mode="out-in"
        appear
      >
        <keep-alive v-if="computedOpenCache" :include="computedCacheTabs">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
        <div v-else :key="route.name">
          <component :is="Component" :key="route.fullPath" />
        </div>
      </transition>
    </template>
  </RouterView>
  <FrameLayout v-if="computedCanEmbedIFramePage" />
</template>

<script lang="ts">
import { computed, defineComponent, unref } from 'vue'
import FrameLayout from '/@/layouts/iframe/index.vue'
import { useRootSettingHook, useTransitionSettingHook, useMultiTabsSettingHook } from 'setting-hook'
import { getTransitionName } from './transition'
import { useMultiTabsStore } from 'multi-tabs-store'

export default defineComponent({
  name: 'PageLayout',
  components: { FrameLayout },
  setup() {
    const { computedShowMultipleTab } = useMultiTabsSettingHook()
    const multiTabsStore = useMultiTabsStore()

    const { computedOpenKeepAlive, computedCanEmbedIFramePage } = useRootSettingHook()

    const { computedBasicTransition, computedEnableTransition } = useTransitionSettingHook()

    const computedOpenCache = computed(
      () => unref(getOpenKeepAlive) && unref(computedShowMultipleTab),
    )

    const computedCacheTabs = computed((): string[] => {
      if (!unref(computedOpenKeepAlive)) {
        return []
      }
      return multiTabsStore.getCacheTabs()
    })

    return {
      getTransitionName,
      computedOpenCache,
      computedEnableTransition,
      computedBasicTransition,
      computedCacheTabs,
      computedCanEmbedIFramePage,
    }
  },
})
</script>
