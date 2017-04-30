var DiceGame = function() {
    this.numDice = 3;
    this.numRounds = 10;
    this.score = 0;
    this.round = 0;

    this.play = function(guess) {
        if (this.round >= this.numRounds) {
            this.gameOver();
            return;
        }

        if (isNaN(guess)) {
            console.log("Guess is not a number");
            return;
        }

        if (guess < 3 || guess > 18) {
            console.log("Guess out of range");
            return;
        }

        console.log("Round:", this.round);
        var sum = 0;
        for (var i = 0; i < this.numDice; i++) {
            var dice = Math.floor((Math.random() * 6) + 1);
            sum += dice;
        }
        var bonus = Math.floor((Math.random() * 6) + 1);

        if (guess > sum) {
            console.log("Guess failed. You guessed", guess, "and the sum was", sum);
        } else {
            this.score += guess * bonus;
            this.round++;
            console.log("Good. You guessed", guess, "and the sum was", sum)
        }
        console.log("Bonus", bonus);
        console.log("Score:", this.score);
    }

    this.gameOver = function() {
        console.log("Game Over");
        console.log("Total score: ", this.score);
    }
}
