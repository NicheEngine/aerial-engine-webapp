<script lang="ts" setup>
import { useEngineModal } from '@engine/common-ui';

import { Button } from 'ant-design-vue';

import DragDemo from './drag-demo.vue';

const [Modal] = useEngineModal({
  destroyOnClose: true,
});
const [BaseModal, baseModalApi] = useEngineModal({
  connectedComponent: DragDemo,
});

function openNestedModal() {
  baseModalApi.open();
}
</script>
<template>
  <Modal title="嵌套弹窗示例">
    <Button @click="openNestedModal" type="primary">打开子弹窗</Button>
    <BaseModal />
  </Modal>
</template>
