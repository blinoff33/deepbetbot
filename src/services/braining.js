/* =============================================================
 Project		:	DeepBetBot
 Author			:	Dmitry Blinov
 Created date	:	09.10.2019
 Description	:	Работа нейроной сети brain.js
 =============================================================== */

import {trainingData} from "./training";

//предсказание тотала матча на основании предыдущих тоталов команд
export function getNextTotal(homeTeamTotals, awayTeamTotals) {
  const net = new brain.recurrent.LSTMTimeStep()
  net.train(trainingData);
  const predictionHomeTeamTotal = net.run(homeTeamTotals);
  const predictionAwayTeamTotal = net.run(awayTeamTotals);

  return (predictionHomeTeamTotal + predictionAwayTeamTotal)/2;
}