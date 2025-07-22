import { message } from '../utils.ts'
import antdLocale from 'ant-design-vue/es/locale/en_US'

const modules: Record<string, Record<string, any>> = import.meta.glob('./en/**/*.ts', {
  eager: true,
  import: 'default',
})
export default {
  message: {
    ...message(modules, 'en'),
    antdLocale,
  },
  dateLocale: null,
  dateLocaleName: 'en',
}
