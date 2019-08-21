/* =============================================================
 Project		:	DeepBetBot
 Author			:	Dmitry Blinov, spellabs
 Created date	:	20.08.2019
 Description	:	Выпадающий список выбора команды
  =============================================================== */

import React, { Component } from 'react';

export default class ChoiceTeams extends Component {

    constructor(props) {
        super(props);
    }

    onChangeTeam = (event) => {
        let teamsCode = event.target.value;
        let team = this.props.teams.find(team => team.code == teamsCode);

        this.props.onChangeTeam(team);
    }

    render() {

        return (<div>
            {this.props.choiceTitle}
            <select defaultValue=""
                name="choice-teams"
                onChange={this.onChangeTeam}
                disabled={this.props.loading}>
                <option key={0} value={0}>
                    -
              </option>
                {this.props.teams && this.props.teams.map((team, index) => {
                    return (
                        <option key={index} value={team.code}>
                            {team.title}
                        </option>
                    )
                })
                }
            </select>
        </div>);
    }
}