/**
 * Validate game inputs
 * =============================================================================
 */
function gameValidation(guess) {
    var errors = [];

    if (guess === null) {
        errors.push("Guess is empty");
        console.log("Guess is empty");
    }

    if (isNaN(guess)) {
        errors.push("Guess is not a number");
        console.log("Guess is not a number");
    }

    if (guess < 3 || guess > 18) {
        errors.push("Guess out of range");
        console.log("Guess out of range");
    }

    return errors;
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
function validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true;
    }
    return false;
}

/**
 * Log in validation
 */
function logInValidation(logInInputs) {
    var email = logInInputs.email;
    var password = logInInputs.password;
    var errors = [];

    // Email
    if (email === null || email === "") {
        errors.push("The email is empty");
        console.log("The email is empty");
    }

    if (!validateEmail(email)) {
        errors.push("The email is not correct");
        console.log("The email is not correct");
    }

    // Password
    if (password.length === 0) {
        errors.push("The password is empty");
        console.log("The password is empty");
    }

    return errors;
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
function signUpValidation(signUpInputs) {
    var firstName = signUpInputs.firstName;
    var lastName = signUpInputs.lastName;
    var email = signUpInputs.email;
    var username = signUpInputs.username;
    var password = signUpInputs.password;
    var repeatPassword = signUpInputs.repeatPassword;
    var errors = [];

    // First Name
    if (firstName === null || firstName === "") {
        errors.push("The First Name is empty")
        console.log("The First Name is empty");
    }

    if (!checkOnlyLetters(firstName)) {
        errors.push("The First Name can contain only letters")
        console.log("The First Name can contain only letters");
    }

    // Last Name
    if (lastName === null || lastName === "") {
        errors.push("The Last Name is empty")
        console.log("The Last Name is empty");
    }

    if (!checkOnlyLetters(lastName)) {
        errors.push("The Last Name can contain only letters")
        console.log("The Last Name can contain only letters");
    }

    // Email
    if (email === null || email === "") {
        errors.push("The email is empty");
        console.log("The email is empty");
    }

    if (!validateEmail(email)) {
        errors.push("The email is not correct");
        console.log("The email is not correct");
    }

    // Username
    if (username.length < 3) {
        errors.push("The username must be at least 3 characters long");
        console.log("The username must be at least 3 characters long");
    }

    if (/\W/.test(username)) {
        errors.push("The username can contain only letters (a-z, A-Z), digits (0-9) and underscores (_)");
        console.log("The username can contain only letters (a-z, A-Z), digits (0-9) and underscores (_)");
    }

    // Password
    if (password !== repeatPassword) {
        errors.push("The passwords do not match");
        console.log("The passwords do not match");
    }

    if (password.length < 3) {
        errors.push("The password must be at least 3 characters long");
        console.log("The password must be at least 3 characters long");
    }

    return errors;
}
