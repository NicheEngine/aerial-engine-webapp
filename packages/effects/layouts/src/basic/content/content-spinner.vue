<script lang="ts" setup>
import { EngineSpinner } from '@aerial-engine-core/shadcn-ui';

import { useContentSpinner } from './use-content-spinner';

defineOptions({ name: 'LayoutContentSpinner' });

const { spinning } = useContentSpinner();
</script>
<template>
  <EngineSpinner :spinning="spinning" />
</template>
