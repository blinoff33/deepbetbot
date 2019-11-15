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
    }

    getStyle = () => {
        return {
            width: '800px',
            height: '800px',
            marginTop: '200px',
            verticalAlign: 'middle'
        }
    }

    render() {

        return (<>
            {
                this.props && this.props.calculationResults && (this.props.calculationResults.homeStats != undefined) && (
                    <div id="poster" style={{ backgroundColor: 'white', textAlign: 'center', height: '1200px' }}>
                        <img src={this.props.calculationResults.homeStats != undefined ? CONSTANTS.URL_FOR_CORS + this.props.calculationResults.homeStats.logo : ''} style={this.getStyle()}></img>
                        <img src={this.props.calculationResults.awayStats != undefined ? CONSTANTS.URL_FOR_CORS + this.props.calculationResults.awayStats.logo : ''} style={this.getStyle()}></img>
                    </div>)

            }
        </>
        );
    }
}