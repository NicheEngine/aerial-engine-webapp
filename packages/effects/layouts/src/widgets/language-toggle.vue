<script setup lang="ts">
import type { SupportedLanguagesType } from '@engine/locales';

import { SUPPORT_LANGUAGES } from '@engine/constants';
import { Languages } from '@engine/icons';
import { loadLocaleMessages } from '@engine/locales';
import { preferences, updatePreferences } from '@engine/preferences';

import { EngineDropdownRadioMenu, EngineIconButton } from '@engine-core/shadcn-ui';

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
    <EngineDropdownRadioMenu
      :menus="SUPPORT_LANGUAGES"
      :model-value="preferences.app.locale"
      @update:model-value="handleUpdate"
    >
      <EngineIconButton>
        <Languages class="text-foreground size-4" />
      </EngineIconButton>
    </EngineDropdownRadioMenu>
  </div>
</template>
