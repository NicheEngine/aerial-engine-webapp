<script lang="ts" setup>
import { Settings } from '@engine/icons';

import { EngineIconButton } from '@engine-core/shadcn-ui';

import Preferences from './preferences.vue';

const emit = defineEmits<{ clearPreferencesAndLogout: [] }>();

function clearPreferencesAndLogout() {
  emit('clearPreferencesAndLogout');
}
</script>
<template>
  <Preferences @clear-preferences-and-logout="clearPreferencesAndLogout">
    <EngineIconButton>
      <Settings class="text-foreground size-4" />
    </EngineIconButton>
  </Preferences>
</template>
