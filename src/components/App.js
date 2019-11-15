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
import { getNextTotal} from '../services/braining';

import '../styles/App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            leaguesData: {},
            homeTeam: {},
            awayTeam: {},
            calculationResults: {}
        };

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

            this.setState({ [stateFieldName]: team, loading: false }, async () => {
                var calculationResults = await startCalculations(this.state.leaguesData, this.state.homeTeam, this.state.awayTeam, this.setLoading);
                this.setState({ calculationResults: calculationResults });
            });
        });
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

    render() {
        return (
            <div className = "deepbetbot-card">
                <Loading isLoading={this.state.loading} />
                
                <ChoiceLeagues setLeague={this.setLeaguesData} choiceTitle="Choose League" loading={this.state.loading} />
                <ChoiceTeams teams={this.state.leaguesData.teams} choiceTitle="Choose Home Team" onChangeTeam={this.onChangeHomeTeam} loading={this.state.loading} />
                <ChoiceTeams teams={this.state.leaguesData.teams} choiceTitle="Choose Away Team" onChangeTeam={this.onChangeAwayTeam} loading={this.state.loading} />
                <button onClick={this.downloadAllGraphs}>Download Result</button>
                <br />
                <ResultsTable results={this.state.calculationResults} league={this.state.leaguesData.league} homeTeam={this.state.homeTeam} awayTeam={this.state.awayTeam} />
                
                <Poster calculationResults={this.state.calculationResults}/>

                <ResultsGraphs calculationResults={this.state.calculationResults} leaguesData={this.state.leaguesData} homeTeam={this.state.homeTeam} awayTeam={this.state.awayTeam} />
            </div>
        );
    }
}

export default App;