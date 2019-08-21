/* =============================================================
 Project		:	DeepBetBot
 Author			:	Dmitry Blinov, spellabs
 Created date	:	19.08.2019
 Description	:	Выпадающий список выбора лиги
  =============================================================== */

import React, { Component } from 'react';
import { CONSTANTS } from '../services/constants';

export default class ChoiceLeagues extends Component {

    constructor(props) {
        super(props);
     }

    onChangeLeague = (event) => {
        let leaguesCode = event.target.value;
        let league = CONSTANTS.LEAGUES.find(league => league.code == leaguesCode);

        this.props.setLeague(league);
    }

    render() {

        return (<div>
            {this.props.choiceTitle}
            <select defaultValue=""
                name="choice-league"
                onChange={this.onChangeLeague}
                disabled={this.props.loading}>
                <option key={0} value={0} >
                    -
              </option>
                {CONSTANTS.LEAGUES.map((league, index) => {
                    return (
                        <option key={index} value={league.code}>
                            {league.title}
                        </option>
                    )
                })
                }
            </select>
        </div>);
    }
}