import React, { Component } from "react";
import $ from "jquery";

import Poster from './poster';
import Loading from './loading';
import ChoiceLeagues from './choice.leagues';
import ChoiceTeams from './choice.teams';
import ResultsTable from './results.table';
import ResultsGraphs from './results.graphs';
import { getLeaguesData } from '../services/factory';
import { parseLeaguesData } from '../services/parsing';
import { startCalculations } from '../services/calculations';
import { getNextTotal } from '../services/braining';
import Button from '@material-ui/core/Button';
import domtoimage from 'dom-to-image';
import '../styles/App.css';
import TextField from '@material-ui/core/TextField';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            leaguesData: {},
            homeTeam: {},
            awayTeam: {},
            calculationResults: {},
            betData: {
                p1ByBet: 0,
                friendshipByBet: 0,
                p2ByBet: 0
            },
            successCopy: false
        };

    }
    showPoster = true;
    showGraphs = true;

    setLoading = (isLoading) => {
        this.setState({ loading: isLoading });
    }

    //задает лигу
    setLeaguesData = (league) => {
        this.setState({ leaguesData: {}, homeTeam: {}, awayTeam: {}, calculationResults: {}, loading: true }, async () => {
            if (!league) {
                this.setState({ loading: false });
                return;
            };

            const response = await getLeaguesData(league);

            if (!response || !response.data) {
                alert('Ошибка получения данных');
                this.setState({ loading: false });
                return;
            }

            //получем данные о лиге
            var leaguesData = parseLeaguesData(response.data);
            //добавиляем в даные о лиге инфо об этой лиге (код, название, тип)
            leaguesData.league = league;
            this.setState({ leaguesData: leaguesData, loading: false });
        });
    }

    //изменение домашней команды
    onChangeHomeTeam = (team) => {
        this.onChangeTeam(team, "homeTeam");
    }

    onChangeAwayTeam = (team) => {
        this.onChangeTeam(team, "awayTeam");
    }

    //задает team свойству stateFieldName в state и запускает расчет
    onChangeTeam = (team, stateFieldName) => {
        this.setState({ [stateFieldName]: {}, calculationResults: {}, loading: true }, () => {
            if (!team) {
                this.setState({ loading: false });
                return;
            };

            this.setState({ [stateFieldName]: team, loading: false });
        });
    }
    startCalc = async () => {
        var calculationResults = await startCalculations(this.state.leaguesData, this.state.homeTeam, this.state.awayTeam, this.setLoading);
        this.setState({ calculationResults: calculationResults });
    }

    setLoading = (value) => {
        this.setState({ loading: value });
    }

    downloadAllGraphs = () => {
        $("canvas").each(function (id, item) {
            var canvas = item;
            var image = canvas.toDataURL("image/jpg", 1.0).replace("image/jpg", "image/octet-stream");
            var link = document.createElement('a');
            link.download = "result.jpg";
            link.href = image;
            link.click();
        });

        this.downloadResult('result-table');
        this.downloadResult('poster');
    };

    copyDivInnerText(divId) {
        var copyText = document.getElementById(divId);

        copyText.select();
        copyText.setSelectionRange(0, 99999);

        document.execCommand("copy");
    };

    downloadResult = (blockId) => {
        var node = document.getElementById(blockId);

        domtoimage.toPng(node)
            .then(function (dataUrl) {
                var link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'result.jpg';
                document.body.appendChild(link);
                link.click();
            })
            .catch(function (error) {
                alert('Что-то пошло не так', error)
            });
    };

    _handlePByBetChange = (e, pFieldName) => {
        var betData = this.state.betData;
        betData[pFieldName] = e.target.value;

        this.setState({
            betData: betData
        });
    };

    successCopyClose = () => this.setState({ successCopy: false });

    render() {
        const emptyResult = Object.entries(this.state.homeTeam).length === 0 || Object.entries(this.state.awayTeam).length === 0 || this.state.loading;

        return (
            <div className={"deepbetbot-card"}>
                <Loading open={this.state.successCopy} onClose={this.successCopyClose} autoHideDuration={1000} alertText="Текст успешно скопирован!" />
                <Backdrop open={this.state.loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>

                <div className="control">
                     <ChoiceLeagues setLeague={this.setLeaguesData} setLoading={this.setLoading} choiceTitle="Choose League" loading={this.state.loading} />
                    <ChoiceTeams teams={this.state.leaguesData.teams} choiceTitle="Choose Home Team" onChangeTeam={this.onChangeHomeTeam} loading={this.state.loading} />
                    <ChoiceTeams teams={this.state.leaguesData.teams} choiceTitle="Choose Away Team" onChangeTeam={this.onChangeAwayTeam} loading={this.state.loading} />

<div className="button-wrapper default-margin">
                        <TextField
                            id="55"
                            label="K1"
                            value={this.state.betData.p1ByBet}
                            onChange={(e) => this._handlePByBetChange(e, "p1ByBet")}
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="outlined" 
                            disabled={this.state.loading}/>
                    </div>
                    <div className="button-wrapper default-margin">
                        <TextField
                            id="66"
                            label="K2"
                            value={this.state.betData.p1ByBet}
                            onChange={(e) => this._handlePByBetChange(e, "p1ByBet")}
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="outlined" 
                            disabled={this.state.loading}/>
                    </div>
                    <div className="button-wrapper default-margin">
                        <TextField
                            id="2"
                            label="П1"
                            type="number"
                            value={this.state.betData.p1ByBet}
                            onChange={(e) => this._handlePByBetChange(e, "p1ByBet")}
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="outlined" 
                            disabled={this.state.loading}/>
                    </div>
                    <div className="button-wrapper default-margin">
                        <TextField
                            id="4"
                            label="Ничья"
                            type="number"
                            value={this.state.betData.friendshipByBet}
                            onChange={(e) => this._handlePByBetChange(e, "friendshipByBet")}
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="outlined" 
                            disabled={this.state.loading}/>
                    </div>
                    <div className="button-wrapper default-margin">
                        <TextField
                            id="3"
                            label="П2"
                            type="number"
                            value={this.state.betData.p2ByBet}
                            onChange={(e) => this._handlePByBetChange(e, "p2ByBet")}
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="outlined" 
                            disabled={this.state.loading}/>
                    </div>

                </div>
                {this.showPoster && <Poster calculationResults={this.state.calculationResults} />}

                <div className="button-wrapper default-margin">
                    <Button onClick={this.downloadAllGraphs} variant="contained" color="primary" disabled={emptyResult}>
                        Download
                    </Button>
                </div>
                <div className="button-wrapper default-margin">
                    <Button onClick={() => { this.copyDivInnerText("xg90result"); this.setState({ successCopy: true }); }} variant="contained" color="primary" disabled={emptyResult}>
                        Copy xG90
                    </Button>
                </div>
                <div className="button-wrapper default-margin">
                    <Button onClick={() => this.startCalc()} variant="contained" color="primary" disabled={emptyResult}>
                        Start Calc
                    </Button>
                </div>
                <br />
                {
                    !emptyResult &&
                    <>
                        <ResultsTable results={this.state.calculationResults} league={this.state.leaguesData.league} homeTeam={this.state.homeTeam} awayTeam={this.state.awayTeam} betData={this.state.betData} />
                        <br />

                        {this.showGraphs && <ResultsGraphs calculationResults={this.state.calculationResults} leaguesData={this.state.leaguesData} homeTeam={this.state.homeTeam} awayTeam={this.state.awayTeam} />}
                    </>
                }
            </div>
        );
    }
}

export default App;