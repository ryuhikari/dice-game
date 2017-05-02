var diceGame;

showLoggedOut();
//showLoggedIn();

function newGame() {
    diceGame = new DiceGame();
}

function playRound(guess) {
    var continuePlaying = diceGame.play(guess);
    renderGame(diceGame);
    if (!continuePlaying) {
        showGameOver();
    }
}
