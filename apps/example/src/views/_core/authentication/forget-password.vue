<script lang="ts" setup>
import type { EngineFormSchema } from '@engine/common-ui';

import { computed, ref } from 'vue';

import { AuthenticationForgetPassword, z } from '@engine/common-ui';
import { $t } from '@engine/locales';

defineOptions({ name: 'ForgetPassword' });

const loading = ref(false);

const formSchema = computed((): EngineFormSchema[] => {
  return [
    {
      component: 'EngineInput',
      componentProps: {
        placeholder: 'example@example.com',
      },
      fieldName: 'email',
      label: $t('authentication.email'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.emailTip') })
        .email($t('authentication.emailValidErrorTip')),
    },
  ];
});

function handleSubmit(value: Record<string, any>) {
  // eslint-disable-next-line no-console
  console.log('reset email:', value);
}
</script>

<template>
  <AuthenticationForgetPassword
    :form-schema="formSchema"
    :loading="loading"
    @submit="handleSubmit"
  />
</template>
