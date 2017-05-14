;(function($) {
    var diceGame;
    $.subscribe("GUI.game.new", function(_) {
        diceGame = new DiceGame();
        $.publish("Game.modify", diceGame.getData());
    });

    $.subscribe("GUI.game.playRound", function(_, guess) {
        diceGame.play(guess);
        $.publish("Game.modify", diceGame.getData());
    })
})(jQuery);
