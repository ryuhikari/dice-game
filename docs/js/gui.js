/**
* Navigation
*/
var navigation = $("#navigation");
var navigationSidebar = $("#nav-sidebar");

/**
* Open and close navigation sidebar
*/
function openNav() {
    navigation.hide();
    navigationSidebar.css({"width": "100%", "display": "block"});
}

function closeNav() {
    navigation.show();
    navigationSidebar.hide();
}

var openNavButton = $("#open-nav-sidebar").on("click", function(event) {
    event.preventDefault();
    openNav();
});
var closeNavButton = $("#close-nav-sidebar").on("click", function(event) {
    event.preventDefault();
    closeNav();
});

/**
* Open and close sections
*/
var openSectionButtons = $(".open-section").on("click", function(event) {
    event.preventDefault();

    var openSection = $(this).attr("data-open");
    var openSection = $(openSection);
    openSection.slideToggle();
});

/**
 * Show elements depending on the user is logged in or not
 */
var showLoggedInElements = $(".show-logged-in");
var showLoggedOutElements = $(".show-logged-out");

function showLoggedIn() {
    resetGameGUI();
    stopGameGUI();
    showLoggedInElements.show();
    showLoggedOutElements.hide();
}

function showLoggedOut() {
    resetGameGUI();
    stopGameGUI();
    showLoggedInElements.hide();
    showLoggedOutElements.show();
}

/**
* Sign up
*/
var signUpButton = $("#sign-up-button").on("click", function(event) {
    event.preventDefault();

    var signUpInputs = {
        firstName : $("#sign-up-first-name").val(),
        lastName : $("#sign-up-last-name").val(),
        email : $("#sign-up-email").val(),
        username : $("#sign-up-username").val(),
        password : $("#sign-up-password").val(),
        repeatPassword : $("#sign-up-repeat-password").val(),
    };

    var errors = signUpValidation(signUpInputs);

    if (errors.lenght === 0) {
        signUp(signUpInputs);
    } else {
        renderErrors("sign-up", errors);
    }
});

/**
* Log in
*/
var logInButton = $("#log-in-button").on("click", function(event) {
    event.preventDefault();

    var logInInputs = {
        email : $("#log-in-email").val(),
        password : $("#log-in-password").val(),
    };

    var errors = logInValidation(logInInputs);
    if (errors.length === 0) {
        logIn(logInInputs);
    } else {
        renderErrors("log-in", errors);
    }
});

/**
* Log out
*/
var logOutButton = $(".log-out-button").on("click", function(event) {
    event.preventDefault();
    logOut();
});

/**
* Dice game
*/
var diceGameGUI = {
    sumDice : $("#sum-dice"),
    bonusDice : $("#bonus-dice"),
    gameOverMessage : $("#game-over-message"),
    round : $("#game-round"),
    score : $("#game-score"),
    guess : $("#game-guess"),

    newGameButton : $("#new-game-button"),
    playRoundButton : $("#play-round-button"),

    diceSize : 50,
    diceSrc : [
        "img/dice1.png",
        "img/dice2.png",
        "img/dice3.png",
        "img/dice4.png",
        "img/dice5.png",
        "img/dice6.png",
    ],
}

function resetGameGUI() {
    diceGameGUI.score.html(0);
    diceGameGUI.round.html(0);
    diceGameGUI.guess.val("");
    diceGameGUI.guess.attr("disabled", false);
    diceGameGUI.sumDice.empty();
    diceGameGUI.bonusDice.empty();
    diceGameGUI.gameOverMessage.hide();
    diceGameGUI.playRoundButton.attr("disabled", false);
}

diceGameGUI.newGameButton.on("click", function(event) {
    event.preventDefault();

    resetGameGUI();
    newGame();
});

diceGameGUI.playRoundButton.on("click", function(event) {
    event.preventDefault();

    var guess = Number(diceGameGUI.guess.val());

    var errors = gameValidation(guess);
    if (errors.length === 0) {
        renderErrors("game", false);
        playRound(guess);
    } else {
        renderErrors("game", errors);
    }
});

