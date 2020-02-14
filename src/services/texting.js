/* =============================================================
 Project		:	DeepBetBot
 Author			:	Dmitry Blinov
 Created date	:	12.02.2020
 Description	:	Генерация текста для копирования
  =============================================================== */
import { getExpectedValue, roundValue } from './calculations';
import { CONSTANTS } from './constants';

export function getTextForCopying(leagueTitle, homeTeamName, awayTeamName, homeTeamXG, awayTeamXG, 
    chanceHomeWin, chanceFrienshipWin, chanceAwayWin, 
    betData, bothScore, notBothScore, probableScoreText) {

    var p1 = roundValue(getExpectedValue(betData.p1ByBet, chanceHomeWin));
    var p0 = roundValue(getExpectedValue(betData.friendshipByBet, chanceFrienshipWin));
    var p2 = roundValue(getExpectedValue(betData.p2ByBet, chanceAwayWin));

    var xGDiff = homeTeamXG - awayTeamXG;

    var text = getTitleText(leagueTitle) + "\n" +
        getTeamsxG90Text(homeTeamName, homeTeamXG, xGDiff) + "\n" +
        getTeamsxG90Text(awayTeamName, awayTeamXG, -xGDiff) + "\n" +
        getResultsBetText(betData.p1ByBet, chanceHomeWin, p1, homeTeamName) + "\n" +
        getResultsBetText(betData.friendshipByBet, chanceFrienshipWin, p0) + "\n" +
        getResultsBetText(betData.p2ByBet, chanceAwayWin, p2, awayTeamName) + "\n" +
        getDescriptionText(homeTeamName, awayTeamName, chanceFrienshipWin, chanceHomeWin, chanceAwayWin, betData)+ "\n" +
        getBounsText(bothScore, notBothScore) + "\n" +
        probableScoreText +
        CONSTANTS.EMOJI.MONEY;

    return text;
}

function getTitleText(leagueTitle) {
    return leagueTitle + CONSTANTS.EMOJI.CUP;
}

function getTeamsxG90Text(teamName, teamxG, xGDiff) {
    return teamName + " xG90 = " + teamxG + 
    (xGDiff > 0.5 ? CONSTANTS.EMOJI.WIN + CONSTANTS.EMOJI.WIN + CONSTANTS.EMOJI.WIN :
    xGDiff > 0 ? CONSTANTS.EMOJI.WIN : xGDiff == 0 ? CONSTANTS.EMOJI.DRAW :
    CONSTANTS.EMOJI.LOOSE);
}

function getDescriptionText(homeTeamName, awayTeamName, chanceFrienshipWin, homeChance, awayChance, betData) {
    return "Детализация:" + CONSTANTS.EMOJI.DETAIL + "\n" +
    "Вероятности: " + CONSTANTS.EMOJI.CALC + "\n" +
    "Победа " + homeTeamName + ": " + homeChance + "%" + "\n" +
    "Ничья" + ": " + chanceFrienshipWin + "%" + "\n" +
    "Победа " + awayTeamName + ": " + awayChance + "%" + "\n" +
    "Коэффиценты букмекеров:" + CONSTANTS.EMOJI.OFFICE + "\n" +
    betData.p1ByBet + CONSTANTS.EMOJI.TO_LEFT_HAND + betData.friendshipByBet +  CONSTANTS.EMOJI.TO_RIGHT_HAND + betData.p2ByBet;
}

function getResultsBetText(pByBet, chanceWin, p, teamName = "") {
    var exodusText = teamName != "" ? "Победа" : "Ничья";

    return exodusText + " " + teamName + " " +
        pByBet + CONSTANTS.EMOJI.MULTIPLY + chanceWin + CONSTANTS.EMOJI.MINUS + "100%" + CONSTANTS.EMOJI.SOON +
        p + "% " + (p > 0 ? CONSTANTS.EMOJI.GOOD_BET : CONSTANTS.EMOJI.BAD_BET);
}

function getBounsText(bothScore, notBothScore) {
    return "Бонус" + CONSTANTS.EMOJI.BONUS + "\n" +
    "Обе забьют:" + (bothScore > notBothScore ? CONSTANTS.EMOJI.BALL : CONSTANTS.EMOJI.GATE) + "\n" +
    "Да: " + bothScore + "% " + (bothScore > 60 ? CONSTANTS.EMOJI.GOOD_BET : "") + "\n" +
    "Нет: " + notBothScore + "% " + (notBothScore > 60 ? CONSTANTS.EMOJI.GOOD_BET : "");
}