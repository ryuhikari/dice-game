;(function($) {
    var diceGame;
    var user;

    if (localStorage.user) {
        user = JSON.parse(localStorage.user);
        PubSub.publish("Main.logIn", user);
        PubSub.publish("Main.userScores", user.scores);
        PubSub.publish("Main.topScores", user.topScores);
    }

    PubSub.subscribe("GUI.game.new", function() {
        diceGame = new DiceGame();
        var gameData = diceGame.getData();
        PubSub.publish("Game.modify", gameData);
    });

    PubSub.subscribe("GUI.game.playRound", function(guess) {
        diceGame.play(guess);
        var gameData = diceGame.getData();
        PubSub.publish("Game.modify", gameData);
        if (gameData.finished && user) {
            console.log(gameData.score, user);
            PubSub.publish("Main.addUserScore", gameData.score, user);
        }
    })

    PubSub.subscribe("Server.addUserScore", function (errors, scores) {
        if (!errors && user) {
            PubSub.publish("Main.getTopScores", user);
            PubSub.publish("Main.getUserScores", user);
        }
    });

    PubSub.subscribe("Server.logIn", function (errors, userInfo) {
        if (errors) {
            user = {};
        } else {
            user = userInfo;
            localStorage.user = JSON.stringify(user);
            PubSub.publish("Main.getTopScores", user);
            PubSub.publish("Main.getUserScores", user);
        }
    });

    PubSub.subscribe("GUI.logOut", function () {
        PubSub.publish("Main.logOut", user);
    });

    PubSub.subscribe("Server.logOut", function (errors, userInfo) {
        if (!errors) {
            user = {};
            localStorage.clear();
        }
    });

    PubSub.subscribe("Server.userScores", function (errors, scores) {
        if (!errors) {
            user.scores = scores;
            localStorage.user = JSON.stringify(user);
        }
    });
    PubSub.subscribe("Server.topScores", function (errors, scores) {
        if (!errors) {
            user.topScores = scores;
            localStorage.user = JSON.stringify(user);
        }
    });
})(jQuery);
