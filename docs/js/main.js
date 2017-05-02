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
    if (data.code === 200) {
        renderErrors("sign-up", false)
        showLoggedIn();
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
    if (data.code === 200) {
        renderErrors("log-in", false)
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
    if (data.code === 200) {
        showLoggedOut();
        renderErrors(false);
        showInfo(data);
    } else {
        showInfo(data);
    }
}
