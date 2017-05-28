;var Main = (function($) {
    var diceGame = {};
    var gameRounds = [];
    var user = {};
    var topScores = [];
    var userScores = [];
    var scoreUploaded = false;

    if (localStorage.user) {
        user = JSON.parse(localStorage.user);
        prepareLoggedIn();
    } else {
        GUI.showLoggedOut();
    }

    // User logged in
    // -------------------------------------------------------------------------
    function prepareLoggedIn() {
        GUI.signUpForm[0].reset();
        GUI.logInForm[0].reset();
        GUI.slideSection("signUp", "up");
        GUI.slideSection("logIn", "down");
        GUI.goTo();
        GUI.showLoggedIn();
        GUI.renderProfile(user);
        prepareScores();
    };

    // Sign Up
    // -------------------------------------------------------------------------
    function processSignUp(errors, status, signUpValues) {
        if (errors) {
            GUI.showInfo("signUp", errors, true);
        } else {
            GUI.showInfo("signUp", ["Correct sign up. Now please log in"], false);
            GUI.signUpForm[0].reset();
            GUI.slideSection("singUp", "up");
            GUI.slideSection("logIn", "down");
            GUI.fillLogInForm(user);
            GUI.goTo("logIn");
        }
    }

    var signUpValues = {};
    GUI.signUpForm.on("submit", function(event) {
        event.preventDefault();
        signUpValues = GUI.getFormValues(GUI.signUpInputs);
        var errors = Validation.validateSignUp(signUpValues);

        if (errors) {
            GUI.renderErrors(errors, "signUp");
        } else {
            GUI.renderErrors(undefined, "signUp");
            Server.signUp(signUpValues, processSignUp);
        }
    });

    // Log in
    // -------------------------------------------------------------------------
    function processLogIn(errors, status, logInValues) {
        if (errors) {
            GUI.showInfo("logIn", errors, true);
        } else {
            GUI.showInfo("logIn", ["Correct log in. Enjoy!"], false);
            user = new Object(logInValues);
            localStorage.user = JSON.stringify(user);
            prepareLoggedIn();
        }
    }

    var logInValues = {};
    GUI.logInForm.on("submit", function(event) {
        event.preventDefault();
        logInValues = GUI.getFormValues(GUI.logInInputs);
        var errors = Validation.validateLogIn(logInValues);

        if (errors) {
            GUI.renderErrors(errors, "logIn");
        } else {
            GUI.renderErrors(undefined, "logIn");
            Server.logIn(logInValues, processLogIn);
        }
    });

    // Log out
    // -------------------------------------------------------------------------
    function processLogOut(errors, status, logInValues) {
        if (errors) {
            GUI.showInfo("logOut", errors, true);
        } else {
            GUI.showInfo("logOut", ["Correct log out. Hope to see you again"], false);
            GUI.renderTopScores();
            GUI.renderUserScores();
            GUI.renderProfile();
            GUI.showLoggedOut();
            localStorage.clear();
            localStorage.gameRounds = JSON.stringify(gameRounds);
            localStorage.scoreUploaded = JSON.stringify(scoreUploaded);
            user = {};
            topScores = [];
            userScores = [];
        }
    }

    GUI.logOutButton.on("click", function(event) {
        event.preventDefault();
        Server.logOut(user, processLogOut);
    });

    // Scores
    // -------------------------------------------------------------------------
    function prepareScores() {
        if (localStorage.topScores) {
            topScores = JSON.parse(localStorage.topScores);
        }
        if (localStorage.userScores) {
            userScores = JSON.parse(localStorage.userScores);
        }
        Server.getTopScores(user, processTopScores);
        Server.getUserScores(user, processUserScores);
    }

    function processTopScores(errors, status, scores) {
        if (errors) {
            if (status === 401) {
                GUI.showInfo("topScores", ['Session has expired. Please log out and log in again.'], true);
            } else {
                GUI.showInfo("topScores", errors, true);
            }
            GUI.renderTopScores(topScores);
        } else {
            localStorage.topScores = JSON.stringify(scores);
            GUI.renderTopScores(scores);
        }
    };

    function processUserScores(errors, status, scores) {
        if (errors) {
            if (status === 401) {
                GUI.showInfo("userScores", ['Session has expired. Please log out and log in again.'], true);
            } else {
                GUI.showInfo("userScores", errors, true);
            }
            GUI.renderUserScores(userScores);
        } else {
            localStorage.userScores = JSON.stringify(scores);
            GUI.renderUserScores(scores);
        }
    };

    // Game
    // -------------------------------------------------------------------------
    if (!localStorage.gameRounds) {
        GUI.stopGame();
        GUI.renderGame();
    } else {
        gameRounds = JSON.parse(localStorage.gameRounds);
        diceGame = new DiceGame();
        diceGame.setRound(gameRounds.length);

        if (localStorage.scoreUploaded) {
            scoreUploaded = JSON.parse(localStorage.scoreUploaded);
        }

        if (diceGame.isFinished()) {
            GUI.stopGame(true);
            GUI.showGameOver(true);
            GUI.renderGame(gameRounds);
        } else {
            GUI.stopGame(false);
            GUI.showGameOver(false);
            GUI.renderGame(gameRounds);
        }
    }

    function processAddUserScore(errors, status, scores) {
        if (errors) {
            GUI.showInfo("game", errors, true);
        } else {
            GUI.showInfo("game", ["Score uploaded correctly"], false);
            scoreUploaded = true;
            localStorage.scoreUploaded = JSON.stringify(scoreUploaded);
            prepareScores();
        }
    };

    function checkUploadScore() {
        if (!user.session) {
            return GUI.showInfo("game", ["Please log in to upload your score"], false);
        }

        if (scoreUploaded) {
            return GUI.showInfo("game", ["Score was already added to your account"], false);
        }

        if ($.isEmptyObject(diceGame) || !diceGame.isFinished()) {
            return GUI.showInfo("game", ["Game is not finished yet"], false);
        }

        Server.addUserScore(gameRounds[0].score, user, processAddUserScore);
    }

    GUI.diceGameGUI.newGameButton.on("click", function(event) {
        event.preventDefault();
        diceGame = new DiceGame();
        gameRounds = [];
        scoreUploaded = false;
        localStorage.removeItem("gameRounds");
        GUI.stopGame(false);
        GUI.renderGame();
    });

    GUI.diceGameGUI.uploadScoreButton.on("click", function(event) {
        event.preventDefault();
        checkUploadScore();
    });

    GUI.diceGameGUI.form.on("submit", function(event) {
        event.preventDefault();
        var guess = GUI.diceGameGUI.guess.val();
        var errors = Validation.validateGame(guess);
        if (errors) {
            GUI.renderErrors(errors, "game");
        } else {
            GUI.renderErrors(undefined, "game");
            GUI.diceGameGUI.form[0].reset();
            diceGame.play(guess)
            var round = diceGame.getData();
            gameRounds.unshift(round);
            localStorage.gameRounds = JSON.stringify(gameRounds);
            GUI.renderGame(gameRounds);

            if (diceGame.isFinished()) {
                GUI.showGameOver();
                GUI.stopGame();
                checkUploadScore();
            }
        }
    });

    return {
        user: user
    };
})(jQuery);
