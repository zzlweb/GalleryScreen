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

function StackedLine(lineDate) {
  return {
    legend: {
      icon: 'react',
      itemWidth: 2,
      itemHeight: 12,
      itemGap: 30,
      borderRadius: 1.5,
      data: ['当月新增', '当月废弃'],
      top: '3%',
      textStyle: {
        fontSize: 12,
        color: '#ffffff',
        fontWeight: 'bold',
        padding: [3, 0, 0, 5],
        lineHeight: 14,
      },
    },
    grid: {
      top: '10%',
      right: '5%',
      left: '5%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        data: lineDate.XData,
      },
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: '当月废弃',
        type: 'line',
        symbol: 'none',
        sampling: 'average',
        lineStyle: {
          width: 1,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: '#4261DE',
              },
              {
                offset: 1,
                color: 'rgba(0, 0, 0, 0.1)',
              },
            ],
            false,
          ),
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 10,
        },
        animationDelay: function (idx) {
          return idx * 10000;
        },
        itemStyle: {
          color: '#4261DE',
          borderColor: '#4261DE',
          borderWidth: 1,
        },
        emphasis: {
          focus: 'series',
        },
        data: lineDate.YData1,
      },
      {
        name: '当月新增',
        type: 'line',
        symbol: 'none',
        sampling: 'average',
        lineStyle: {
          width: 1,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: '#01ECD5',
              },
              {
                offset: 1,
                color: 'rgba(0, 0, 0, 0.1)',
              },
            ],
            false,
          ),
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 10,
        },
        itemStyle: {
          color: '#01ECD5',
          borderColor: '#01ECD5',
          borderWidth: 1,
        },
        animationDelay: function (idx) {
          return idx * 10000;
        },
        emphasis: {
          focus: 'series',
        },
        data: lineDate.YData2,
      },
    ],
  };
}

export default {
  LineChartSimple,
  StackedLine,
};
