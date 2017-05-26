;var GUI = (function($) {
    var showLoggedInElements = $(".show-logged-in");
    var showLoggedOutElements = $(".show-logged-out");

    PubSub.subscribe("Main.logIn", function(userInfo) {
        showLoggedIn();
    });
    function showLoggedIn() {
        showLoggedInElements.show();
        showLoggedOutElements.hide();
    }
    function showLoggedOut() {
        showLoggedInElements.hide();
        showLoggedOutElements.show();
    }
    showLoggedOut();

    // Navigation
    var navigation = $("#navigation");
    var navigationSidebar = $("#nav-sidebar");

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

    function openNav() {
        navigation.hide();
        navigationSidebar.show();
    }
    function closeNav() {
        navigation.show();
        navigationSidebar.hide();
    }

    // Open sections
    $(".open-section").on("click", function(event) {
        event.preventDefault();
        var openSection = $(this).attr("data-open");
        var openSection = $(openSection);
        openSection.slideToggle();
    });

    // Panels
    $(".close-panel").on("click", function(event) {
        event.preventDefault();
        var closeElement = $(this).attr("data-close");
        var closeElement = $(closeElement);
        closeElement.hide();
    });

    // Get form values for sign up and log in
    function getFormValues(formInputs) {
        var formValues = {};
        Object.keys(formInputs).forEach(function(key) {
            formValues[key] = formInputs[key].val();
        });
        return formValues;
    }

    // Sign up
    var signUpForm = $("#sign-up-form");
    var signUpInputs = {
        firstName: $("#sign-up-first-name"),
        lastName: $("#sign-up-last-name"),
        email: $("#sign-up-email"),
        username: $("#sign-up-username"),
        password: $("#sign-up-password"),
        repeatPassword: $("#sign-up-repeat-password"),
    };
    var signUpValues = {};

    signUpForm.on("submit", function(event) {
        event.preventDefault();
        signUpValues = getFormValues(signUpInputs);
        PubSub.publish("GUI.signUp.submit", signUpValues);
    });

    PubSub.subscribe("Validation.signUp", function(errors, signUpValues) {
        if (errors) {
            renderErrors(errors, "sign-up");
        } else {
            renderErrors(undefined, "sign-up");
        }
    });

    PubSub.subscribe("Server.signUp", function(errors, signUpValues) {
        if (!errors) {
            signUpForm[0].reset();
            $("#sign-up-content").slideUp();
            fillLogInForm({email: signUpValues.email, password: signUpValues.password})
            $("#up-button").click();
            // location.href = "#top";
            $("#log-in-content").slideDown();
        }
    });

    // Log in
    var logInForm = $("#log-in-form");
    var logInInputs = {
        email : $("#log-in-email"),
        password : $("#log-in-password"),
    };
    var logInValues = {};

    function fillLogInForm(logInValues) {
        logInInputs.email.val(logInValues.email);
        logInInputs.password.val(logInValues.password);
    }

    logInForm.on("submit", function(event) {
        event.preventDefault();
        logInValues = getFormValues(logInInputs);
        PubSub.publish("GUI.logIn.submit", logInValues);
    });

    PubSub.subscribe("Validation.logIn", function(errors, logInValues) {
        if (errors) {
            renderErrors(errors, "log-in");
        } else {
            renderErrors(undefined, "log-in");
        }
    });

    PubSub.subscribe("Server.logIn", function(errors, logInValues) {
        if (!errors) {
            logInForm[0].reset();
            showLoggedIn();
        }
    });

    // Log out
    $(".log-out-button").on("click", function(event) {
        event.preventDefault();
        PubSub.publish("GUI.logOut");
    });

    PubSub.subscribe("Server.logOut", function(errors, response) {
        if (!errors) {
            location.reload();
        }
    });

    // Game
    var gameRounds = [];
    var diceGameGUI = {
        gameInfo: $("#game-info"),
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

    $("#new-game-button").on("click", function(event) {
        event.preventDefault();
        PubSub.publish("GUI.game.new");
    });

    diceGameGUI.form.on("submit", function(event) {
        event.preventDefault();
        var guess = diceGameGUI.guess.val();
        PubSub.publish("GUI.game.submit", guess);
        this.reset();
    });

    PubSub.subscribe("Validation.game", function(errors) {
        if (errors) {
            renderErrors(errors, "game");
        } else {
            renderErrors(undefined, "game");
            var guess = diceGameGUI.guess.val();
            PubSub.publish("GUI.game.playRound", guess);
            diceGameGUI.form[0].reset();
        }
    });

    PubSub.subscribe("Game.modify", function(gameData) {
        if (gameData.round !== 0) {
            gameRounds.unshift(gameData);
        }

        renderGame(gameData);
        if (gameData.finished) {
            stopGame();
            showGameOver();
        } else {
            stopGame(false);
            showGameOver(false);
        }
    });

    function stopGame(stop) {
        if (typeof stop === "undefined") {
            stop = true;
        }
        diceGameGUI.form.find("input, button").attr("disabled", stop);
    }
    stopGame();

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

    function renderGame(gameData) {
        if (typeof gameData === "undefined") {
            gameData = {
                dice: [],
                sum: 0,
                bonus: 0,
                round: 0,
                score: 0,
                guess: 0,
            };
        }
        diceGameGUI.sumDice.empty();
        diceGameGUI.bonusDice.empty();
        var guess = gameData.guess;
        var dice = gameData.dice;
        var bonus = gameData.bonus;
        var round = gameData.round;
        var score = gameData.score;
        var sum = gameData.sum;

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
    renderGame();

    // Errors
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
            case "sign-up":
                if (errors) {
                    var HTMLid = errorsLists.signUp.attr('id');
                    w3DisplayData(HTMLid, {errors: errors});
                    errorsPanels.signUp.show();
                } else {
                    errorsPanels.signUp.hide();
                }
                break;
            case "log-in":
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
    PubSub.subscribe("Server.signUp", function (errors, signUpValues) {
        if (errors) {
            showInfo(errors, 'signUp', undefined);
        } else {
            showInfo(undefined, 'signUp', 'Account created successfully. Now please log in.');
        }
    });
    PubSub.subscribe("Server.logIn", function (errors, userInfo) {
        if (errors) {
            showInfo(errors, 'logIn', undefined);
        } else {
            showInfo(undefined, 'logIn', 'Logged in successfully. Enjoy!.');
        }
    });
    PubSub.subscribe("Server.topScores", function (errors, userInfo) {
        if (errors) {
            showInfo(errors, 'topScores', undefined);
        }
    });
    PubSub.subscribe("Server.userScores", function (errors, userInfo) {
        if (errors) {
            showInfo(errors, 'userScores', undefined);
        }
    });
    function showInfo(errors, type, data) {
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
            case "signOut":
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
            default:
                modal.hide();
                return;
        }

        if (errors) {
            w3DisplayData("show-info-modal__content", {info: errors});

            modalHeader.addClass("info-error");
            modalFooter.addClass("info-error");
        } else {
            w3DisplayData("show-info-modal__content", {info: [data]});

            modalHeader.removeClass("info-error");
            modalFooter.removeClass("info-error");
        }

        modal.show();
    }
    showInfo();

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
    });

    // Scores
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
    PubSub.subscribe("Main.topScores", function(scores) {
        renderTopScores(scores);
    });
    PubSub.subscribe("Server.topScores", function (errors, scores) {
        if (!errors) {
            renderTopScores(scores);
        }
    });
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
    PubSub.subscribe("Main.userScores", function(scores) {
        renderUserScores(scores);
    });
    PubSub.subscribe("Server.userScores", function (errors, scores) {
        if (!errors) {
            renderUserScores(scores);
        }
    });
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
    PubSub.subscribe("Main.logIn", function(userInfo) {
        renderProfile(userInfo);
    });
    PubSub.subscribe("Server.logIn", function (errors, userInfo) {
        if (errors) {
            renderProfile();
        } else {
            renderProfile(userInfo);
        }
    });

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
        showLoggedIn: showLoggedIn,
        showLoggedOut: showLoggedOut,
        renderGame: renderGame,
        renderErrors: renderErrors,
        showInfo: showInfo,
        renderTopScores: renderTopScores,
        renderUserScores: renderUserScores,
        renderProfile: renderProfile,
    };
})(jQuery);
