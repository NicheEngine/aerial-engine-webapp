<script lang="ts" setup>
import { ENGINE_DOC_URL } from '@aerial-engine/constants';
import { openWindow } from '@aerial-engine/utils';

import { Button } from 'ant-design-vue';

const props = defineProps<{ path: string }>();

function handleClick() {
  // 如果没有.html，打开页面时可能会出现404
  const path =
    ENGINE_DOC_URL +
    (props.path.toLowerCase().endsWith('.html')
      ? props.path
      : `${props.path}.html`);
  openWindow(path);
}
</script>

<template>
  <Button @click="handleClick">查看组件文档</Button>
</template>
