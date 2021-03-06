/**
 * Dice game Object
 * @param  {number} numDice   - number of dice (last dice is the bonus)
 * @param  {number} numRounds - number of rounds
 * @constructor
 */
function DiceGame(numDice, numRounds) {
    // Default values if not provided
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

    // Rest of the values
    this._score = 0;
    this._round = 0;
    this._sum = 0;
    this._bonus = 0;
    this._dice = [];
    this._guess = 0;
    this._finished = false;
};

/**
 * Set current round if you want to continue a game in progress
 * @param  {number} round - current round
 * @return {undefined}
 */
DiceGame.prototype.setRound = function(round) {
    if (round >= this._numRounds) {
        this._round = this._numRounds;
        this._finished = true;
    } else {
        this._round = round;
        this._finished = false;
    }
};

/**
 * Get game data
 * @return {Object} - Game info
 */
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

/**
 * Check whether the game is finished
 * @return {boolean} - true if game is finished
 */
DiceGame.prototype.isFinished = function() {
    return this._finished;
};

/**
 * Play next game round
 * @param  {number} guess - guess made by the player
 * @return {Object}       - game data with current values
 */
DiceGame.prototype.play = function(guess) {
    // Do not play round if game is finished
    if (this.isFinished()) {
        return this.getData();
    }

    // Default values if not provided
    if (typeof guess === "undefined") {
        this._guess = this._numDice;
    } else {
        this._guess = guess;
    }

    // Generate random dice
    this._dice = [];
    this._sum = 0;
    for (var i = 0; i < this._numDice; i++) {
        var dice = Math.floor((Math.random() * 6) + 1);
        this._dice.push(dice);
        this._sum += dice;
    }
    // Generate random bonus
    this._bonus = Math.floor((Math.random() * 6) + 1);
    this._round++;

    // If user guesses correctly score is increased
    if (this._guess <= this._sum) {
        this._score += this._guess * this._bonus;
    }

    // Check if the game is finished
    if (this._round === this._numRounds) {
        this._finished = true;
    }

    return this.getData();
};
