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
        {
          exact: true,
          path: '/three',
          component: '@/pages/three/ThreeCT/index',
          name: 'three',
          title: 'three展示',
        },
        {
          exact: true,
          path: '/modelParts',
          component: '@/pages/modelParts/index',
          name: '模型部件',
          title: '模型部件',
        },
        {
          name: '图表',
          title: '图表',
          path: '/charts/lineChart',
          component: '@/pages/echarts/lineCharts/index',
        },
        {
          name: '表格',
          title: '表格',
          path: '/table',
          component: '@/pages/table/index',
        },
        { component: '@/pages/404', title: '404' },
      ],
    },
  ],
  fastRefresh: {},
});
