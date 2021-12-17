const leftMenus = [
  {
    path: '/dashboard',
    name: '智慧城市',
    key: 'dashboard',
  },
  {
    key: 'ThreeJS',
    name: 'three巡视',
    child: [
      {
        path: '/three',
        name: 'threeCT',
        icon: 'GlobalOutlined',
      },
    ],
  },
  {
    path: '/modelParts',
    key: 'modelParts',
    name: '模型部件',
  },
  {
    key: 'charts',
    name: '图表',
    child: [
      {
        path: '/charts/LineChart',
        name: '折线图',
      },
      {
        path: '/charts/HistogramChart',
        name: '柱状图',
      },
    ],
  },
  {
    key: 'table',
    name: '表格',
    path: '/table',
  },
];

export { leftMenus };
