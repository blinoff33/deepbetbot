/* =============================================================
 Project		:	DeepBetBot
 Author			:	Dmitry Blinov
 Created date	:	19.08.2019
 Description	:	Парсинг статистики лиги и списка команд
 =============================================================== */
import $ from "jquery";

export function parseLeaguesData(response) {
    //команды лиги
    var teams = [];
    //ср. кол. голов в среднем за игру
    var avgScoreGoals = 0;
    //ср. кол. голов хозяева
    var homeAvgScoreGoals = 0;
    //ср. кол. голов гостей
    var awayAvgScoreGoals = 0;

    //объект с данными по лиге
    var leaguesData = {};

    avgScoreGoals = getAvgScoreGoals(response);
    homeAvgScoreGoals = parseByContainsNextText(response, "td", ["Голов", "хозяева"])
    awayAvgScoreGoals = parseByContainsNextText(response, "td", ["Голов", "гости"]);
    teams = getLeaguesTeams(response);

    leaguesData = {
        avgScoreGoals: avgScoreGoals,
        homeAvgScoreGoals: homeAvgScoreGoals,
        awayAvgScoreGoals: awayAvgScoreGoals,
        teams: teams
    }

    return leaguesData;
}

export function parseTeamsData(response, isHometeam) {
    var teamsStats = {};

    var logo = getTeamsLogo(response);
    var ballPos = parseByContainsNextTextNotEnemy(response, "td", ["владения мячом"]);
    var fall = parseByContainsNextNextTextNotEnemy(response, "td", ["Фолы"]);
    var corners = parseByContainsNextNextTextNotEnemy(response, "td", ["Угловые"]);
    var realizations = parseByContainsNextTextNotEnemy(response, "td", ["Реализация ударов"]);
    var accuracy = parseByContainsNextTextNotEnemy(response, "td", ["Точность ударов"]);
    var target = parseByContainsNextNextTextNotEnemy(response, "td", ["Удары в створ"]);
    var shoots = parseByContainsNextNextTextNotEnemy(response, "td", ["Удары по воротам"]);
    var goals = parseByContainsNextNextTextNotEnemy(response, "td", ["Забитые мячи"]);
    var attak = parseByContainsNextNextTextNotEnemy(response, "td", ["Опасные атаки"]);

    var dataParseFunction = isHometeam ? parseByContains4NextText : parseByContains6NextText;

    var avgScoreGoals = dataParseFunction(response, "td", ["Забитые мячи"]);
    var avgMissGoals = dataParseFunction(response, "td", ["Пропущенные мячи"]);
    
    teamsStats = {
        logo: logo,
        ballPos: ballPos,
        fall: fall,
        corners: corners,
        realizations: realizations,
        accuracy: accuracy,
        target: target,
        shoots: shoots,
        goals: goals,
        attak: attak,
        avgScoreGoals: avgScoreGoals,
        avgMissGoals: avgMissGoals
    }

    return teamsStats;
}

export function parsePrevResultsData(response) {
    var results = [];

    //результаты матчей хозяев
        $(response).find('[data-played="1"]').text(function(){
         var teams = $(this).find(".stat-results__title-teams").text().replace(/\n/g, " ").split(' ').join(''); 
         var score = $(this).find(".stat-results__count-main").text().trim(); 
         var date = $(this).find(".stat-results__date-time").text().trim(); 
         
         results.push({
          teams: teams,
          score: score,
          date: date
         })
        });

        return results
}

function getTeamsLogo(response) {
    var logo = "";

    $(response).find(".tournament-header__img").first().text(function () {
        logo = $(this).find('img').attr('src');
    });

    return logo;
}

//парсинг для следующего за элементом elem, содержащего keyWords, элемента, не соперник
function parseByContainsNextTextNotEnemy(response, elem, keyWords) {
    var res = '';
    var selector = elem;

    keyWords.forEach(element => {
        selector += ":contains(" + element + ")"
    });

    $(response).find(selector).not("td:contains(соперник)")
        .next().text(function () {
            res = $(this).text();
        });
    return res;
}

//парсинг для следующего за следующим за элементом elem, содержащего keyWords, элементом, не соперник
function parseByContainsNextNextTextNotEnemy(response, elem, keyWords) {
    var res = '';
    var selector = elem;

    keyWords.forEach(element => {
        selector += ":contains(" + element + ")"
    });

    $(response).find(selector).not("td:contains(соперник)")
    .next().next().text(function () {
            res = $(this).text();
        });
    return res;
}

//парсинг для четырежды следующим за элементом elem, содержащего keyWords, элемента
function parseByContains4NextText(response, elem, keyWords) {
    var res = '';
    var selector = elem;

    keyWords.forEach(element => {
        selector += ":contains(" + element + ")"
    });

    $(response).find(selector)
    .next().next().next().next().text(function () {
            res = $(this).text();
        });
    return res;
}

//парсинг для 6 раз следующим за элементом elem, содержащего keyWords, элемента
function parseByContains6NextText(response, elem, keyWords) {
    var res = '';
    var selector = elem;

    keyWords.forEach(element => {
        selector += ":contains(" + element + ")"
    });

    $(response).find(selector)
    .next().next().next().next().next().next().text(function () {
            res = $(this).text();
        });
    return res;
}

//парсинг для следующего за элементом elem, содержащего keyWords, элемента
function parseByContainsNextText(response, elem, keyWords) {
    var res = '';
    var selector = elem;

    keyWords.forEach(element => {
        selector += ":contains(" + element + ")"
    });

    $(response).find(selector)
        .next().text(function () {
            res = $(this).text();
        });
    return res;
}

//парсинг для получения кол. голов в среднем за игру
function getAvgScoreGoals(response) {
    var avgScoreGoals;

    $(response).find("td:contains(Голов)").not("td:contains(гости)").not("td:contains(хозяева)")
        .next().text(function () {
            avgScoreGoals = $(this).text();
        });

    return avgScoreGoals;
}

//парсинг для получения списка команд лиги
function getLeaguesTeams(response) {
    var teams = [];
    $(response).find(".table-item")
        .text(function () {
            var team = {};

            if ($(this)[0].href) {
                var h = $(this)[0].href;
                var res = h.match(/\/teams\/(\d+)/);
                if (res.length == 2) {
                    team.code = res[1];
                }
                team.title = $(this).text().replace(/\n/g, " ").split(' ').join('');
                team.statUrl = h;
                var idx = teams.map(function (e) { return e.code; }).indexOf(team.code);
                if (idx == -1) teams.push(team);
            }
        });

    return teams;
}