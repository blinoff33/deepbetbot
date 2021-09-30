/* =============================================================
 Project		:	DeepBetBot
 Author			:	Dmitry Blinov
 Created date	:	20.08.2019
 Description	:	Таблица с результатами
  =============================================================== */

import React, { Component } from 'react';

import { CONSTANTS } from '../services/constants';
import { getTextForCopying } from '../services/texting';

export default class ResultsTable extends Component {

  constructor(props) {
    super(props);

  }

  getTextProbableScore(results) {
    var text =  "\n" + "Вероятные счета:"  + CONSTANTS.EMOJI.CUBE + "\n";
    if (results && results.totalChanceMatrix)
      results.totalChanceMatrix.sort(this.compareByChance).filter(this.filterByChance).map((x) => (
        text += x.goalsHome + ":" + x.goalsaway + " Вероятность: " + x.chance + "%" + "\n"
      ));

      return text;
  }

  getProbableScore() {
    if (this.props.results && this.props.results.totalChanceMatrix)
      return this.props.results.totalChanceMatrix.sort(this.compareByChance).filter(this.filterByChance).map((x, idx) => (
        <div key={idx}>{x.goalsHome}:{x.goalsaway} Вероятность: {x.chance}%</div>
      ));
  }

  getTotalsListItem(title, totalType, idx) {
    return <div key={idx}>
      {title} ({idx}.5) бол {this.getNumberValueFromProps("results", totalType + idx + "5B")}%<br />
    </div>
  }

  getTotalsList(title, totalType) {
    var totalsMaxCount = 4;

    var rows = [];
    for (var i = 0; i < totalsMaxCount; i++) {
      rows.push(this.getTotalsListItem(title, totalType, i));
    }

    return (<div>
      <b>{title}</b>
      <br />
      {rows}
      <br />
    </div>);
  }

  getNotBothScore() {
    return this.props.results && this.props.results.bothScore ? (100 - this.getNumberValueFromProps("results", "bothScore")) : 0;
  }

  getTitleFromPropsField(propsFieldName) {
    return this.props[propsFieldName] ? this.props[propsFieldName].title : "";
  }

  getNumberValueFromProps(parrentFieldName, childFieldName) {
    return this.props[parrentFieldName] && this.props[parrentFieldName][childFieldName] ? this.roundResultsValue(this.props[parrentFieldName][childFieldName]) : 0;
  }

  roundResultsValue(value) {
    return Math.round(value * 100) / 100
  }

  compareByChance(a, b) {
    if (a.chance < b.chance) {
      return 1;
    }
    if (a.chance > b.chance) {
      return -1;
    }
    return 0;
  }

  filterByChance(a) {
    return a.chance > CONSTANTS.CHANCE_CEILING;
  }

  getValueFromProps(parrentFieldName, childFieldName) {
    return this.props[parrentFieldName] && this.props[parrentFieldName][childFieldName] ? this.props[parrentFieldName][childFieldName] : "";
  }



  render() {
    var textForCopying = getTextForCopying(this.getTitleFromPropsField("league"), this.getTitleFromPropsField("homeTeam"), this.getTitleFromPropsField("awayTeam"),
      this.getNumberValueFromProps("results", "homeTeamXG"), this.getNumberValueFromProps("results", "awayTeamXG"),
      this.getNumberValueFromProps("results", "chanceHomeWin"), this.getNumberValueFromProps("results", "chanceFrienshipWin"), this.getNumberValueFromProps("results", "chanceAwayWin"),
      this.props.betData, this.getNumberValueFromProps("results", "bothScore"), this.getNotBothScore(), this.getTextProbableScore(this.props.results));

    return (<div style={{ display: "inline-block" }} className="default-margin">
      <textarea
        name="text-for-copying"
        id="xg90result"
        readOnly
        value={textForCopying}
        style={{ width: '98%', height: '335px', border: 0 }}
      /> <br />
      <table border="1" className="table table-striped table-bordered" id="result-table" style={{ verticalAlign: 'top', backgroundColor: 'white', textAlign: 'left' }}>
        <tbody>
          <tr style={{ verticalAlign: "top" }}>
            <td style={{ width: '50%' }}>

              <b>{this.getTitleFromPropsField("league")}</b><br />
              <b>{this.getTitleFromPropsField("homeTeam")} - {this.getTitleFromPropsField("awayTeam")}</b><br />
              <br />
              <div>
                <b>xG90 с учетом GD-xGD</b><br />
                {this.getTitleFromPropsField("homeTeam")} xG90 = {this.getNumberValueFromProps("results", "homeTeamXG")} <br />

                {this.getTitleFromPropsField("awayTeam")} xG90 = {this.getNumberValueFromProps("results", "awayTeamXG")} <br />
                <br /><br />

                <br />

                {/* <b>Угловые</b><br />
                {this.getTitleFromPropsField("homeTeam")} угл (ср.) = {this.getValueFromProps("results","homeStats") ? this.getValueFromProps("results","homeStats").corners: 0} <br />

                {this.getTitleFromPropsField("awayTeam")} угл (ср.) = {this.getValueFromProps("results","homeStats") ? this.getValueFromProps("results","awayStats").corners: 0}
              <br /><br /> */}
                <b>Вероятные счета: </b>
              </div>

              {this.getProbableScore()}

              <br />
              <b>1X2</b><br />

              П1 {this.getNumberValueFromProps("results", "chanceHomeWin")}%<br />
              Ничья {this.getNumberValueFromProps("results", "chanceFrienshipWin")}%<br />
              П2 {this.getNumberValueFromProps("results", "chanceAwayWin")}%<br />
              <br />
            </td>
            <td>

              <b>Двойной шанс</b><br />

              Команда 1 {this.getNumberValueFromProps("results", "home1XChance")}%<br />
              Команда 2 {this.getNumberValueFromProps("results", "away1XChance")}%<br />
              <br />

              {this.getTotalsList("Инд. Тотал КОМ1", "homeTotal")}
              {this.getTotalsList("Инд. Тотал КОМ2", "awayTotal")}
              {this.getTotalsList("Тотал", "total")}

              <b>Обе забьют</b><br />
              Да  {this.getNumberValueFromProps("results", "bothScore")}%<br />
              Нет {this.getNotBothScore()}%<br />
              <br />
              <br />
              <div><b>Больше прогнозов</b> - на vk.com/deepbetbot </div>

            </td>

          </tr>

        </tbody></table>

    </div>);
  }
}