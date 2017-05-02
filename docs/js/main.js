var diceGame;
var user;

showLoggedOut();
//showLoggedIn();

/**
* Start new game
*/
function newGame() {
    diceGame = new DiceGame();
}

/**
* Play game round
*/
function playRound(guess) {
    var continuePlaying = diceGame.play(guess);
    renderGame(diceGame);
    if (!continuePlaying) {
        showGameOver();
    }
}

/**
* Sign up
*/
function signUp(signUpInputs) {
    var data = user.createAccount(signUpInputs, processSignUp);
}

function processSignUp(data) {
    if (data.status === 200) {
        renderErrors("sign-up", false)
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
        getScores();
        showProfile();
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
        showLoggedOut();
        renderErrors(false);
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
* Show profile
*/
function showProfile() {
    var firstName = $("#profile-first-name").val(user.info.firstName);
    var lastName = $("#profile-last-name").val(user.info.lastName);
    var email = $("#profile-email").val(user.info.email);
    var username = $("#profile-username").val(user.info.username);
    var session = $("#profile-session").val(user.info.session);
}
