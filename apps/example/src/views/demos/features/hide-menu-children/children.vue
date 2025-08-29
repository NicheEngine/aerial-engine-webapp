<script lang="ts" setup>
import { Fallback, EngineButton } from '@aerial-engine/common-ui';
import { useTabs } from '@aerial-engine/hooks';
import { X } from '@aerial-engine/icons';

const { closeCurrentTab } = useTabs();
</script>

<template>
  <Fallback
    description="当前路由在菜单中不可见"
    status="coming-soon"
    title="被隐藏的子菜单"
    show-back
  >
    <template #action>
      <EngineButton size="lg" @click="closeCurrentTab()">
        <X class="mr-2 size-4" />
        关闭当前标签页
      </EngineButton>
    </template>
  </Fallback>
</template>
