;var Main = (function($) {
    var diceGame;
    var user;

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
        }
    });

    PubSub.subscribe("Server.userScores", function (errors, scores) {
        if (!errors) {
            user.scores = scores;
        }
    });
    PubSub.subscribe("Server.topScores", function (errors, scores) {
        if (!errors) {
            user.topScores = scores;
        }
    });
})(jQuery);
