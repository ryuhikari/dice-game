/**
 * Error variables
 * =============================================================================
 */
var gameErrors = [];
var logInErrors = [];
var signUpErrors = [];

/**
 * Validate game inputs
 * =============================================================================
 */
function gameValidation(guess) {
    gameErrors = [];

    if (guess === null) {
        gameErrors.push("Guess is empty");
        console.log("Guess is empty");
        return false;
    }

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

/**
 * Validate log in inputs
 * =============================================================================
 */
/**

* Validate email
*
* The following code was adapted from a post:
* Email validation
* at:
* http://www.w3resource.com/javascript/form/email-validation.php
* Accessed: 2017-05-01
*/

/**
 * Check that it is a valid email
 */
function ValidateEmail(mail)
{
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(myForm.emailAddr.value))
    {
        return (true)
    }
    alert("You have entered an invalid email address!")
    return (false)
}

/**
 * Log in validation
 */
function logInValidation(email) {
    logInErrors = [];

    if (email === null || email === "") {
        logInErrors.push("The email is empty");
        console.log("The email is empty");
        return false;
    }

    if (!ValidateEmail(email)) {
        logInErrors.push("The email is not correct");
        console.log("The email is not correct");
        return false;
    }

    return true;
}

/**
 * Validate sign up inputs
 * =============================================================================
 */

 /**
  * Check that string only contains letters
  */
function checkOnlyLetters(phrase) {
    for (var i = 0; i < phrase.length; i++) {
        if (phrase.toUpperCase() === phrase.toLowerCase()) {
            return false;
        }
    }
    return true;
}

/**
 * Sign up validation
 */
function signUpInValidation(firstName, lastName, email, username, password, repeatPassword) {
    signUpErrors = [];

    // First Name
    if (firstName === null || firstName === "") {
        signUpErrors.push("The First Name is empty")
        console.log("The First Name is empty");
        return false;
    }

    if (checkOnlyLetters(firstName)) {
        signUpErrors.push("The First Name can contain only letters")
        console.log("The First Name can contain only letters");
        return false;
    }

    // Last Name
    if (lastName === null || lastName === "") {
        signUpErrors.push("The Last Name is empty")
        console.log("The Last Name is empty");
        return false;
    }

    if (checkOnlyLetters(lastName)) {
        signUpErrors.push("The Last Name can contain only letters")
        console.log("The Last Name can contain only letters");
        return false;
    }

    // Email
    if (email === null || email === "") {
        signUpErrors.push("The email is empty");
        console.log("The email is empty");
        return false;
    }

    if (!ValidateEmail(email)) {
        signUpErrors.push("The email is not correct");
        console.log("The email is not correct");
        return false;
    }

    // Username
    if (username.length < 3) {
        signUpErrors.push("The username must be at least 3 characters long");
        console.log("The username must be at least 3 characters long");
        return false;
    }

    if ( /\W/.test(username) ) {
        signUpErrors.push("The username can contain only letters (a-z, A-Z), digits (0-9) and underscores (_)");
        console.log("The username can contain only letters (a-z, A-Z), digits (0-9) and underscores (_)");
        return false;
    }

    // Password
    if (password !== repeatPassword) {
        signUpErrors.push("The passwords do not match");
        console.log("The passwords do not match");
        return false;
    }

    if (password.length < 3) {
        signUpErrors.push("The password must be at least 3 characters long");
        console.log("The password must be at least 3 characters long");
        return false;
    }

    return true;
}
