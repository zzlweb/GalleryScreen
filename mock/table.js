let data = [
  {
    id: 1,
    key: 1,
    name: 'umi',
    desc: '极快的类 Next.js 的 React 应用框架。',
    url: 'https://umijs.org',
    tags: ['nice', 'developer'],
  },
  {
    id: 2,
    key: 2,
    name: 'antd',
    desc: '一个服务于企业级产品的设计体系。',
    url: 'https://ant.design/index-cn',
    tags: ['nice', 'developer'],
  },
  {
    id: 3,
    key: 3,
    name: 'antd-pro',
    desc: '一个服务于企业级产品的设计体系。',
    url: 'https://ant.design/index-cn',
    tags: ['cool', 'teacher'],
  },
];

export default {
  'get /api/tables': function (req, res, next) {
    setTimeout(() => {
      res.json({
        result: data,
      });
    }, 250);
  },
  'delete /api/tables/:id': function (req, res, next) {
    data = data.filter((v) => v.id !== parseInt(req.params.id));
    setTimeout(() => {
      res.json({
        success: true,
      });
    }, 250);
  },
  'post /api/tables/add': function (req, res, next) {
    data = [
      ...data,
      {
        ...req.body,
        id: data[data.length - 1].id + 1,
        key: data[data.length - 1].id + 1,
      },
    ];

    res.json({
      success: true,
    });
  },
  'post /api/tables/changelist': function (req, res, next) {
    const { row, index } = req.body;

    const item = data[index];
    const { name, desc, url } = row;
    item.name = name;
    item.desc = desc;
    item.url = url;

    res.json({
      success: true,
    });
  },
  'get /api/tables/:id/statistic': function (req, res, next) {
    res.json({
      result: [
        {
          genre: 'Sports',
          sold: 275,
        },
        {
          genre: 'Strategy',
          sold: 1150,
        },
        {
          genre: 'Action',
          sold: 120,
        },
        {
          genre: 'Shooter',
          sold: 350,
        },
        {
          genre: 'Other',
          sold: 150,
        },
      ],
    });
  },
};
