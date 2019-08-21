/* =============================================================
 Project		:	DeepBetBot
 Author			:	Dmitry Blinov, spellabs
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
        {/* http://jonjaques.github.io/react-loaders/ */ }

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