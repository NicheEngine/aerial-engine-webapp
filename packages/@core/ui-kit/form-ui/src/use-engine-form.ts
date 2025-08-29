import type {
  BaseFormComponentType,
  EngineFormProps,
  ExtendedFormApi,
} from './types';

import { defineComponent, h, isReactive, onBeforeUnmount, watch } from 'vue';

import { useStore } from '@engine-core/shared/store';

import EngineUseForm from './engine-use-form.vue';
import { FormApi } from './form-api';

export function useEngineForm<
  T extends BaseFormComponentType = BaseFormComponentType,
>(options: EngineFormProps<T>) {
  const IS_REACTIVE = isReactive(options);
  const api = new FormApi(options);
  const extendedApi: ExtendedFormApi = api as never;
  extendedApi.useStore = (selector) => {
    return useStore(api.store, selector);
  };

  const Form = defineComponent(
    (props: EngineFormProps, { attrs, slots }) => {
      onBeforeUnmount(() => {
        api.unmount();
      });
      api.setState({ ...props, ...attrs });
      return () =>
        h(EngineUseForm, { ...props, ...attrs, formApi: extendedApi }, slots);
    },
    {
      name: 'EngineUseForm',
      inheritAttrs: false,
    },
  );
  // Add reactivity support
  if (IS_REACTIVE) {
    watch(
      () => options.schema,
      () => {
        api.setState({ schema: options.schema });
      },
      { immediate: true },
    );
  }

  return [Form, extendedApi] as const;
}
