import { runCesiumScript } from './cesium';
import { runElementScript } from './easyplayer';
import { runTiandituScript } from './tianditu';

export interface DependOptions {
  cesium?: boolean;
  easyplayer?: boolean;
  tianditu?: boolean;
}

export type DependTypes = keyof DependOptions;

export const viteDepends = {
  cesium: runCesiumScript,
  tianditu: runTiandituScript,
  easyplayer: runElementScript,
};

export default viteDepends;
