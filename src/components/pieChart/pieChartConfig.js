import * as echarts from 'echarts';
import { fitChartSize } from '@/utils/echartsResize.js';

function PieConfig(chartData) {
  let bgVal = 100 - chartData.val;
  return {
    tooltip: {
      show: true,
      textStyle: {
        color: '#000',
        fontSize: fitChartSize(12),
      },
    },
    legend: {
      top: '5%',
      left: 'center',
      textStyle: {
        color: '#fff',
        fontSize: fitChartSize(12),
      },
    },
    grid: {
      top: '15%',
      right: '5%',
      left: '5%',
      bottom: '10%',
      containLabel: true,
    },
    series: [
      {
        name: '云服务器',
        type: 'pie',
        radius: ['50%', '70%'],
        label: {
          show: false,
          position: 'center',
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            name: '已使用',
            value: chartData.val,
            color: chartData.pieColor,
            emphasis: {
              color: chartData.pieColor,
            },
          },
          {
            value: bgVal,
            name: '未使用',
            itemStyle: {
              color: chartData.bgColor, // 未完成的圆环的颜色
            },
          },
        ],
      },
    ],
  };
}

export default {
  PieConfig,
};
