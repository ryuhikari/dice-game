var DiceGame = function (numDice, numRounds) {
    if (typeof numDice === "undefined") {
        this._numDice = 3;
    } else {
        this._numDice = numDice;
    }

    if (typeof numRounds === "undefined") {
        this._numRounds = 10;
    } else {
        this._numRounds = numRounds;
    }
    this._score = 0;
    this._round = 0;
    this._sum = 0;
    this._bonus = 0;
    this._dice = [];
    this._guess = 0;
    this._finished = false;
};

DiceGame.prototype.setRound = function(round) {
    if (round >= this._numRounds) {
        this._round = this._numRounds;
        this._finished = true;
    } else {
        this._round = round;
        this._finished = false;
    }
};

DiceGame.prototype.getData = function() {
    return {
        score: this._score,
        round: this._round,
        sum: this._sum,
        bonus: this._bonus,
        dice: this._dice,
        guess: this._guess,
        finished: this._finished,
    };
};

DiceGame.prototype.isFinished = function() {
    return this._finished;
};

DiceGame.prototype.play = function(guess) {
    if (this.isFinished()) {
        return this.getData();
    }

    if (typeof guess === "undefined") {
        this._guess = this._numDice;
    } else {
        this._guess = guess;
    }

    this._dice = [];
    this._sum = 0;
    for (var i = 0; i < this._numDice; i++) {
        var dice = Math.floor((Math.random() * 6) + 1);
        this._dice.push(dice);
        this._sum += dice;
    }
    this._bonus = Math.floor((Math.random() * 6) + 1);
    this._round++;

    if (this._guess <= this._sum) {
        this._score += this._guess * this._bonus;
    }

    if (this._round === this._numRounds) {
        this._finished = true;
    }
    return this.getData();
};
