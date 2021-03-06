/**
 * Main module
 * @namespace
 * @param  {Object} $ - jQuery
 * @return {Object}   - public methods and variables
 */
var Main = (function($) {
    // Variables
    var diceGame = {};
    var gameRounds = [];
    var user = {};
    var topScores = [];
    var userScores = [];
    var scoreUploaded = false;

    // Get user info from localStorage if any
    if (localStorage.user) {
        user = JSON.parse(localStorage.user);
        prepareLoggedIn();
    } else {
        GUI.showLoggedOut();
    }

    /**
     * Use of GUI module to render all logged in elements
     * @memberof Main
     * @private
     */
    function prepareLoggedIn() {
        GUI.signUpForm[0].reset();
        GUI.logInForm[0].reset();
        GUI.slideSection("signUp", "up");
        GUI.slideSection("logIn", "down");
        GUI.goTo();
        GUI.showLoggedIn();
        GUI.renderProfile(user);
        prepareScores();
    }

    // Sign Up
    // -------------------------------------------------------------------------

    /**
     * Use sign up info from the server to update GUI if no errors
     * Callback to use on Server.signUp method
     * @memberof Main
     * @private
     * @param  {string[]}   errors       - possible errors
     * @param  {number}     status       - HTTP status code
     * @param  {Object}     signUpValues - sign up info: {firstName, lastName, email, username, password}
     */
    function processSignUp(errors, status, signUpValues) {
        if (errors) {
            GUI.showInfo("signUp", errors, true);
        } else {
            GUI.showInfo("signUp", ["Correct sign up. Now please log in"], false);
            GUI.signUpForm[0].reset();
            GUI.slideSection("signUp", "up");
            GUI.slideSection("logIn", "down");
            GUI.fillLogInForm(signUpValues);
            GUI.goTo("logIn");
        }
    }

    /**
     * Responde to sign up form submit event
     * @memberof Main
     * @private
     * @param  {Object} event - event object
     */
    GUI.signUpForm.on("submit", function(event) {
        event.preventDefault();
        var signUpValues = GUI.getFormValues(GUI.signUpInputs);
        var errors = Validation.validateSignUp(signUpValues);

        if (errors.length !== 0) {
            GUI.renderErrors(errors, "signUp");
        } else {
            GUI.renderErrors(undefined, "signUp");
            Server.signUp(signUpValues, processSignUp);
        }
    });

    // Log in
    // -------------------------------------------------------------------------

    /**
     * Use log in info from the server to update GUI if no errors
     * Callback to use on Server.logIn method
     * @memberof Main
     * @private
     * @param  {string[]}   errors      - possible errors
     * @param  {number}     status      - HTTP status code
     * @param  {Object}     logInValues - log in info: {email, password}
     */
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

    /**
     * Responde to log in form submit event
     * @memberof Main
     * @private
     * @param  {Object} event - event object
     */
    GUI.logInForm.on("submit", function(event) {
        event.preventDefault();
        var logInValues = GUI.getFormValues(GUI.logInInputs);
        var errors = Validation.validateLogIn(logInValues);

        if (errors.length !== 0) {
            GUI.renderErrors(errors, "logIn");
        } else {
            GUI.renderErrors(undefined, "logIn");
            Server.logIn(logInValues, processLogIn);
        }
    });

    // Log out
    // -------------------------------------------------------------------------

    /**
     * Use log out info from the server to update GUI if no errors
     * Callback to use on Server.logOut method
     * @memberof Main
     * @private
     * @param  {string[]}   errors      - possible errors
     * @param  {number}     status      - HTTP status code
     * @param  {Object}     logInValues - log in info: {email, password}
     */
    function processLogOut(errors, status, logInValues) {
        if (errors) {
            GUI.showInfo("logOut", errors, true);
        } else {
            GUI.showInfo("logOut", ["Correct log out. Hope to see you again"], false);
            // Calling next functions with no argument they render the default values
            GUI.renderTopScores();
            GUI.renderUserScores();
            GUI.renderProfile();
            GUI.showLoggedOut();
            // Clear localStorage except for the game info
            localStorage.clear();
            localStorage.gameRounds = JSON.stringify(gameRounds);
            localStorage.scoreUploaded = JSON.stringify(scoreUploaded);
            user = {};
            topScores = [];
            userScores = [];
        }
    }

    /**
     * Responde to log out button click event
     * @memberof Main
     * @private
     * @param  {Object} event - click event object
     */
    GUI.logOutButton.on("click", function(event) {
        event.preventDefault();
        Server.logOut(user, processLogOut);
    });

    // Scores
    // -------------------------------------------------------------------------

    /**
     * It gets the scores from localStorage and tries to get updates form Server
     * This lets render scores and play offline
     * @memberof Main
     * @private
     */
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

    /**
     * Use top scores info from the server to update GUI if no errors
     * Callback to use on Server.getTopScores method
     * @memberof Main
     * @private
     * @param  {string[]}   errors - possible errors
     * @param  {number}     status - HTTP status code
     * @param  {Object[]}   scores - top scores info: [{firstName, lastName, username, score, addedAt}, ...]
     */
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
    }

    /**
     * Use user scores info from the server to update GUI if no errors
     * Callback to use on Server.getUserScores method
     * @memberof Main
     * @private
     * @param  {string[]}   errors - possible errors
     * @param  {number}     status - HTTP status code
     * @param  {Object[]}   scores - user scores info: [{score, addedAt}, ...]
     */
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
    }

    // Game
    // -------------------------------------------------------------------------

    /**
     * Tries to render game from localStorage and continue playing from last round
     * @param  {Object} localStorage - web browser local storage
     */
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

    /**
     * Use scores info to show a message that score has been uploaded if no errors
     * Callback to use on Server.addUserScore method
     * @memberof Main
     * @private
     * @param  {string[]}   errors - possible errors
     * @param  {number}     status - HTTP status code
     * @param  {Object[]}   scores - user scores info: {[score, addedAt], ...}
     */
    function processAddUserScore(errors, status, scores) {
        if (errors) {
            GUI.showInfo("game", errors, true);
        } else {
            GUI.showInfo("game", ["Score uploaded correctly"], false);
            scoreUploaded = true;
            localStorage.scoreUploaded = JSON.stringify(scoreUploaded);
            // Fetch scores from Server to update tables
            prepareScores();
        }
    }

    /**
     * It makes sure that the current score can be uploaded to Server.
     * It checks whether score has already been uploaded or not.
     * It checks whether there is a score or not.
     * It checks whether the user is logged in or not.
     * It checks whether the game is finished or not.
     * @memberof Main
     * @private
     */
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

        // If all tests are correct score is uploaded
        Server.addUserScore(gameRounds[0].score, user, processAddUserScore);
    }

    /**
     * Responde to new game button click event
     * @memberof Main
     * @private
     * @param  {Object} event - click event object
     */
    GUI.diceGameGUI.newGameButton.on("click", function(event) {
        event.preventDefault();

        diceGame = new DiceGame(); // Init new game
        gameRounds = [];           // Init new rounds array to hold the info of each round
        localStorage.removeItem("gameRounds");
        scoreUploaded = false;
        localStorage.scoreUploaded = JSON.stringify(scoreUploaded);
        GUI.showGameOver(false);
        GUI.stopGame(false);
        GUI.renderGame();
    });

    /**
     * Responde to upload score button click event
     * @memberof Main
     * @private
     * @param  {Object} event - click event object
     */
    GUI.diceGameGUI.uploadScoreButton.on("click", function(event) {
        event.preventDefault();
        // Check that score can be uploaded before doing it
        checkUploadScore();
    });

    /**
     * Responde to play round form submit event
     * @memberof Main
     * @private
     * @param  {Object} event - submit event object
     */
    GUI.diceGameGUI.form.on("submit", function(event) {
        event.preventDefault();
        // Get the guess and check for errors
        var guess = GUI.diceGameGUI.guess.val();
        var errors = Validation.validateGame(guess);

        if (errors.length !== 0) {
            GUI.renderErrors(errors, "game");
        } else {
            GUI.renderErrors(undefined, "game");
            GUI.diceGameGUI.form[0].reset();

            // Play new round
            diceGame.play(guess);
            // Get game data after playing the round
            var round = diceGame.getData();
            gameRounds.unshift(round);
            localStorage.gameRounds = JSON.stringify(gameRounds);
            GUI.renderGame(gameRounds);

            if (diceGame.isFinished()) {
                GUI.showGameOver();
                GUI.stopGame();
                // Once the game finishes score is uploaded to Server if it is possible
                checkUploadScore();
            }
        }
    });
})(jQuery);
