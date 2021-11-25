import { defineConfig } from 'umi';

export default defineConfig({
  // layout: {},
  nodeModulesTransform: {
    type: 'none',
  },
  antd: false,
  dynamicImport: {
    loading: '@/Loading.tsx',
  },
  mfsu: {},
  routes: [
    {
      exact: false,
      path: '/',
      component: '@/layouts/chart-layout/index',
      name: 'layout',
      title: '可视化展示',
      routes: [
        { exact: true, path: '/', redirect: '/dashboard' },
        {
          exact: true,
          path: '/dashboard',
          component: '@/pages/dashboard/index',
          name: 'dashboard',
          title: '智慧城市',
        },
        // {
        //   exact: true,
        //   path: '/three',
        //   component: '@/pages/three/index',
        //   name: 'three',
        //   title: 'three展示',
        // },
        { component: '@/pages/404', title: '404' },
      ],
    },
  ],
  fastRefresh: {},
});
