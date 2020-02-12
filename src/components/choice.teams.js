/* =============================================================
 Project		:	DeepBetBot
 Author			:	Dmitry Blinov
 Created date	:	20.08.2019
 Description	:	Выпадающий список выбора команды
  =============================================================== */

import React, { Component } from 'react';
import Select from 'react-select';

export default class ChoiceTeams extends Component {

    constructor(props) {
        super(props);
    }

    onChangeTeam = (selectedOption) => {
        let teamsCode = selectedOption.value;
        let team = this.props.teams.find(team => team.code == teamsCode);

        this.props.onChangeTeam(team);
    };

    getTeamsSelectOptions = () => {
        var options = [{ value: '-', label: '-' }];
        if (this.props.teams) {
            for (var i = 0; i < this.props.teams.length; i++) {
                var l = this.props.teams[i];
                options.push({ value: l.code, label: l.title });
            }
        }
        return options;
    };

    render() {

        return (<div className="default-margin">
             <Select
                options={this.getTeamsSelectOptions()}
                placeholder={this.props.choiceTitle}
                onChange={this.onChangeTeam}
                isDisabled={this.props.loading}
                isSearchable={true}
            />
        </div>);
    }
}