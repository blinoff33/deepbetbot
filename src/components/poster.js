/* =============================================================
 Project		:	DeepBetBot
 Author			:	Dmitry Blinov
 Created date	:	21.08.2019
 Description	:	Афиша матча
  =============================================================== */

import React, { Component } from 'react';
import { CONSTANTS } from '../services/constants';

export default class Poster extends Component {

    constructor(props) {
        super(props);
        console.log('poster')
    }

    getStyle = (logoUrl) => {
        return {
            backgroundImage: 'url("'+logoUrl+'")',
        }
    }

    render() {

        return (<>
            {
                this.props && this.props.calculationResults && (this.props.calculationResults.homeStats != undefined) && (
                    <div id="poster" style={{ backgroundColor: 'white', textAlign: 'center' }}>
                        <img className="poster-item" src={this.props.calculationResults.homeStats != undefined ? CONSTANTS.URL_FOR_CORS + this.props.calculationResults.homeStats.logo : ''} style={this.getStyle(this.props.calculationResults.homeStats.logo)}></img>
                        <img className="poster-item" src={this.props.calculationResults.awayStats != undefined ? CONSTANTS.URL_FOR_CORS + this.props.calculationResults.awayStats.logo : ''} style={this.getStyle(this.props.calculationResults.awayStats.logo)}></img>
                    </div>)

            }
        </>
        );
    }
}