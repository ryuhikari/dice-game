var gameErrors = [];
var logInErrors = [];
var signUpErrors = [];

function gameValidation(guess) {
    gameErrors = [];

    if (isNaN(guess)) {
        gameErrors.push("Guess is not a number");
        console.log("Guess is not a number");
        return false;
    }

    if (guess < 3 || guess > 18) {
        gameErrors.push("Guess out of range");
        console.log("Guess out of range");
        return false;
    }

    return true;
}

function logInValidation(email) {
    logInErrors = [];

    if (email == "") {
        logInErrors.push("The email is empty");
        console.log("The email is empty");
    }

    if (email.indexOf(@) == -1) {
        logInErrors.push("There is no email");
        console.log("There is no email");
    }

    return true;
}

function signUpInValidation(firstName, lastName, email, username, password, repeatPassword) {
    signUpErrors = [];

    if (firstName) {

    }

}
