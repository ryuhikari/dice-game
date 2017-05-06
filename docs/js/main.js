var diceGame;
var user;

showLoggedOut();
//showLoggedIn();

/**
* Start new game
*/
function newGame() {
    DiceGame.newGame();
}

/**
* Play game round
*/
function playRound(guess) {
    var continuePlaying = DiceGame.play(guess);
    renderGame(DiceGame);
    if (!continuePlaying) {
        showGameOver();
        uploadScore();
    }
}

/**
* Sign up
*/
function signUp(signUpInputs) {
    user = new User();
    user.createAccount(signUpInputs, processSignUp);
}

function processSignUp(data) {
    if (data.status === 200) {
        renderErrors("sign-up", false);
        clearSignUpIn();
        showInfo(data);
    } else {
        showInfo(data);
    }
}

/**
* Log in
*/
function logIn(logInInputs) {
    user = new User();
    user.logIn(logInInputs, processLogIn);
}

function processLogIn(data) {
    if (data.status === 200) {
        renderErrors("log-in", false)
        clearSignUp();
        clearLogIn();
        getScores();
        renderProfile(user);
        showLoggedIn();
        showInfo(data);
    } else {
        showInfo(data);
    }
}

/**
* Log out
*/
function logOut() {
    user.signOut(processLogOut);
}

function processLogOut(data) {
    if (data.status === 200) {
        deleteScores();
        resetGameGUI();
        stopGameGUI();
        clearProfile();
        renderErrors(false);
        showLoggedOut();
        showInfo(data);
    } else {
        showInfo(data);
    }
}

/**
* Get date
*/
function getDate(seconds) {
    var milliseconds = seconds * 1000;
    var date = new Date(milliseconds);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var stringDate = year+"-"+month+"-"+day;
    return stringDate;
}

/**
* Get scores: top and user's highscores
*/
function getScores() {
    user.getTopScores("processTopScores");
    user.getUserScores("processUserScores");
}

function processTopScores(response) {
    if (response.status == 200) {
        console.log("Got 10 top scores");
        console.log("Status code:", response.status);
        console.log("Data:", response.data);
        console.log(response.data.scores);

        var scores = [];
        for (var i = 0; i < response.data.scores.length; i++) {
            var info = {
                position: i + 1,
                username: response.data.scores[i].username,
                score: response.data.scores[i].score,
                addedAt: getDate(response.data.scores[i].addedAt),
            };
            scores.push(info);
        }
        console.log(scores);
        renderTopScores({scores: scores});
        return;
    }

    if (response.status == 400) {
        console.log("Something is wrong with the request sent to the server");
        console.log("Status code:", response.status);
        console.log("Data:", response.data);

        showInfo(response);
        return;
    }

    if (response.status == 401) {
        console.log("The session id passed in the request is no longer valid");
        console.log("Status code:", response.status);
        console.log("Data:", response.data);
        return;
    }
}

function processUserScores(response) {
    if (response.status == 200) {
        console.log("Got user's scores");
        console.log("Status code:", response.status);
        console.log("Data:", response.data);
        console.log(response.data.scores);

        var scores = [];
        for (var i = 0; i < response.data.scores.length; i++) {
            var info = {
                position: i + 1,
                username: user.info.username,
                score: response.data.scores[i].score,
                addedAt: getDate(response.data.scores[i].addedAt),
            };
            scores.push(info);
        }
        console.log(scores);
        renderUserScores({scores: scores});
        return;
    }

    if (response.status == 400) {
        console.log("Something is wrong with the request sent to the server");
        console.log("Status code:", response.status);
        console.log("Data:", response.data);
        return;
    }

    if (response.status == 401) {
        console.log("The session id passed in the request is no longer valid");
        console.log("Status code:", response.status);
        console.log("Data:", response.data);
        return;
    }

    if (response.status == 404) {
        console.log("There does not exist a user with the given username");
        console.log("Status code:", response.status);
        console.log("Data:", response.data);
        return;
    }
}

/**
* Delete scores: top and user's highscores
*/
function deleteScores() {
    renderTopScores();
    renderUserScores();
}

/**
* Upload score
*/
function uploadScore() {
    user.addScore(DiceGame.getScore(), processAddScore);
}

function processAddScore(data) {
    if (data.status === 200) {
        showInfo(data);
        getScores();
    } else {
        showInfo(data);
    }
}
