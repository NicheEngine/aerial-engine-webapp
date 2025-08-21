<script lang="ts" setup>
import { AuthenticationQrCodeLogin } from '@aerial-engine/common-ui';
import { LOGIN_PATH } from '@aerial-engine/constants';

defineOptions({ name: 'QrCodeLogin' });
</script>

<template>
  <AuthenticationQrCodeLogin :login-path="LOGIN_PATH" />
</template>
