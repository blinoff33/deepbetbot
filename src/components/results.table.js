/* =============================================================
 Project		:	DeepBetBot
 Author			:	Dmitry Blinov
 Created date	:	20.08.2019
 Description	:	Таблица с результатами
  =============================================================== */

import React, { Component } from 'react';

import { CONSTANTS } from '../services/constants';

export default class ResultsTable extends Component {

  constructor(props) {
    super(props);

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
    var xg90text = this.getTitleFromPropsField("league") + "\n" +
    this.getTitleFromPropsField("homeTeam") + " - " + this.getTitleFromPropsField("awayTeam") + "\n"+
    this.getTitleFromPropsField("homeTeam") +" xG90 = " +this.getNumberValueFromProps("results", "homeTeamXG") + "\n" +
            this.getTitleFromPropsField("awayTeam") +" xG90 = " +this.getNumberValueFromProps("results", "awayTeamXG");

    return (<div style={{display: "inline-block"}}>
      <table border="1" className="table table-striped table-bordered" id="result-table" style={{ verticalAlign: 'top', backgroundColor: 'white', textAlign: 'left' }}>
        <tbody>
          <tr style={{verticalAlign: "top"}}>
            <td style={{ width: '50%' }}>

              <b>{this.getTitleFromPropsField("league")}</b><br />
              <b>{this.getTitleFromPropsField("homeTeam")} - {this.getTitleFromPropsField("awayTeam")}</b><br />
              <br />
              <div>
                <b>xG90 с учетом GD-xGD</b><br />
                {this.getTitleFromPropsField("homeTeam")} xG90 = {this.getNumberValueFromProps("results", "homeTeamXG")} <br />

                {this.getTitleFromPropsField("awayTeam")} xG90 = {this.getNumberValueFromProps("results", "awayTeamXG")} <br />
              <br /><br />

                         
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
              <textarea name="sdf" readOnly value={xg90text} style={{width: 0, height: 0}} id="xg90result"/> 
            </td>

          </tr>

        </tbody></table>

    </div>);
  }
}