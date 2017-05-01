/**
* Variables
* =============================================================================
*/

// Navigation bar
var navigation = $("#navigation");
var navigationSidebar = $("#nav-sidebar");

// Open and close navigation sidebar
var openNavButton = $("#open-nav-sidebar").on("click", function(event) {
    event.preventDefault();
    openNav();
});
var closeNavButton = $("#close-nav-sidebar").on("click", function(event) {
    event.preventDefault();
    closeNav();
});

// Open and close sections
var openSectionButtons = $(".open-section");
openSectionButtons.on("click", function(event) {
    event.preventDefault();

    var openSection = "#" + $(this).attr("data-open");
    var openSection = $(openSection);
    openSection.slideToggle();
});

//Show elements depending on the user is logged in or not
var showLoggedInElements = $(".show-logged-in");
var showLoggedOutElements = $(".show-logged-out");

// GUI control
var userLoggedIn = false;
var playing = false;

// Sign up
var signUpInputs = {
    firstName : $("#sign-up-first-name"),
    lastName : $("#sign-up-last-name"),
    email : $("#sign-up-email"),
    username : $("#sign-up-username"),
    password : $("#sign-up-password"),
    repeatPassword : $("#sign-up-repeat-password"),
};
var signUpButton = $("#sign-up-button");
signUpButton.on("click", function(event) {
    event.preventDefault();

    if (signUpValidation(signUpInputs)) {
        renderErrors("sign-up", false)
        // Server function call
        console.log("Sign up user");

        userLoggedIn = true;
    } else {
        renderErrors("sign-up");
    }

});

// Log in
var logInInputs = {
    email : $("#log-in-email"),
    password : $("#log-in-password"),
};
var logInButton = $("#log-in-button");
logInButton.on("click", function(event) {
    event.preventDefault();

    if (logInValidation(logInInputs)) {
        renderErrors("log-in", false)
        // Server function call
        console.log("Log in user");

        userLoggedIn = true;
    } else {
        renderErrors("log-in");
    }
});

// Game
var sumDice = $("#sum-dice");
var bonusDice = $("#bonus-dice");
var diceSize = 50;
var diceSrc = [
    "img/dice1.png",
    "img/dice2.png",
    "img/dice3.png",
    "img/dice4.png",
    "img/dice5.png",
    "img/dice6.png",
];

var gameOverShow = $("#game-over-show");
gameOverShow.hide();
var roundShow = $("#round-show");
roundShow.html(0);
var scoreShow = $("#score-show");
scoreShow.html(0);
var inputGuess = $("#input-guess");

var newGameButton = $("#new-game-button")
newGameButton.on("click", function(event) {
    event.preventDefault();

    diceGame = new DiceGame();
    playing = true;
    updateGUI();
});

var playRoundButton = $("#play-round-button")
playRoundButton.on("click", function(event) {
    event.preventDefault();

    if (gameValidation(Number(inputGuess.val()))) {
        playing = diceGame.play(Number(inputGuess.val()));
    } else {
        renderErrors("game");
    }

    updateGUI();
});

// Errors
var signUpErrorsPanel = $("#sign-up-errors-panel");
signUpErrorsPanel.hide();
var logInErrorsPanel = $("#log-in-errors-panel");
logInErrorsPanel.hide();
var gameErrorsPanel = $("#game-errors-panel");
gameErrorsPanel.hide();

var signUpErrorsList = $("#sign-up-errors-list");
var logInErrorsList = $("#log-in-errors-list");
var gameErrorsList = $("#game-errors-list");

// Close error messages
var closeParents = $(".close-parent");
closeParents.on("click", function(event) {
    event.preventDefault();

    $(this).parent().hide();
});

/**
* Functions
* =============================================================================
*/

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

/**
 * Show elements depending on the user is logged in or not
 */
function showLoggedIn() {
    showLoggedInElements.show();
    showLoggedOutElements.hide();
}

function showLoggedOut() {
    showLoggedInElements.hide();
    showLoggedOutElements.show();
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
$(document).ready(function(){
    // Add smooth scrolling to all links
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
});

/**
* Show dice in game board
*/
function createDice(number) {
    var img = $("<img>");
    img.attr("src", diceSrc[number-1]);
    img.attr("width", diceSize);
    img.attr("height", diceSize);
    img.attr("alt", "Dice");

    return img;
}
function renderGame(diceGame) {
    sumDice.empty();
    bonusDice.empty();

    for (var i = 0; i < diceGame.lastDice.length; i++) {
        sumDice.append(createDice(diceGame.lastDice[i]));
    }
    if (diceGame.lastBonus) {
        bonusDice.append(createDice(diceGame.lastBonus));
    }
    roundShow.html(diceGame.round);
    scoreShow.html(diceGame.score);
}

function renderErrors(errorType, show = true) {
    switch (errorType) {
        case "sign-up":
            if (show) {
                w3DisplayData(signUpErrorsList.attr('id'), errors);
                signUpErrorsPanel.show();
            } else {
                signUpErrorsPanel.hide();
            }
            break;
        case "log-in":
            if (show) {
                w3DisplayData(logInErrorsList.attr('id'), errors);
                logInErrorsPanel.show();
            } else{
                logInErrorsPanel.hide();
            }
            break;
        case "game":
            if (show) {
                w3DisplayData(gameErrorsList.attr('id'), errors);
                gameErrorsPanel.show();
            } else {
                gameErrorsPanel.hide();
            }
            break;
        default:

    }
}

/**
* Update GUI
*/
function updateGUI() {
    if (userLoggedIn) {
        showLoggedIn();
    } else {
        showLoggedOut();
    }

    if (playing) {
        renderGame(diceGame);
        gameOverShow.hide();
        inputGuess.prop("disabled", false);
        playRoundButton.prop("disabled", false);
    } else {
        renderGame(diceGame);
        if (diceGame.finished) {
            gameOverShow.show();
        }
        inputGuess.prop("disabled", true);
        playRoundButton.prop("disabled", true);
    }


}
