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

function StackedLine(lineData) {
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
        data: lineData.XData,
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
        data: lineData.YData1,
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
        data: lineData.YData2,
      },
    ],
  };
}

function StackedLineTooltip(lineData) {
  return {
    legend: {
      icon: 'react',
      itemWidth: 2,
      itemHeight: 12,
      itemGap: 30,
      borderRadius: 1.5,
      data: ['WT', 'PW', 'CF', 'RF', 'GP'],
      top: '1%',
      textStyle: {
        fontSize: 12,
        color: '#ffffff',
        fontWeight: 'bold',
        padding: [3, 0, 0, 5],
        lineHeight: 14,
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(14,48,45,0.9)',
      padding: [7, 10],
      confine: true,
      axisPointer: {
        color: '#57617B',
      },
      borderColor: 'rgba(74,72,72)',
      textStyle: {
        color: '#b9b9ba',
      },
    },
    grid: {
      top: '10%',
      right: '8%',
      left: '8%',
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
        axisLabel: {
          margin: 10,
          fontSize: 12,
          color: '#b9b9ba',
          lineHeight: 14,
          formatter: function (value) {
            const date = value.slice(0, 9);
            const time = value.slice(9);

            return date + '\n' + time;
          },
        },
        data: lineData.XData,
      },
    ],
    yAxis: [
      {
        name: '传感器温度  K',
        nameLocation: 'middle',
        type: 'value',
        splitNumber: 4,
        nameTextStyle: {
          color: '#B9B9BA',
          padding: [0, 0, 20, 0],
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: 'WT',
        type: 'line',
        symbol: 'none',
        sampling: 'average',
        lineStyle: {
          width: 1,
        },
        areaStyle: {
          opacity: 0.32,
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
                color: 'rgba(2,247,236,0.15)',
              },
            ],
            false,
          ),
        },
        itemStyle: {
          color: '#01ECD5',
          borderColor: '#01ECD5',
          borderWidth: 1,
        },
        data: lineData.WTData,
      },
      {
        name: 'PW',
        type: 'line',
        symbol: 'none',
        sampling: 'average',
        lineStyle: {
          width: 1,
        },
        areaStyle: {
          opacity: 0.4,
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: '#4466F4',
              },
              {
                offset: 1,
                color: 'rgba(121,159,250,0.15)',
              },
            ],
            false,
          ),
        },
        itemStyle: {
          color: '#4466F4',
          borderColor: '#4466F4',
          borderWidth: 1,
        },
        data: lineData.PWRTData,
      },
      {
        name: 'CF',
        type: 'line',
        symbol: 'none',
        sampling: 'average',
        lineStyle: {
          width: 1,
        },
        areaStyle: {
          opacity: 0.4,
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: '#FFFFFF',
              },
              {
                offset: 1,
                color: 'rgba(255, 355, 355, 0.1)',
              },
            ],
            false,
          ),
        },
        itemStyle: {
          color: '#FFFFFF',
          borderColor: '#FFFFFF',
          borderWidth: 1,
        },
        data: lineData.CFCTData,
      },
      {
        name: 'RF',
        type: 'line',
        symbol: 'none',
        sampling: 'average',
        lineStyle: {
          width: 1,
        },
        areaStyle: {
          opacity: 0.4,
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: 'rgba(111,236,113,0.59)',
              },
              {
                offset: 1,
                color: 'rgba(111,236,113,0.09)',
              },
            ],
            false,
          ),
        },
        itemStyle: {
          color: '#6FEC71',
          borderColor: '#6FEC71',
          borderWidth: 1,
        },
        data: lineData.RFPAWRTData,
      },
      {
        name: 'GP',
        type: 'line',
        symbol: 'none',
        sampling: 'average',
        lineStyle: {
          width: 1,
        },
        areaStyle: {
          opacity: 0.4,
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: 'rgba(83,67,255,0.6)',
              },
              {
                offset: 1,
                color: 'rgba(83,67,255,0.15)',
              },
            ],
            false,
          ),
        },
        itemStyle: {
          color: '#5343ff',
          borderColor: '#5343ff',
          borderWidth: 1,
        },
        data: lineData.GPATData,
      },
    ],
  };
}

export default {
  LineChartSimple,
  StackedLine,
  StackedLineTooltip,
};
