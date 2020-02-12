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
        getBounsText(bothScore, notBothScore) + "\n" +
        probableScoreText;

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

function getResultsBetText(pByBet, chanceWin, p, teamName = "") {
    var exodusText = teamName != "" ? "Победа" : "Ничья";

    return exodusText + " " + teamName + " " +
        pByBet + CONSTANTS.EMOJI.MULTIPLY + chanceWin + CONSTANTS.EMOJI.MINUS + "100%" + CONSTANTS.EMOJI.SOON +
        p + "% " + (p > 0 ? CONSTANTS.EMOJI.GOOD_BET : CONSTANTS.EMOJI.BAD_BET);
}

function getBounsText(bothScore, notBothScore) {
    return "Бонус" + "\n" +
    "Обе забьют:" + "\n" +
    "Да: " + bothScore + "% " + CONSTANTS.EMOJI.BALL + (bothScore > 60 ? CONSTANTS.EMOJI.GOOD_BET : "") + "\n" +
    "Нет: " + notBothScore + "% " + CONSTANTS.EMOJI.GATE + (notBothScore > 60 ? CONSTANTS.EMOJI.GOOD_BET : "");
}