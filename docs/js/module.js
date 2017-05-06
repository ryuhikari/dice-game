var DiceGame = (function () {

    // Keep this variables private inside this closure scope

    var _numDice = 3;
    var _numRounds = 10;
    var _score = 0;
    var _round = 0;
    var _lastSum = 0;
    var _lastBonus = 0;
    var _lastDice = [];
    var _finished = false;

    function newGame() {
        _score = 0;
        _round = 0;
        _lastSum = 0;
        _lastBonus = 0;
        _lastDice = [];
        _finished = false;
    }

    function setNumDice(numDice) {
        _numDice = numDice;
    }

    function getNumDice() {
        return _numDice;
    }

    function setNumRounds(numRounds) {
        _numRounds = numRounds;
    }

    function getNumRounds() {
        return _numRounds;
    }

    function getScore() {
        return _score;
    }

    function getRound() {
        return _round;
    }

    function getSum() {
        return _lastSum;
    }

    function getBonus() {
        return _lastBonus;
    }

    function getDice() {
        return _lastDice;
    }

    function isFinished() {
        return _finished;
    }


    function gameOver() {
        _finished = true;
        console.log("Game Over");
        console.log("Total score: ", _score);
        return false;
    };

    function play(guess) {
        if (_finished) {
            gameOver();
            return false;
        }

        var guess = guess || _numDice;
        console.log("Round:", _round);
        var sum = 0;
        _lastDice = [];
        for (var i = 0; i < _numDice; i++) {
            var dice = Math.floor((Math.random() * 6) + 1);
            _lastDice.push(dice);
            sum += dice;
        }
        var bonus = Math.floor((Math.random() * 6) + 1);

        _round++;
        _lastSum = sum;
        _lastBonus = bonus;

        if (guess > sum) {
            console.log("Guess failed. You guessed", guess, "and the sum was", sum);
        } else {
            _score += guess * bonus;
            console.log("Good. You guessed", guess, "and the sum was", sum)
        }
        console.log("Bonus", bonus);
        console.log("Score:", _score);

        if (_round == _numRounds) {
            gameOver();
            return false;
        } else {
            return true;
        }
    };

    // Explicitly reveal public pointers to the private functions
    // that we want to reveal publicly

    return {
        newGame: newGame,
        setNumDice: setNumDice,
        getNumDice: getNumDice,
        setNumRounds: setNumRounds,
        getNumRounds: getNumRounds,
        getScore: getScore,
        getRound: getRound,
        getSum: getSum,
        getBonus: getBonus,
        getDice: getDice,
        isFinished: isFinished,
        play: play,
    }
})();
