import type {
  EngineFormProps,
  EngineFormSchema as FormSchema,
} from '@engine/common-ui';

import type { ComponentType } from './component';

import {
  setupEngineForm,
  useEngineForm as useForm,
  z,
} from '@engine/common-ui';
import { $t } from '@engine/locales';

async function initSetupEngineForm() {
  setupEngineForm<ComponentType>({
    config: {
      // naive-ui组件的空值为null,不能是undefined，否则重置表单时不生效
      emptyStateValue: null,
      baseModelPropName: 'value',
      modelPropNameMap: {
        Checkbox: 'checked',
        Radio: 'checked',
        Upload: 'fileList',
      },
    },
    defineRules: {
      required: (value, _params, ctx) => {
        if (value === undefined || value === null || value.length === 0) {
          return $t('ui.formRules.required', [ctx.label]);
        }
        return true;
      },
      selectRequired: (value, _params, ctx) => {
        if (value === undefined || value === null) {
          return $t('ui.formRules.selectRequired', [ctx.label]);
        }
        return true;
      },
    },
  });
}

const useEngineForm = useForm<ComponentType>;

export { initSetupEngineForm, useEngineForm, z };

export type EngineFormSchema = FormSchema<ComponentType>;
export type { EngineFormProps };
