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
var signUpReference = {
    firstName : $("#sign-up-first-name"),
    lastName : $("#sign-up-last-name"),
    email : $("#sign-up-email"),
    username : $("#sign-up-username"),
    password : $("#sign-up-password"),
    repeatPassword : $("#sign-up-repeat-password"),
};

var signUpButton = $("#sign-up-button").on("click", function(event) {
    event.preventDefault();

    var signUpInputs = {
        firstName : signUpReference.firstName.val(),
        lastName : signUpReference.lastName.val(),
        email : signUpReference.email.val(),
        username : signUpReference.username.val(),
        password : signUpReference.password.val(),
        repeatPassword : signUpReference.repeatPassword.val(),
    };

    var errors = signUpValidation(signUpInputs);

    if (errors.length === 0) {
        signUp(signUpInputs);
    } else {
        renderErrors("sign-up", errors);
    }
});

function clearSignUp() {
    signUpReference.firstName.val("");
    signUpReference.lastName.val("");
    signUpReference.email.val("");
    signUpReference.username.val("");
    signUpReference.password.val("");
    signUpReference.repeatPassword.val("");
}

/**
* Log in
*/
var logInReference = {
    email : $("#log-in-email"),
    password : $("#log-in-password"),
};

var logInButton = $("#log-in-button").on("click", function(event) {
    event.preventDefault();

    var logInInputs = {
        email : logInReference.email.val(),
        password : logInReference.password.val(),
    };

    var errors = logInValidation(logInInputs);
    if (errors.length === 0) {
        logIn(logInInputs);
    } else {
        renderErrors("log-in", errors);
    }
});

function clearLogIn() {
    logInReference.email.val("");
    logInReference.password.val("");
}

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
var closePanel = $(".close-panel").on("click", function(event) {
    event.preventDefault();

    var closeElement = $(this).attr("data-close");
    var closeElement = $(closeElement);
    closeElement.hide();
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
    if (data != null) {
        w3DisplayData("top-ten-table", data);
    } else {
        var dataEmpty = {
            scores : [
                {
                    position: "-",
                    username: "-",
                    score: "-",
                    addedAt: "-",
                },
            ],
        };
        w3DisplayData("top-ten-table", dataEmpty);
    }
}

/**
* Show user's scores
*/
function renderUserScores(data) {
    if (data != null) {
        w3DisplayData("user-scores-table", data);
    } else {
        var dataEmpty = {
            scores : [
                {
                    position: "-",
                    username: "-",
                    score: "-",
                    addedAt: "-",
                },
            ],
        };
        w3DisplayData("user-scores-table", dataEmpty);
    }
}

/**
* Render profile
*/
function renderProfile(user) {
    var firstName = $("#profile-first-name").val(user.info.firstName);
    var lastName = $("#profile-last-name").val(user.info.lastName);
    var email = $("#profile-email").val(user.info.email);
    var username = $("#profile-username").val(user.info.username);
    var session = $("#profile-session").val(user.info.session);
}

/**
* Clear profile
*/
function clearProfile() {
    var firstName = $("#profile-first-name").val("");
    var lastName = $("#profile-last-name").val("");
    var email = $("#profile-email").val("");
    var username = $("#profile-username").val("");
    var session = $("#profile-session").val("");
}
