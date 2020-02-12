/* =============================================================
 Project		:	DeepBetBot
 Author			:	Dmitry Blinov
 Created date	:	21.08.2019
 Description	:	Индикатор загрузки
  =============================================================== */

import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default class Loading extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<>
            <Snackbar open={this.props.open} onClose={this.props.onClose} autoHideDuration={this.props.autoHideDuration} >
                    <Alert onClose={this.props.onClose} severity="success">
                        {this.props.alertText}
                    </Alert>
            </Snackbar>
        </>
        );
    }
}