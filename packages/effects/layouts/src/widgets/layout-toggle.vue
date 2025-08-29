<script setup lang="ts">
import type { AuthPageLayoutType } from '@engine/types';

import type { EngineDropdownMenuItem } from '@engine-core/shadcn-ui';

import { computed } from 'vue';

import { InspectionPanel, PanelLeft, PanelRight } from '@engine/icons';
import { $t } from '@engine/locales';
import {
  preferences,
  updatePreferences,
  usePreferences,
} from '@engine/preferences';

import { EngineDropdownRadioMenu, EngineIconButton } from '@engine-core/shadcn-ui';

defineOptions({
  name: 'AuthenticationLayoutToggle',
});

const menus = computed((): EngineDropdownMenuItem[] => [
  {
    icon: PanelLeft,
    label: $t('authentication.layout.alignLeft'),
    value: 'panel-left',
  },
  {
    icon: InspectionPanel,
    label: $t('authentication.layout.center'),
    value: 'panel-center',
  },
  {
    icon: PanelRight,
    label: $t('authentication.layout.alignRight'),
    value: 'panel-right',
  },
]);

const { authPanelCenter, authPanelLeft, authPanelRight } = usePreferences();

function handleUpdate(value: string | undefined) {
  if (!value) return;
  updatePreferences({
    app: {
      authPageLayout: value as AuthPageLayoutType,
    },
  });
}
</script>

<template>
  <EngineDropdownRadioMenu
    :menus="menus"
    :model-value="preferences.app.authPageLayout"
    @update:model-value="handleUpdate"
  >
    <EngineIconButton>
      <PanelRight v-if="authPanelRight" class="size-4" />
      <PanelLeft v-if="authPanelLeft" class="size-4" />
      <InspectionPanel v-if="authPanelCenter" class="size-4" />
    </EngineIconButton>
  </EngineDropdownRadioMenu>
</template>
