/* =============================================================
 Project		:	DeepBetBot
 Author			:	Dmitry Blinov
 Created date	:	20.08.2019
 Description	:	Графики с результатами
  =============================================================== */

import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

import { getPieChartOption, getRadarChartOption, getBarChartOption, getLineChartOption, getScatterChartOption } from '../services/drawing';

export default class ResultsGraphs extends Component {

  constructor(props) {
    super(props);

  }

  getDoubleChanceChartDataName() {
    return ["1X", "2X"];
  }

  getDoubleChanceChartDatavalue() {
    if (this.checkIfObjectIsEmpty(this.props.calculationResults) || !this.props.calculationResults)
        return [0, 0];

    return [this.props.calculationResults.home1XChance, this.props.calculationResults.away1XChance];
  }

  get1X2ChartDataName() {
    if (this.checkIfObjectIsEmpty(this.props.homeTeam) && this.checkIfObjectIsEmpty(this.props.awayTeam))
      return ["", "", ""]

    return [this.props.homeTeam.title, "Ничья", this.props.awayTeam.title];
  }

  get1X2ChartDataValue() {
    if (this.checkIfObjectIsEmpty(this.props.calculationResults) || !this.props.calculationResults)
      return [0, 0, 0];

    return [this.roundResultsValue(this.props.calculationResults.chanceHomeWin), this.roundResultsValue(this.props.calculationResults.chanceFrienshipWin), this.roundResultsValue(this.props.calculationResults.chanceAwayWin)];
  }

  getLineChartData() {
    var homeTeamResults = (this.checkIfObjectIsEmpty(this.props.calculationResults) || !this.props.calculationResults) ? [] : this.props.calculationResults.homeTeamResults;
    var awayTeamResults = (this.checkIfObjectIsEmpty(this.props.calculationResults) || !this.props.calculationResults) ? [] : this.props.calculationResults.awayTeamResults;
    var avgScoreGoals =  (this.checkIfObjectIsEmpty(this.props.leaguesData) || !this.props.leaguesData) ? [] : this.props.leaguesData.avgScoreGoals;
    var homeSeriesData = [];
    var awaySeriesData = [];
    var awgScore = [];
    var xAxisData = [];

    for (var i = 0; i < homeTeamResults.length; i++) {
      var total = parseFloat(homeTeamResults[i].score[0]) + parseFloat(homeTeamResults[i].score[4]);
      homeSeriesData.push(total); //тотал в матчах хозяев
      xAxisData.push(i + 1); // для подписи оси х
      awgScore.push(avgScoreGoals); // средний тотал в чемпионате
    }

    for (var i = 0; i < awayTeamResults.length; i++) {
      var total = parseFloat(awayTeamResults[i].score[0]) + parseFloat(awayTeamResults[i].score[4]);
      awaySeriesData.push(total);
      //  legendData.push(i+1);
    }
    var res = {
      homeSeriesData: homeSeriesData,
      awaySeriesData: awaySeriesData,
      awgScore: awgScore
    }

    return res;
  }

  getValueFromProps(parrentFieldName, childFieldName) {
    return this.props[parrentFieldName] && this.props[parrentFieldName][childFieldName] ? this.props[parrentFieldName][childFieldName] : "";
  }

  roundResultsValue = (value) => {
    return Math.round(value * 100) / 100;
  }

  //проверка пустой ли объект
  checkIfObjectIsEmpty(obj) {
    return (JSON.stringify(obj) === JSON.stringify({}));
  }

  render() {
    console.log(this.props);
    return (<div>
      {/* https://www.npmjs.com/package/echarts-for-react */}
      <ReactEcharts style={{height: '1000px', width: '1000px'}} option={getPieChartOption("Двойной шанс", this.getDoubleChanceChartDataName(), this.getDoubleChanceChartDatavalue(), true)} />
      <ReactEcharts style={{height: '1000px', width: '1000px'}} option={getPieChartOption("1X2", this.get1X2ChartDataName(), this.get1X2ChartDataValue(), false)} />
      <ReactEcharts style={{height: '1000px', width: '1000px'}} option={getRadarChartOption("Статистика", this.getValueFromProps("homeTeam","title"), this.getValueFromProps("awayTeam","title"), this.getValueFromProps("calculationResults","homeStats"), this.getValueFromProps("calculationResults","awayStats"))} />
      <ReactEcharts style={{height: '1000px', width: '1000px'}} option={getBarChartOption(this.getValueFromProps("homeTeam","title") + " Кол-во забитых мячей", "#c23531", this.getValueFromProps("calculationResults","homeChanceMatrix"))} />
      <ReactEcharts style={{height: '1000px', width: '1000px'}} option={getBarChartOption(this.getValueFromProps("awayTeam","title") + " Кол-во забитых мячей", "#547b95", this.getValueFromProps("calculationResults","awayChanceMatrix"))} />
      <ReactEcharts style={{height: '1000px', width: '1000px'}} option={getLineChartOption("Тоталы предыдущих матчей", this.getValueFromProps("homeTeam","title"), this.getValueFromProps("awayTeam","title"), this.getLineChartData())} />
      <ReactEcharts style={{height: '1000px', width: '1000px'}} option={getScatterChartOption(this.getValueFromProps("homeTeam","title"), this.getValueFromProps("awayTeam","title"), this.getValueFromProps("calculationResults","matrixForDrawingScore"))} />

    </div>);
  }
}