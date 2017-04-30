var DiceGame = function() {
    this.numDice = 3;
    this.numRounds = 10;
    this.score = 0;
    this.round = 0;
    this.lastSum = 0;
    this.lastBonus = 0;
    this.lastDice = [];
    this.finished = false;

    this.gameOver = function() {
        this.finished = true;
        console.log("Game Over");
        console.log("Total score: ", this.score);
        return false;
    };

    this.play = function(guess) {
        if (isNaN(guess)) {
            console.log("Guess is not a number");
            return true;
        }

        if (guess < 3 || guess > 18) {
            console.log("Guess out of range");
            return true;
        }

        console.log("Round:", this.round);
        var sum = 0;
        this.lastDice = [];
        for (var i = 0; i < this.numDice; i++) {
            var dice = Math.floor((Math.random() * 6) + 1);
            this.lastDice.push(dice);
            sum += dice;
        }
        var bonus = Math.floor((Math.random() * 6) + 1);

        if (guess > sum) {
            console.log("Guess failed. You guessed", guess, "and the sum was", sum);
        } else {
            this.score += guess * bonus;
            this.round++;
            this.lastSum = sum;
            this.lastBonus = bonus;
            console.log("Good. You guessed", guess, "and the sum was", sum)
        }
        console.log("Bonus", bonus);
        console.log("Score:", this.score);

        if (this.round == this.numRounds) {
            this.gameOver();
            return false;
        } else {
            return true;
        }
    };
}

var diceGame = new DiceGame();
