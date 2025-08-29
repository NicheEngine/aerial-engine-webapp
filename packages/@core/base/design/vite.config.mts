import { defineConfig } from '@engine/vite-config';

export default defineConfig(async () => {
  return {
    vite: {
      publicDir: 'src/scss-bem',
    },
  };
});
