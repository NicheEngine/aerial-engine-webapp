import { runCesiumScript } from './cesium';
import { runElementScript } from './easyplayer';
import { runTiandituScript } from './tianditu';

export default {
  cesium: runCesiumScript,
  tianditu: runTiandituScript,
  easyplayer: runElementScript,
};
