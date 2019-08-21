/* =============================================================
 Project		:	DeepBetBot
 Author			:	Dmitry Blinov, spellabs
 Created date	:	19.08.2019
 Description	:	Получение статитики лиги и списка команд
 =============================================================== */
import { CONSTANTS } from './constants';

import axios from 'axios';


export function getPrevResultsData(league, team) {
    var url = CONSTANTS.URL_FOR_CORS + CONSTANTS.URL_FOR_DATA_SOURCE + league.type + '/tournament/' + league.code + '/teams/' + team.code + '/result/';

    return getDataByUrl(url);
};

export function getLeaguesData(league) {
    let url = CONSTANTS.URL_FOR_CORS + CONSTANTS.URL_FOR_DATA_SOURCE + league.type + '/tournament/' + league.code + '/';

    return getDataByUrl(url);
};

export function getTeamsData(league, team) {
    var url = CONSTANTS.URL_FOR_CORS + CONSTANTS.URL_FOR_DATA_SOURCE + league.type + '/tournament/' + league.code + '/teams/' + team.code + '/tstat/';

    return getDataByUrl(url);
};




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