function stopGameGUI() {
    diceGameGUI.guess.attr("disabled", true);
    diceGameGUI.playRoundButton.attr("disabled", true);
}

function showGameOver() {
    diceGameGUI.gameOverMessage.show();
    stopGameGUI();
}

function createDice(number) {
    var img = $("<img>");
    img.attr("src", diceGameGUI.diceSrc[number-1]);
    img.attr("width", diceGameGUI.diceSize);
    img.attr("height", diceGameGUI.diceSize);
    img.attr("alt", "Dice");

    return img;
}

function renderGame(diceGame) {
    diceGameGUI.sumDice.empty();
    diceGameGUI.bonusDice.empty();

    for (var i = 0; i < diceGame.lastDice.length; i++) {
        diceGameGUI.sumDice.append(createDice(diceGame.lastDice[i]));
    }
    if (diceGame.lastBonus) {
        diceGameGUI.bonusDice.append(createDice(diceGame.lastBonus));
    }
    diceGameGUI.round.html(diceGame.round);
    diceGameGUI.score.html(diceGame.score);
}

/**
* Errors
*/
var errorsGUI = {
    signUpErrorsPanel : $("#sign-up-errors-panel"),
    logInErrorsPanel : $("#log-in-errors-panel"),
    gameErrorsPanel : $("#game-errors-panel"),

    signUpErrorsList : $("#sign-up-errors-list"),
    logInErrorsList : $("#log-in-errors-list"),
    gameErrorsList : $("#game-errors-list"),
}

function renderErrors(errorType, errors = true) {
    switch (errorType) {
        case "sign-up":
            if (errors) {
                var HTMLid = errorsGUI.signUpErrorsList.attr('id');
                w3DisplayData(HTMLid, {"errors" : errors});
                errorsGUI.signUpErrorsPanel.show();
            } else {
                errorsGUI.signUpErrorsPanel.hide();
            }
            break;
        case "log-in":
            if (errors) {
                var HTMLid = errorsGUI.logInErrorsList.attr('id');
                w3DisplayData(HTMLid, {"errors" : errors});
                errorsGUI.logInErrorsPanel.show();
            } else{
                errorsGUI.logInErrorsPanel.hide();
            }
            break;
        case "game":
            if (errors) {
                var HTMLid = errorsGUI.gameErrorsList.attr('id');
                w3DisplayData(HTMLid, {"errors" : errors});
                errorsGUI.gameErrorsPanel.show();
            } else {
                errorsGUI.gameErrorsPanel.hide();
            }
            break;
        default:
            console.log("Hide all errors" );
            errorsGUI.signUpErrorsPanel.hide();
            errorsGUI.logInErrorsPanel.hide();
            errorsGUI.gameErrorsPanel.hide();
    }
}

/**
* Close panels
*/
var closeParents = $(".close-parent").on("click", function(event) {
    event.preventDefault();

    $(this).parent().hide();
});

/**
* Show info messages
*/
function showInfo(data) {
    // TODO: complete showInfo
    console.log("showInfo");
    console.log(data.info);
}

/**
* Smooth scroll
*
* The following code was adapted from a post:
* Add smooth scrolling to page anchors
* at:
* https://www.w3schools.com/jquery/tryit.asp?filename=tryjquery_eff_animate_smoothscroll
* Accessed: 2017-04-30
*/
$(".smooth").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
        // Prevent default anchor click behavior
        event.preventDefault();

        // Store hash
        var hash = this.hash;

        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
        $('html, body').animate({
            scrollTop: $(hash).offset().top - 50
        }, 800, function(){

            // Add hash (#) to URL when done scrolling (default click behavior)
            window.location.hash = hash;
        });
    } // End if
    closeNav();
});

/**
* Show top highscores
*/
function renderTopScores(data) {
    w3DisplayData("top-ten-table", data);
}

/**
* Show user's scores
*/
function renderUserScores(data) {
    w3DisplayData("user-scores-table", data);
}
