/* =============================================================
 Project		:	DeepBetBot
 Author			:	Dmitry Blinov
 Created date	:	19.08.2019
 Description	:	Выпадающий список выбора лиги
  =============================================================== */

import React, { Component } from 'react';
import { CONSTANTS } from '../services/constants';
import Select from 'react-select';
import { getAlldata } from '../services/factory';
import { parseAllData } from '../services/parsing';

export default class ChoiceLeagues extends Component {

    constructor(props) {
         super(props);
         this.state = {
            LEAGUES: []
        }
     }
    componentDidMount = () => {
        this.setState({ LEAGUES: CONSTANTS.LEAGUES })

        getAlldata().then(response => {
            if (!response || !response.data) {
                alert('Ошибка получения данных');
                this.setState({ loading: false });
                return;
            }

            var LEAGUES = parseAllData(response);

            this.setState({ LEAGUES: LEAGUES })
        });
    }

    onChangeLeague = (selectedOption) => {
        let leaguesCode = selectedOption.value;
        let league = this.state.LEAGUES.find(league => league.code == leaguesCode);

        this.props.setLeague(league);
    };

    getLeaguesSelectOptions = () => {
        var options = [{value: null, label: '-'}]; 
        for (var i=0; i < this.state.LEAGUES.length; i++)
        {
            var l = this.state.LEAGUES[i];
            options.push({value: l.code, label: l.title});
        }
        return options;
    };

    render() {
          
        return (<div className="default-margin">
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