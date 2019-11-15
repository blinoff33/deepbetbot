/* =============================================================
 Project		:	DeepBetBot
 Author			:	Dmitry Blinov
 Created date	:	19.08.2019
 Description	:	Получение статистики лиги и списка команд
 =============================================================== */
import { CONSTANTS } from './constants';

import axios from 'axios';

export function getPrevResultsData(league, team) {
    var url = getPathToLeaguePage(league) + '/teams/' + team.code + '/result/';

    return getDataByUrl(url);
};

export function getLeaguesData(league) {
    let url = getPathToLeaguePage(league) + '/';

    return getDataByUrl(url);
};

export function getTeamsData(league, team) {
    var url = getPathToLeaguePage(league) + '/teams/' + team.code + '/tstat/';

    return getDataByUrl(url);
};


function getPathToLeaguePage(league) {
    return CONSTANTS.URL_FOR_CORS + CONSTANTS.URL_FOR_DATA_SOURCE + league.type + '/tournament/' + league.code;
}

function getDataByUrl(url) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            headers: {
                'Accept': 'application/json; odata=verbose',
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                console.error("Ошибка загрузки данных", error);
                reject();
            });
    });
}