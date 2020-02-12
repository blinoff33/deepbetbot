/* =============================================================
 Project		:	DeepBetBot
 Author			:	Dmitry Blinov
 Created date	:	19.08.2019
 Description	:	Вычисления
 =============================================================== */
import { getTeamsData, getPrevResultsData } from './factory';
import { parseTeamsData, parsePrevResultsData } from './parsing';
import { CONSTANTS } from '../services/constants';

export async function startCalculations(leaguesData, homeTeam, awayTeam, setLoading) {
    if (checkIfObjectIsEmpty(homeTeam) || checkIfObjectIsEmpty(awayTeam)) return;
    setLoading(true);

    //сырые данные по двум командам
    const homeTeamData = await getTeamsData(leaguesData.league, homeTeam);
    const awayTeamData = await getTeamsData(leaguesData.league, awayTeam);

    //сырые результаты команды
    const homePrevResultData = await getPrevResultsData(leaguesData.league, homeTeam);
    const awayPrevResultData = await getPrevResultsData(leaguesData.league, awayTeam);

    //распарсенные данные по двум командам
    var homeStats = parseTeamsData(homeTeamData.data, true);
    var awayStats = parseTeamsData(awayTeamData.data, false);

    //распарсенные данные результатов команд
    var homeTeamResults = parsePrevResultsData(homePrevResultData.data);
    var awayTeamResults = parsePrevResultsData(awayPrevResultData.data);

    //ожидаемое кол-во забитых мячей
    var homeTeamXG = (parseFloat(homeStats.avgScoreGoals) + parseFloat(awayStats.avgMissGoals) + parseFloat(leaguesData.homeAvgScoreGoals)) / 3;
    var awayTeamXG = (parseFloat(awayStats.avgScoreGoals) + parseFloat(homeStats.avgMissGoals) + parseFloat(leaguesData.awayAvgScoreGoals)) / 3;

    //распределение Пуассона вероятностей забитых мячей
    var teamsScorePoissonDistribution = getTeamsScorePoissonDistribution(homeTeamXG, awayTeamXG);

    //финальные вычисления
    var result = getFinalResult(teamsScorePoissonDistribution.homeChanceMatrix, teamsScorePoissonDistribution.awayChanceMatrix, homeTeamXG, awayTeamXG, homeStats, awayStats, homeTeamResults, awayTeamResults);

    setLoading(false);

    return result;
}

//получение мат ожидания
export function getExpectedValue(pByBet, chance) {
    return pByBet * chance - 100;
}

//округление
export function roundValue(value) {
    return Math.round(value * 100) / 100
}

