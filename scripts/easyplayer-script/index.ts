import { copyFile } from '../utils.ts'

const basePath = `node_modules/@easydarwin/easyplayer/dist`

const elementPath = `${basePath}/element`

const componentPath = `${basePath}/component`

const componentTargets = {
  files: [
    'crossdomain.xml',
    'EasyPlayer.wasm',
    'EasyPlayer-lib.min.js',
    'EasyPlayer-component.min.js',
  ],
}

const elementTargets = {
  files: ['crossdomain.xml', 'EasyPlayer.wasm', 'EasyPlayer-element.min.js'],
}

export const runComponentScript = () => {
  copyFile(componentPath, `public/easyplayer`, componentTargets, true)
}

export const runElementScript = () => {
  copyFile(elementPath, `public/easyplayer`, elementTargets, true)
}

export default {
  runComponentScript,
  runElementScript,
}
