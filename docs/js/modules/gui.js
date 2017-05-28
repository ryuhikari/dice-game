;var GUI = (function($) {
    // Log in and Log out elements
    // -------------------------------------------------------------------------
    var showLoggedInElements = $(".show-logged-in");
    var showLoggedOutElements = $(".show-logged-out");

    function showLoggedIn() {
        showLoggedInElements.show();
        showLoggedOutElements.hide();
    }
    function showLoggedOut() {
        showLoggedInElements.hide();
        showLoggedOutElements.show();
    }

    // Navigation
    // -------------------------------------------------------------------------
    var navigation = $("#navigation");
    var navigationSidebar = $("#nav-sidebar");

    function openNav() {
        navigation.hide();
        navigationSidebar.show();
    }
    function closeNav() {
        navigation.show();
        navigationSidebar.hide();
    }

    $("#open-nav-sidebar").on("click", function(event) {
        event.preventDefault();
        openNav();
    });
    $("#close-nav-sidebar").on("click", function(event) {
        event.preventDefault();
        closeNav();
    });
    navigationSidebar.on("click", function(event) {
        closeNav();
    })

    // Open sections
    // -------------------------------------------------------------------------
    var sections = {
        signUp: "#sign-up-section",
        logIn: "#log-in-section",
        instruction: "#instruction-section",
        game: "#game-section",
        profile: "#profile-section"
    };
    function slideSection(section, dir) {
        if (sections[section]) {
            var targetSectionString = $(sections[section]).find(".open-section").attr("data-open");;
        } else {
            var targetSectionString = $(section).attr("data-open");
        }
        var targetSection = $(targetSectionString);
        switch (dir) {
            case "up":
                targetSection.slideUp();
                break;
            case "down":
                targetSection.slideDown();
                break;
            default:
                targetSection.slideToggle();
        }
    }
    function goTo(section) {
        if (sections[section]) {
            $(sections[section])[0].scrollIntoView();
            window.scrollBy(0, 50);
        } else {
            $("#top")[0].scrollIntoView();
        }
    }

    $(".open-section").on("click", function(event) {
        event.preventDefault();
        slideSection($(this));
    });

    // Panels
    // -------------------------------------------------------------------------
    $(".close-panel").on("click", function(event) {
        event.preventDefault();
        var closeElement = $(this).attr("data-close");
        var closeElement = $(closeElement);
        closeElement.hide();
    });

    // Forms
    // -------------------------------------------------------------------------

    // Get form values for sign up and log in
    function getFormValues(formInputs) {
        var formValues = {};
        Object.keys(formInputs).forEach(function(key) {
            formValues[key] = formInputs[key].val();
        });
        return formValues;
    }

    // Sign up
    // -------------------------------------------------------------------------
    var signUpForm = $("#sign-up-form");
    var signUpInputs = {
        firstName: $("#sign-up-first-name"),
        lastName: $("#sign-up-last-name"),
        email: $("#sign-up-email"),
        username: $("#sign-up-username"),
        password: $("#sign-up-password"),
        repeatPassword: $("#sign-up-repeat-password"),
    };

    // Log in
    // -------------------------------------------------------------------------
    var logInForm = $("#log-in-form");
    var logInInputs = {
        email : $("#log-in-email"),
        password : $("#log-in-password"),
    };

    function fillLogInForm(logInValues) {
        logInInputs.email.val(logInValues.email);
        logInInputs.password.val(logInValues.password);
    }

    // Log out
    // -------------------------------------------------------------------------
    var logOutButton = $(".log-out-button");
    logOutButton.on("click", function(event) {
        event.preventDefault();
        PubSub.publish("GUI.logOut");
    });

    // Game
    // -------------------------------------------------------------------------
    var diceGameGUI = {
        gameInfo: $("#game-info"),
        newGameButton: $("#new-game-button"),
        uploadScoreButton: $("#upload-score-button"),
        form: $("#game-form"),
        playRound: $("#play-round-button"),
        gameOverMessage : $("#game-over-message"),
        sumDice : $("#sum-dice"),
        sumValue : $("#sum-value"),
        bonusDice : $("#bonus-dice"),
        bonusValue : $("#bonus-value"),
        round : $("#game-round"),
        score : $("#game-score"),
        guess : $("#game-guess"),
        lastGuess : $("#game-last-guess"),
        roundsTable: $('#game-rounds-table'),
        diceSize : 50,
        diceSrc : [
            "img/dice1.png",
            "img/dice2.png",
            "img/dice3.png",
            "img/dice4.png",
            "img/dice5.png",
            "img/dice6.png",
        ],
    };

    function stopGame(stop) {
        if (typeof stop === "undefined") {
            stop = true;
        }
        diceGameGUI.form.find("input, button").attr("disabled", stop);
    }

    function showGameOver(show) {
        if (typeof show === "undefined") {
            show = true;
        }
        if (show) {
            diceGameGUI.gameOverMessage.show();
        } else {
            diceGameGUI.gameOverMessage.hide();
        }
    }
    showGameOver(false);

    function createDice(number) {
        var img = $("<img>");
        img.attr("src", diceGameGUI.diceSrc[number - 1]);
        img.attr("width", diceGameGUI.diceSize);
        img.attr("height", diceGameGUI.diceSize);
        img.attr("alt", "Dice");
        return img;
    }

    function renderGame(gameRounds) {
        if (typeof gameRounds === "undefined") {
            gameRounds = [
                {
                    dice: [],
                    sum: 0,
                    bonus: 0,
                    round: 0,
                    score: 0,
                    guess: 0,
                }
            ];
        }
        diceGameGUI.sumDice.empty();
        diceGameGUI.bonusDice.empty();
        var guess = gameRounds[0].guess;
        var dice = gameRounds[0].dice;
        var bonus = gameRounds[0].bonus;
        var round = gameRounds[0].round;
        var score = gameRounds[0].score;
        var sum = gameRounds[0].sum;

        for (var i = 0; i < dice.length; i++) {
            diceGameGUI.sumDice.append(createDice(dice[i]));
        }
        if (bonus != 0) {
            diceGameGUI.bonusDice.append(createDice(bonus));
        }
        diceGameGUI.round.html(round);
        diceGameGUI.lastGuess.html(guess);
        diceGameGUI.score.html(score);
        diceGameGUI.sumValue.html(sum);
        diceGameGUI.bonusValue.html(bonus);

        if (round === 0) {
            diceGameGUI.gameInfo.removeClass("correct-guess");
            diceGameGUI.gameInfo.removeClass("wrong-guess");
        }

        if (round > 0) {
            if (guess <= sum) {
                diceGameGUI.gameInfo.addClass("correct-guess");
                diceGameGUI.gameInfo.removeClass("wrong-guess");
            } else {
                diceGameGUI.gameInfo.removeClass("correct-guess");
                diceGameGUI.gameInfo.addClass("wrong-guess");
            }
            diceGameGUI.roundsTable.show();
            w3DisplayData('game-rounds-repeat', {gameRounds: gameRounds});
        } else {
            diceGameGUI.roundsTable.hide();
        }
    }

    // Errors
    // -------------------------------------------------------------------------
    var errorsPanels = {
        signUp: $("#sign-up-errors-panel"),
        logIn: $("#log-in-errors-panel"),
        game: $("#game-errors-panel"),
    };
    var errorsLists = {
        signUp: $("#sign-up-errors-list"),
        logIn: $("#log-in-errors-list"),
        game: $("#game-errors-list"),
    };

    function renderErrors(errors, errorType) {
        if (!errorType) {
            Object.keys(errorsPanels).forEach(function(key) {
                errorsPanels[key].hide();
            });
            return;
        }
        switch (errorType) {
            case "signUp":
                if (errors) {
                    var HTMLid = errorsLists.signUp.attr('id');
                    w3DisplayData(HTMLid, {errors: errors});
                    errorsPanels.signUp.show();
                } else {
                    errorsPanels.signUp.hide();
                }
                break;
            case "logIn":
                if (errors) {
                    var HTMLid = errorsLists.logIn.attr('id');
                    w3DisplayData(HTMLid, {errors: errors});
                    errorsPanels.logIn.show();
                } else {
                    errorsPanels.logIn.hide();
                }
                break;
            case "game":
                if (errors) {
                    var HTMLid = errorsLists.game.attr('id');
                    w3DisplayData(HTMLid, {errors: errors});
                    errorsPanels.game.show();
                } else {
                    errorsPanels.game.hide();
                }
                break;
            default:
                Object.keys(errorsPanels).forEach(function(key) {
                    errorsPanels[key].hide();
                });
        }
    }
    renderErrors();

    // Info messages
    // -------------------------------------------------------------------------
    function showInfo(type, data, isError) {
        var modal = $("#show-info-modal");
        var modalHeader = $("#show-info-modal__header");
        var modalTitle = $("#show-info-modal__title");
        var modalContent = $("#show-info-modal__content");
        var modalFooter = $("#show-info-modal__footer");

        switch (type) {
            case "signUp":
                modalTitle.html("Sign up information");
                break;
            case "logIn":
                modalTitle.html("Log in information");
                break;
            case "logOut":
                modalTitle.html("Sign out information");
                break;
            case "addScore":
                modalTitle.html("Add score information");
                break;
            case "topScores":
                modalTitle.html("Get Top scores information");
                break;
            case "userScores":
                modalTitle.html("Get User's scores information");
                break;
            case "game":
                modalTitle.html("Game information");
                break;
            default:
                modal.hide();
                return;
        }

        if (isError) {
            modalHeader.addClass("info-error");
            modalFooter.addClass("info-error");
        } else {
            modalHeader.removeClass("info-error");
            modalFooter.removeClass("info-error");
        }

        w3DisplayData("show-info-modal__content", {info: [data]});
        modal.show();
    }
    showInfo();

    // Smooth scroll
    // -------------------------------------------------------------------------
    /**
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
    });

    // Scores
    // -------------------------------------------------------------------------
    function prepareScores(scores) {
        scores.sort(function(a, b) {
            if (a.score > b.score) {
                return -1;
            }
            if (a.score < b.score) {
                return 1;
            }
            return 0;
        });
        scores.forEach(function(score, index) {
            var date = moment(score.addedAt * 1000);
            score.addedAt = date.format("YYYY-MM-DD");
            score.position = index + 1;
        });
        return scores;
    }

    // Top scores
    // -------------------------------------------------------------------------
    function renderTopScores(scores) {
        if (typeof scores !== "undefined" && scores.length > 0) {
            scores = prepareScores(scores);
            $("#top-ten-table").show();
            w3DisplayData("top-ten-repeat", {scores: scores});
        } else {
            $("#top-ten-table").hide();
        }
    }
    renderTopScores();

    // User's scores
    // -------------------------------------------------------------------------
    function renderUserScores(scores) {
        if (typeof scores !== "undefined" && scores.length > 0) {
            scores = prepareScores(scores);
            $("#user-scores-table").show();
            w3DisplayData("user-scores-repeat", {scores: scores});
        } else {
            $("#user-scores-table").hide();
        }
    }
    renderUserScores();

    // Profile
    // -------------------------------------------------------------------------
    var profileForm = $("#profile-form");
    var profileInputs = {
        firstName: $("#profile-first-name"),
        lastName: $("#profile-last-name"),
        email: $("#profile-email"),
        username: $("#profile-username"),
        session: $("#profile-session"),
    };

    function renderProfile(user) {
        if (typeof user !== "undefined") {
            Object.keys(profileInputs).forEach(function(key) {
                profileInputs[key].val(user[key]);
            });
        } else {
            profileForm[0].reset();
        }
    }
    renderProfile();

    return {
        showLoggedIn,
        showLoggedOut,

        sections,
        slideSection,
        goTo,

        getFormValues,

        signUpForm,
        signUpInputs,

        logInForm,
        logInInputs,
        fillLogInForm,

        logOutButton,

        diceGameGUI,
        renderGame,
        stopGame,
        showGameOver,

        renderErrors,

        showInfo,

        renderTopScores,
        renderUserScores,

        renderProfile
    };
})(jQuery);