//расчет основных результатов
function getFinalResult(homeChanceMatrix, awayChanceMatrix, homeTeamXG, awayTeamXG, homeStats, awayStats, homeTeamResults, awayTeamResults) {
    var totalChanceMatrix = [];
    var chanceHomeWin = 0;
    var chanceAwayWin = 0;
    var chanceFrienshipWin = 0;
    var matrixForDrawingScore = [];
    var evenChance = 0;
    var homeTotalB05 = 0;
    var homeTotalB15 = 0;
    var homeTotalB25 = 0;
    var homeTotalB35 = 0;
    var awayTotalB05 = 0;
    var awayTotalB15 = 0;
    var awayTotalB25 = 0;
    var awayTotalB35 = 0;
    var total05B = 0;
    var total15B = 0;
    var total25B = 0;
    var total35B = 0;
    var bothScore = 0;

    for (var j = 0; j < homeChanceMatrix.length; j++) {
        for (var k = 0; k < awayChanceMatrix.length; k++) {
            var chance = Math.round(homeChanceMatrix[j].chance * awayChanceMatrix[k].chance / 100 * 1000) / 1000;
            totalChanceMatrix.push(
                {
                    goalsHome: homeChanceMatrix[j].goals,
                    goalsaway: awayChanceMatrix[k].goals,
                    chance: chance
                }
            );
            //ЧЕТ
            if ((homeChanceMatrix[j].goals + awayChanceMatrix[k].goals) % 2 == 0) evenChance += chance; 

            //МАТРИЦА ДЛЯ ГРАФИКА
            matrixForDrawingScore.push([homeChanceMatrix[j].goals, awayChanceMatrix[k].goals, chance]);

            //ВЕРОЯТНОСТЬ П1
            if (homeChanceMatrix[j].goals > awayChanceMatrix[k].goals) chanceHomeWin += chance;
            //ВЕРОЯТНОСТЬ П2
            if (homeChanceMatrix[j].goals < awayChanceMatrix[k].goals) chanceAwayWin += chance;
            //ВЕРОЯТНОСТЬ НИЧЬИ
            if (homeChanceMatrix[j].goals == awayChanceMatrix[k].goals) chanceFrienshipWin += chance;

            //ТОТАЛ ХОЗЯЕВ
            if (homeChanceMatrix[j].goals > 0.5) homeTotalB05 += chance; 
            if (homeChanceMatrix[j].goals > 1.5) homeTotalB15 += chance;
            if (homeChanceMatrix[j].goals > 2.5) homeTotalB25 += chance;
            if (homeChanceMatrix[j].goals > 3.5) homeTotalB35 += chance;

            //ТОТАЛ ГОСТЕЙ
            if (awayChanceMatrix[k].goals > 0.5) awayTotalB05 += chance; 
            if (awayChanceMatrix[k].goals > 1.5) awayTotalB15 += chance;
            if (awayChanceMatrix[k].goals > 2.5) awayTotalB25 += chance;
            if (awayChanceMatrix[k].goals > 3.5) awayTotalB35 += chance;

            //ТОТАЛ
            if ((homeChanceMatrix[j].goals + awayChanceMatrix[k].goals) > 0.5) total05B += chance; 
            if ((homeChanceMatrix[j].goals + awayChanceMatrix[k].goals) > 1.5) total15B += chance;
            if ((homeChanceMatrix[j].goals + awayChanceMatrix[k].goals) > 2.5) total25B += chance;
            if ((homeChanceMatrix[j].goals + awayChanceMatrix[k].goals) > 3.5) total35B += chance;

            //ОБЕ ЗАБЬЮТ
            if (homeChanceMatrix[j].goals > 0.5 && awayChanceMatrix[k].goals > 0.5) bothScore += chance; 
        }
    }

    var result = {
        homeChanceMatrix: homeChanceMatrix,
        awayChanceMatrix: awayChanceMatrix,
        totalChanceMatrix: totalChanceMatrix,
        chanceHomeWin: chanceHomeWin,
        chanceAwayWin: chanceAwayWin,
        chanceFrienshipWin: chanceFrienshipWin,
        homeTotal05B: homeTotalB05,
        homeTotal15B: homeTotalB15,
        homeTotal25B: homeTotalB25,
        homeTotal35B: homeTotalB35,
        awayTotal05B: awayTotalB05,
        awayTotal15B: awayTotalB15,
        awayTotal25B: awayTotalB25,
        awayTotal35B: awayTotalB35,
        total05B: total05B,
        total15B: total15B,
        total25B: total25B,
        total35B: total35B,
        bothScore: bothScore,
        evenChance: evenChance,
        homeTeamXG: homeTeamXG,
        awayTeamXG: awayTeamXG,
        home1XChance: getXChance(chanceHomeWin, chanceFrienshipWin, chanceAwayWin),
        away1XChance: getXChance(chanceAwayWin, chanceFrienshipWin, chanceHomeWin),
        homeStats: homeStats, 
        awayStats: awayStats,
        homeTeamResults: homeTeamResults,
        awayTeamResults: awayTeamResults,
        matrixForDrawingScore: matrixForDrawingScore
    };

    return result;
}

function getXChance(chanceFirstTeamWin, chanceFrienshipWin, chanceSecondTeamWin) {
      var numerator = (chanceFirstTeamWin + chanceFrienshipWin) * 100;
      var denominator = chanceSecondTeamWin + 2 * chanceFrienshipWin + chanceFirstTeamWin;

      return denominator ? roundResultsValue(numerator / denominator) : 0;
  }

  function roundResultsValue(value) {
    return Math.round(value * 100) / 100
  }

//получение распределения Пуассона ожидаемого кол-ва забитых мячей 
function getTeamsScorePoissonDistribution(homeTeamXG, awayTeamXG) {
    var homeChanceMatrix = [];
    var awayChanceMatrix = [];

    for (var i = 0; i <= CONSTANTS.MAX_GOALS_COUNT; i++) {
        homeChanceMatrix.push({
            goals: i,
            chance: getEventsProbability(i, homeTeamXG)
        });
        awayChanceMatrix.push({
            goals: i,
            chance: getEventsProbability(i, awayTeamXG)
        });
    }

    var res = {
        homeChanceMatrix: homeChanceMatrix,
        awayChanceMatrix: awayChanceMatrix
    }

    return res;
}

//проверка пустой ли объект
function checkIfObjectIsEmpty(obj) {
    return (JSON.stringify(obj) === JSON.stringify({}));
}

//получение вероятности по формуле функции вероятности распределения Пуассона
function getEventsProbability(k, comScore) {
    var chance = Math.pow(comScore, k) * Math.pow(Math.E, -comScore) / factorial(k) * 100;
    return (Math.round(chance * 100) / 100);
}

//факториал числа n
function factorial(n) {
    if (n < 0) return 0;
    return n ? n * factorial(n - 1) : 1;
}