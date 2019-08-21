/* =============================================================
 Project		:	DeepBetBot
 Author			:	Dmitry Blinov, spellabs
 Created date	:	20.08.2019
 Description	:	Таблица с результатами
  =============================================================== */

import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

import { getPieChartOption, getRadarChartOption, getBarChartOption, getLineChartOption } from '../services/drawing';

export default class ResultsGraphs extends Component {

  constructor(props) {
    super(props);

  }


  get1XChance = () => {
    var results = this.props.calculationResults;

    if (results && results.chanceHomeWin) {
      var numerator = (results.chanceHomeWin + results.chanceFrienshipWin) * 100;
      var denominator = results.chanceAwayWin + 2 * results.chanceFrienshipWin + results.chanceHomeWin;

      return denominator ? this.roundResultsValue(numerator / denominator) : 0;
    }
    return 0
  }

  get2XChance = () => {
    var results = this.props.calculationResults;

    if (results && results.chanceHomeWin) {
      var numerator = (results.chanceAwayWin + results.chanceFrienshipWin) * 100;
      var denominator = results.chanceAwayWin + 2 * results.chanceFrienshipWin + results.chanceHomeWin;

      return denominator ? this.roundResultsValue(numerator / denominator) : 0;
    }

    return 0
  };

  getDoubleChanceChartDataName() {
    return ["1X", "2X"];
  }

  getDoubleChanceChartDatavalue() {
    return [this.get1XChance(), this.get2XChance()];
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

    console.log(homeTeamResults);
    console.log(awayTeamResults);

    
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

console.log(res);
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
      <ReactEcharts option={getPieChartOption("Двойной шанс", this.getDoubleChanceChartDataName(), this.getDoubleChanceChartDatavalue())} />
      <ReactEcharts option={getPieChartOption("1X2", this.get1X2ChartDataName(), this.get1X2ChartDataValue())} />
      <ReactEcharts option={getRadarChartOption("Статистика", this.getValueFromProps("homeTeam","title"), this.getValueFromProps("awayTeam","title"), this.getValueFromProps("calculationResults","homeStats"), this.getValueFromProps("calculationResults","awayStats"))} />
      <ReactEcharts option={getBarChartOption(this.getValueFromProps("homeTeam","title") + " Кол-во забитых мячей", "#c23531", this.getValueFromProps("calculationResults","homeChanceMatrix"))} />
      <ReactEcharts option={getBarChartOption(this.getValueFromProps("awayTeam","title") + " Кол-во забитых мячей", "#547b95", this.getValueFromProps("calculationResults","awayChanceMatrix"))} />
      <ReactEcharts option={getLineChartOption("Тоталы предыдущих матчей", this.getValueFromProps("homeTeam","title"), this.getValueFromProps("awayTeam","title"), this.getLineChartData())} />

    </div>);
  }
}