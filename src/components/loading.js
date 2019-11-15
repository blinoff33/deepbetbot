/* =============================================================
 Project		:	DeepBetBot
 Author			:	Dmitry Blinov
 Created date	:	21.08.2019
 Description	:	Индикатор загрузки
  =============================================================== */

import React, { Component } from 'react';
import Loader from 'react-loaders';

export default class Loading extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<>
            {this.props.isLoading && (
                <div id="blackout">
                    <Loader type="cube-transition" />
                </div>
            )}
        </>
        );
    }
}