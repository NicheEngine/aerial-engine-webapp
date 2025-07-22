import { message } from '../utils.ts'
import antdLocale from 'ant-design-vue/es/locale/zh_CN'

const modules: Record<string, Record<string, any>> = import.meta.glob('./zh-CN/**/*.ts', {
  eager: true,
  import: 'default',
})
export default {
  message: {
    ...message(modules, 'zh-CN'),
    antdLocale,
  },
}
