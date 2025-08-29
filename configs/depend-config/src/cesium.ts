import { copyFile } from '@aerial-engine/node-utils';

const cesiumPath = `node_modules/cesium/Build/CesiumUnminified`;
const targets = {
  directories: ['Assets', 'ThirdParty', 'Widgets', 'Workers'],
  files: ['Cesium.js'],
};

export const runCesiumScript = () => {
  copyFile(cesiumPath, `public/cesium`, targets, true);
};

export default {
  runCesiumScript,
};
