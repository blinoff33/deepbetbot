/* =============================================================
 Project		:	DeepBetBot
 Author			:	Dmitry Blinov
 Created date	:	19.08.2019
 Description	:	Выпадающий список выбора лиги
  =============================================================== */

import React, { Component } from 'react';
import { CONSTANTS } from '../services/constants';
import Select from 'react-select';

export default class ChoiceLeagues extends Component {

    constructor(props) {
        super(props);
     }

    onChangeLeague = (selectedOption) => {
        let leaguesCode = selectedOption.value;
        let league = CONSTANTS.LEAGUES.find(league => league.code == leaguesCode);

        this.props.setLeague(league);
    };

    getLeaguesSelectOptions = () => {
        var options = [{value: null, label: '-'}]; 
        for (var i=0; i < CONSTANTS.LEAGUES.length; i++)
        {
            var l = CONSTANTS.LEAGUES[i];
            options.push({value: l.code, label: l.title});
        }
        return options;
    };

    render() {
          
        return (<div>
            <Select
        options={this.getLeaguesSelectOptions()}
        placeholder={this.props.choiceTitle}
        onChange={this.onChangeLeague}
        isDisabled={this.props.loading}
        isSearchable={true}
      />
        </div>);
    }
}