<script lang="ts" setup>
import { EngineButton, Fallback } from '@engine/common-ui';
import { useTabs } from '@engine/hooks';
import { X } from '@engine/icons';

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
