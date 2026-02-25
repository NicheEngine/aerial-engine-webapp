<script lang="ts" setup>
import { useEngineModal } from '@engine/common-ui';

import { message } from 'ant-design-vue';

const [Modal, modalApi] = useEngineModal({
  draggable: true,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    message.info('onConfirm');
    // modalApi.close();
  },
});
</script>
<template>
  <Modal title="可拖拽示例"> 鼠标移动到 header 上，可拖拽弹窗 </Modal>
</template>
