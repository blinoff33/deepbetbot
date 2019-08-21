/* =============================================================
 Project		:	DeepBetBot
 Author			:	Dmitry Blinov, spellabs
 Created date	:	21.08.2019
 Description	:	Методы для построения графиков
 =============================================================== */
import { CONSTANTS } from './constants';

export function getPieChartOption(title, dataName, dataValue) {
    var data = [];
    for (var i = 0; i < dataName.length; i++) {
        var value = dataValue[i];
        var name = dataName[i];
        var dataItem = {
            value: value,
            name: name + ' ' + value + '%'
        }
        data.push(dataItem);
    }
    console.log(dataName)
    console.log(dataValue)

    var option = {
        backgroundColor: '#fff',
        color: [
            '#547b95', '#fec42c', '#c23531'
        ],
        title: {
            text: title,
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/> {b}"
        },
        series: [
            {
                name: title,
                type: 'pie',
                radius: '65%',
                center: ['50%', '60%'],
                data: data,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }

    return option;
}

export function getRadarChartOption(title, homeTeamName, awayTeamName, homeTeamStats, awayTeamStats) {
    var option = {
        backgroundColor: '#fff',
        title: {
            text: title
        },
        tooltip: {},
        legend: {
            data: [homeTeamName, awayTeamName]
        },
        radar: {
            // shape: 'circle',
            name: {
                textStyle: {
                    color: '#fff',
                    backgroundColor: '#999',
                    borderRadius: 3,
                    padding: [3, 5]
                }
            },
            indicator: getIndicatorsForRadarChart(homeTeamStats)
        },
        series: [{
            name: homeTeamName + ' vs ' + awayTeamName,
            type: 'radar',
            data: [
                {
                    value: getDataValueForRadarChart(homeTeamStats),
                    name: homeTeamName
                },
                {
                    value: getDataValueForRadarChart(awayTeamStats),
                    name: awayTeamName
                }
            ]
        }]
    };

    return option;
}

export function getBarChartOption (title, color, chanceMatrix) {
    var option = {
        backgroundColor: '#fff',
        title : {
      text: title,
      x:'center'
      },
          color: [color],
          tooltip : {
              trigger: 'axis',
              axisPointer : { 
                  type : 'shadow'
              }
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis : [
              {
                  type : 'category',
                  data : getBarChartxAxisData(),
                  axisTick: {
                      alignWithLabel: true
                  }
              }
          ],
          yAxis : [
              {
                  type : 'value'
              }
          ],
          series : [
              {
                  name: title,
                  type:'bar',
                  barWidth: '60%',
                  data: getBarChartsData(chanceMatrix)
              }
          ]
      };

      return option;
}

export function getLineChartOption(title, homeTeamName, awayTeamName, seriesData) {
    var awgScoreLineTitle = "Ср. результативность чемпионата";
    var homeSeriesData =seriesData.homeSeriesData;
    var awaySeriesData = seriesData.awaySeriesData;
    var awgScore = seriesData.awgScore;

    var option = {
        backgroundColor: '#fff',
       title: {
           text: title
       },
       tooltip: {
           trigger: 'axis'
       },
       legend: {
           data: [homeTeamName, awayTeamName, awgScoreLineTitle]
       },
       grid: {
           left: '3%',
           right: '4%',
           bottom: '3%',
           containLabel: true
       },
       xAxis: {
           type: 'category',
           boundaryGap: false,
           data: getLineChartxAxisData(homeSeriesData)
       },
       yAxis: {
           type: 'value'
       },
       series: [
           {
               name:  homeTeamName,
               type:'line',
               stack: 'stack1',
               data: homeSeriesData,
               areaStyle: {
                   normal: {
                       color: '#ccc'
                   }
               },
           smooth: true
           },
           {
               name: awayTeamName,
               type:'line',
               stack: 'stack2',
               data: awaySeriesData,
               areaStyle: {
                   normal: {
                       color: '#ccc'
                   }
               },
               smooth: true
           },
           {
               name: awgScoreLineTitle,
               type:'line',
               stack: 'stack3',
               data: awgScore,
               areaStyle: {
                   normal: {
                       color: '#f7fff5'
                   }
               },
               smooth: true
           }
       ]
   };

   return option;
}

function getLineChartxAxisData(homeSeriesData) {
    var data = [];
    var max = homeSeriesData ? homeSeriesData.length : 0;

    for (var i = 0; i <= max; i++) {
        data.push(i);
    }
    return data;
}

function getBarChartxAxisData() {
    var data = [];
    for (var i = 0; i <= CONSTANTS.MAX_GOALS_COUNT; i++) {
        data.push(i);
    }
    return data;
}

function getBarChartsData(chanceMatrix) {
    var data = [];
    if (!chanceMatrix) return data;

    for (var i = 0; i <= CONSTANTS.MAX_GOALS_COUNT; i++) {
        data.push(chanceMatrix[i].chance);
    }
    return data;
}

function getDataValueForRadarChart(stats) {
    if (!stats) return [];
    var res = [
        parseFloat(stats.ballPos),
        stats.fall,
        stats.corners,
        parseFloat(stats.realizations),
        parseFloat(stats.accuracy),
        stats.target,
        stats.shoots,
        stats.goals,
        stats.attak];

    if (!stats.attak) res.length = res.length - 1;

    return res;
}

function getIndicatorsForRadarChart(stats) {
    var res = [
        { name: 'Владение мячом' },
        { name: 'Фолы' },
        { name: 'Угловые' },
        { name: 'Реализация' },
        { name: 'Точность ударов' },
        { name: 'Удары в створ' },
        { name: 'Удары по воротам' },
        { name: 'Забитые мячи' },
        { name: 'Опасные атаки' }];

        if (stats && !stats.attak) res.length = res.length - 1;

        return res;
}