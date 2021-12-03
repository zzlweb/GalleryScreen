import * as echarts from 'echarts';

function LineChartSimple(lineData) {
  return {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: lineData.XData,
      axisTick: {
        show: false,
      },
      axisLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(241,241,241,0.3)',
          width: 0.5,
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(241,241,241,0.3)',
          width: 0.5,
        },
      },
      axisTick: {
        show: false,
        inside: false,
      },
      axisLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
      },
      splitLine: {
        show: false,
      },
    },
    grid: {
      top: '10%',
      right: '5%',
      left: '5%',
      bottom: '10%',
      containLabel: true,
    },
    series: [
      {
        data: lineData.YData,
        type: 'line',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: '#81E4FF',
              },
              {
                offset: 1,
                color: 'rgba(41,52,85,0.00)',
              },
            ],
            false,
          ),
        },

        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: '#81E4FF',
        },
      },
    ],
  };
}

export default {
  LineChartSimple,
};
