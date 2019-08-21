/* =============================================================
 Project		:	DeepBetBot
 Author			:	Dmitry Blinov, spellabs
 Created date	:	20.08.2019
 Description	:	Таблица с результатами
  =============================================================== */

import React, { Component } from 'react';

import { CONSTANTS } from '../services/constants';

export default class ResultsTable extends Component {

  constructor(props) {
    super(props);

  }

  get1XChance() {
    if (this.props.results && this.props.results.chanceHomeWin) {
      var numerator = (this.props.results.chanceHomeWin + this.props.results.chanceFrienshipWin) * 100;
      var denominator = this.props.results.chanceAwayWin + 2 * this.props.results.chanceFrienshipWin + this.props.results.chanceHomeWin;

      return denominator ? this.roundResultsValue(numerator / denominator) : 0;
    }
    return 0
  }

  get2XChance() {
    if (this.props.results && this.props.results.chanceHomeWin) {
      var numerator = (this.props.results.chanceAwayWin + this.props.results.chanceFrienshipWin) * 100;
      var denominator = this.props.results.chanceAwayWin + 2 * this.props.results.chanceFrienshipWin + this.props.results.chanceHomeWin;

      return denominator ? this.roundResultsValue(numerator / denominator) : 0;
    }

    return 0
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

  render() {
    console.log(this.props);
    return (<div>
      <table width="40%" border="1" className="table table-striped table-bordered" id="result-table" style={{ verticalAlign: 'top', backgroundColor: 'white' }}>
        <tbody>
          <tr>
            <td style={{ width: '50%' }}>

              <b>{this.getTitleFromPropsField("league")}</b><br />
              <b>{this.getTitleFromPropsField("homeTeam")} - {this.getTitleFromPropsField("awayTeam")}</b><br />
              <br />
              <div>
                <b>xG90 с учетом GD-xGD</b><br />
                {this.getTitleFromPropsField("homeTeam")} xG90 = {this.getNumberValueFromProps("results", "homeTeamXG")} <br />

                {this.getTitleFromPropsField("awayTeam")} xG90 = {this.getNumberValueFromProps("results", "awayTeamXG")}
              <br /><br />
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

              Команда 1 {this.get1XChance()}%<br />
              Команда 2 {this.get2XChance()}%<br />
              <br />

              {this.getTotalsList("Инд. Тотал КОМ1", "homeTotal")}
              {this.getTotalsList("Инд. Тотал КОМ2", "awayTotal")}
              {this.getTotalsList("Тотал", "total")}

              <b>Обе забьют</b><br />
              Да  {this.getNumberValueFromProps("results", "bothScore")}%<br />
              Нет {this.getNotBothScore()}%<br />
              <br />
              <br />
              { false && (<div><b>Больше прогнозов</b> - на vk.com/deepbetbot </div>)}
            </td>

          </tr>

        </tbody></table>

    </div>);
  }
}