import { defineConfig } from 'umi';

export default defineConfig({
  // layout: {},
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      exact: false,
      path: '/',
      component: '@/layouts/index',
      routes: [
        { path: '/', component: '@/pages/dashboard/index' },
        { path: '/three', component: '@/pages/Three/index' },
        { component: '@/pages/404' },
      ],
    },
  ],
  fastRefresh: {},
});
