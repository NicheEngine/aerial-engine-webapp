import type { RouteRecordRaw } from 'vue-router';

import {
  ENGINE_ANT_PREVIEW_URL,
  ENGINE_DOC_URL,
  ENGINE_ELE_PREVIEW_URL,
  ENGINE_GITHUB_URL,
  ENGINE_LOGO_URL,
  ENGINE_NAIVE_PREVIEW_URL,
} from '@engine/constants';
import { SvgAntdvLogoIcon } from '@engine/icons';

import { IFrameView } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      badgeType: 'dot',
      icon: ENGINE_LOGO_URL,
      order: 9998,
      title: $t('demos.engine.title'),
    },
    name: 'EngineProject',
    path: '/engine',
    children: [
      {
        name: 'EngineDocument',
        path: '/engine/document',
        component: IFrameView,
        meta: {
          icon: 'lucide:book-open-text',
          link: ENGINE_DOC_URL,
          title: $t('demos.engine.document'),
        },
      },
      {
        name: 'EngineGithub',
        path: '/engine/github',
        component: IFrameView,
        meta: {
          icon: 'mdi:github',
          link: ENGINE_GITHUB_URL,
          title: 'Github',
        },
      },
      {
        name: 'EngineAntdv',
        path: '/engine/antdv',
        component: IFrameView,
        meta: {
          badgeType: 'dot',
          icon: SvgAntdvLogoIcon,
          link: ENGINE_ANT_PREVIEW_URL,
          title: $t('demos.engine.antdv'),
        },
      },
      {
        name: 'EngineNaive',
        path: '/engine/naive',
        component: IFrameView,
        meta: {
          badgeType: 'dot',
          icon: 'logos:naiveui',
          link: ENGINE_NAIVE_PREVIEW_URL,
          title: $t('demos.engine.naive-ui'),
        },
      },
      {
        name: 'EngineElementPlus',
        path: '/engine/ele',
        component: IFrameView,
        meta: {
          badgeType: 'dot',
          icon: 'logos:element',
          link: ENGINE_ELE_PREVIEW_URL,
          title: $t('demos.engine.element-plus'),
        },
      },
    ],
  },
  {
    component: () => import('#/views/_core/about/index.vue'),
    meta: {
      icon: 'lucide:copyright',
      order: 9999,
      title: $t('demos.engine.about'),
    },
    name: 'EngineAbout',
    path: '/engine/about',
  },
];

export default routes;
