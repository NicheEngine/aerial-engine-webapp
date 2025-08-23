<script setup lang="ts">
import type { SupportedLanguagesType } from '@aerial-engine/locales';

import { SUPPORT_LANGUAGES } from '@aerial-engine/constants';
import { Languages } from '@aerial-engine/icons';
import { loadLocaleMessages } from '@aerial-engine/locales';
import { preferences, updatePreferences } from '@aerial-engine/preferences';

import {
  VbenDropdownRadioMenu,
  VbenIconButton,
} from '@aerial-engine-core/shadcn-ui';

defineOptions({
  name: 'LanguageToggle',
});

async function handleUpdate(value: string | undefined) {
  if (!value) return;
  const locale = value as SupportedLanguagesType;
  updatePreferences({
    app: {
      locale,
    },
  });
  await loadLocaleMessages(locale);
}
</script>

<template>
  <div>
    <VbenDropdownRadioMenu
      :menus="SUPPORT_LANGUAGES"
      :model-value="preferences.app.locale"
      @update:model-value="handleUpdate"
    >
      <VbenIconButton>
        <Languages class="text-foreground size-4" />
      </VbenIconButton>
    </VbenDropdownRadioMenu>
  </div>
</template>
