import React, { Component } from "react";

import Loading from './loading';
import ChoiceLeagues from './choice.leagues';
import ChoiceTeams from './choice.teams';
import ResultsTable from './results.table';
import ResultsGraphs from './results.graphs';
import { getLeaguesData } from '../services/factory';
import { parseLeaguesData } from '../services/parsing';
import { startCalculations } from '../services/calculations';

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
            console.log(leaguesData);}
        );
    }

    //изменение домашней команды
    onChangeHomeTeam = (team) => {
        this.onChangeTeam(team, "homeTeam");
    }

    onChangeAwayTeam = (team, stateFieldName) => {
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


    render() {
        return (
            <div>
                <h1>!</h1>
                <Loading isLoading={this.state.loading} />
                <ChoiceLeagues setLeague={this.setLeaguesData} choiceTitle="Choose League" loading={this.state.loading} />
                <ChoiceTeams teams={this.state.leaguesData.teams} choiceTitle="Choose Home Team" onChangeTeam={this.onChangeHomeTeam} loading={this.state.loading} />
                <ChoiceTeams teams={this.state.leaguesData.teams} choiceTitle="Choose Away Team" onChangeTeam={this.onChangeAwayTeam} loading={this.state.loading} />
                <ResultsTable results={this.state.calculationResults} league={this.state.leaguesData.league} homeTeam={this.state.homeTeam} awayTeam={this.state.awayTeam} />
                <ResultsGraphs calculationResults={this.state.calculationResults} leaguesData={this.state.leaguesData} homeTeam={this.state.homeTeam} awayTeam={this.state.awayTeam} />

            </div>
        );
    }
}

export default App;