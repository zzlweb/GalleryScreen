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
    name: '图表练手',
    child: [
      {
        path: '/charts/lineChart',
        name: '折线',
      },
    ],
  },
];

export { leftMenus };
