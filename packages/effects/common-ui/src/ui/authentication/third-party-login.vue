<script setup lang="ts">
import {
  MdiGithub,
  MdiGoogle,
  MdiQqchat,
  MdiWechat,
} from '@aerial-engine/icons';
import { $t } from '@aerial-engine/locales';

import { EngineIconButton } from '@aerial-engine-core/shadcn-ui';

defineOptions({
  name: 'ThirdPartyLogin',
});
</script>

<template>
  <div class="w-full sm:mx-auto md:max-w-md">
    <div class="mt-4 flex items-center justify-between">
      <span class="border-input w-[35%] border-b dark:border-gray-600"></span>
      <span class="text-muted-foreground text-center text-xs uppercase">
        {{ $t('authentication.thirdPartyLogin') }}
      </span>
      <span class="border-input w-[35%] border-b dark:border-gray-600"></span>
    </div>

    <div class="mt-4 flex flex-wrap justify-center">
      <EngineIconButton class="mb-3">
        <MdiWechat />
      </EngineIconButton>
      <EngineIconButton class="mb-3">
        <MdiQqchat />
      </EngineIconButton>
      <EngineIconButton class="mb-3">
        <MdiGithub />
      </EngineIconButton>
      <EngineIconButton class="mb-3">
        <MdiGoogle />
      </EngineIconButton>
    </div>
  </div>
</template>
