<script lang="ts" setup>
import type { DropdownMenuProps } from '@engine-core/shadcn-ui';

import { ChevronDown } from '@engine-core/icons';
import { EngineDropdownMenu } from '@engine-core/shadcn-ui';

defineProps<DropdownMenuProps>();
</script>

<template>
  <EngineDropdownMenu :menus="menus" :modal="false">
    <div
      class="flex-center hover:bg-muted hover:text-foreground text-muted-foreground border-border h-full cursor-pointer border-l px-2 text-lg font-semibold"
    >
      <ChevronDown class="size-4" />
    </div>
  </EngineDropdownMenu>
</template>
