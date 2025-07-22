declare module 'factory-extend' {
  export interface FactoryOptions {
    size?: 'default' | 'small' | 'large'
    delay?: number
    timeout?: number
    loading?: boolean
    retry?: boolean
  }

  export { createAsyncComponent } from './index.tsx'
}
