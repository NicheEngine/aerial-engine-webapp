import type { RouteRecordRaw } from 'vue-router';

import {
  ENGINE_DOC_URL,
  ENGINE_ELE_PREVIEW_URL,
  ENGINE_GITHUB_URL,
  ENGINE_LOGO_URL,
  ENGINE_NAIVE_PREVIEW_URL,
} from '@aerial-engine/constants';

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
    path: '/aerial-engine',
    children: [
      {
        name: 'EngineDocument',
        path: '/aerial-engine/document',
        component: IFrameView,
        meta: {
          icon: 'lucide:book-open-text',
          link: ENGINE_DOC_URL,
          title: $t('demos.engine.document'),
        },
      },
      {
        name: 'EngineGithub',
        path: '/aerial-engine/github',
        component: IFrameView,
        meta: {
          icon: 'mdi:github',
          link: ENGINE_GITHUB_URL,
          title: 'Github',
        },
      },
      {
        name: 'EngineNaive',
        path: '/aerial-engine/naive',
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
        path: '/aerial-engine/ele',
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
    name: 'EngineAbout',
    path: '/aerial-engine/about',
    component: () => import('#/views/_core/about/index.vue'),
    meta: {
      icon: 'lucide:copyright',
      title: $t('demos.engine.about'),
      order: 9999,
    },
  },
];

export default routes;
