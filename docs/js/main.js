;(function($) {
    var diceGame;
    PubSub.subscribe("GUI.game.new", function() {
        diceGame = new DiceGame();
        var gameData = diceGame.getData();
        PubSub.publish("Game.modify", gameData);
    });

    PubSub.subscribe("GUI.game.playRound", function(guess) {
        diceGame.play(guess);
        var gameData = diceGame.getData();
        PubSub.publish("Game.modify", gameData);
    })
})(jQuery);
