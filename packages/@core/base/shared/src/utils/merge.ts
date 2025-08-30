import { createDefu } from 'defu';

export { createDefu as createMerge, defu as mergeDefu } from 'defu';

export const mergeWithArrayOverride = createDefu((originObj, key, updates) => {
  if (Array.isArray(originObj[key]) && Array.isArray(updates)) {
    originObj[key] = updates;
    return true;
  }
});
