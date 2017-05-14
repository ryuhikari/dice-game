;(function() {
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

    // Sign up
    var signUpInputs = {
        firstName: $("#sign-up-first-name"),
        lastName: $("#sign-up-last-name"),
        email: $("#sign-up-email"),
        username: $("#sign-up-username"),
        password: $("#sign-up-password"),
        repeatPassword: $("#sign-up-repeat-password"),
    };
    var signUpButton = $("#sign-up-button").attr("disabled", true);
    var signUpForm = $("#sign-up-form");
    signUpForm.on("change", function(event) {
        event.preventDefault();
        var signUpValues = {};
        Object.keys(signUpInputs).forEach(function(key) {
            signUpValues[key] = signUpInputs[key].val();
        });
        $.publish("GUI.signUp.change", signUpValues);
    });
    signUpForm.on("submit",function(event) {
        event.preventDefault();
        $.publish("GUI.signUp.submit", signUpValues);
        this.reset();
    });

    $.subscribe("Validation.signUp", function(_, info) {
        if (info.errors.length !== 0) {
            renderErrors("sign-up", info);
        } else {
            signUpButton.attr("disabled", false);
        }
    });

    // Log in
    var logInInputs = {
        email : $("#log-in-email"),
        password : $("#log-in-password"),
    };
    var logInButton = $("#log-in-button").attr("disabled", true);
    var logInForm = $("#log-in-form");
    logInForm.on("change", function(event) {
        event.preventDefault();
        var logInValues = {};
        Object.keys(logInInputs).forEach(function(key) {
            logInValues[key] = logInInputs[key].val();
        });
    });

    // Log out
    $(".log-out-button").on("click", function(event) {
        event.preventDefault();
        Logic.logOut();
    });

    // Game
    var diceGameGUI = {
        form: $("#game-form"),
        gameOverMessage : $("#game-over-message"),
        sumDice : $("#sum-dice"),
        bonusDice : $("#bonus-dice"),
        round : $("#game-round"),
        score : $("#game-score"),
        guess : $("#game-guess"),
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
        Logic.newGame();
    });

    diceGameGUI.form.on("submit", function(event) {
        event.preventDefault();
        var guess = diceGameGUI.guess.val();
        Logic.playRound(guess);
        this.reset();
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

    function renderGame(DiceGame) {
        if (typeof DiceGame === "undefined") {
            DiceGame = {
                dice: [],
                bonus: 0,
                round: 0,
                score: 0,
            };
        }
        diceGameGUI.sumDice.empty();
        diceGameGUI.bonusDice.empty();
        var dice = DiceGame.dice;
        var bonus = DiceGame.bonus;
        var round = DiceGame.round;
        var score = DiceGame.score;

        for (var i = 0; i < dice.length; i++) {
            diceGameGUI.sumDice.append(createDice(dice[i]));
        }
        if (bonus != 0) {
            diceGameGUI.bonusDice.append(createDice(bonus));
        }
        diceGameGUI.round.html(round);
        diceGameGUI.score.html(score);
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

    function renderErrors(errorType, info) {
        if (typeof info === "undefined") {
            info = {errors: []};
        }
        var errors = info.errors;
        switch (errorType) {
            case "sign-up":
                if (errors) {
                    var HTMLid = errorsLists.signUp.attr('id');
                    w3DisplayData(HTMLid, info);
                    errorsPanels.signUp.show();
                }
                break;
            case "log-in":
                if (errors) {
                    var HTMLid = errorsLists.logIn.attr('id');
                    w3DisplayData(HTMLid, info);
                    errorsPanels.logIn.show();
                }
                break;
            case "game":
                if (errors) {
                    var HTMLid = errorsLists.game.attr('id');
                    w3DisplayData(HTMLid, info);
                    errorsPanels.game.show();
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
    function showInfo(data) {
        var modal = $("#show-info-modal");

        if (typeof data === "undefined") {
            modal.hide();
            return;
        }

        var modalHeader = $("#show-info-modal__header");
        var modalTitle = $("#show-info-modal__title");
        var modalContent = $("#show-info-modal__content");
        var modalFooter = $("#show-info-modal__footer");

        var title = data.from;
        switch (title) {
            case "createAccount":
                modalTitle.html("Create account information");
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
            default:
                modal.hide();
                return;
        }

        if (data.status === 200) {
            modalHeader.addClass("info-correct");
            modalFooter.addClass("info-correct");
        } else {
            modalHeader.addClass("info-error");
            modalFooter.addClass("info-error");
        }
        w3DisplayData("show-info-modal__content", data);

        modal.show();

        setTimeout(function() {
            modal.fadeOut();
        }, 2000);
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

    // Top scores
    function renderTopScores(data) {
        if (typeof data !== "undefined") {
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
    renderTopScores();

    // User's scores
    function renderUserScores(data) {
        if (typeof data !== "undefined") {
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
    renderUserScores();

    // Profile
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
})();
