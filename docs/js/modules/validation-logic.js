var Validation = (function($) {

    // Utility functions
    // -------------------------------------------------------------------------
    function isEmpty(input) {
        return  !/.+/gi.test(input);
    }
    function isOnlyLetters(input) {
        return /^[a-zA-Z]+$/gi.test(input);
    }
    function isOnlyCharacters(input) {
        return /^\w+$/gi.test(input);
    }

    /**
    * function isValidEmail()
    *
    * The following code was adapted from a post:
    * Email validation
    * at:
    * http://www.w3resource.com/javascript/form/email-validation.php
    * Accessed: 2017-05-01
    */
    function isValidEmail(email) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true;
        }
        return false;
    }

    function validateEmail(email) {
        var errors = [];
        email = email.trim();

        if (isEmpty(email)) {
            errors.push("Email is empty");
        }

        if (!isValidEmail(email)) {
            errors.push("Email is not correct");
        }

        return errors;
    }
    function validatePassword(password) {
        var errors = [];

        if (isEmpty(password)) {
            errors.push("Password is empty");
        }

        if (! /.{3,}/.test(password)) {
            errors.push("Password must be at least 3 characters long");
        }

        return errors;
    }
    function validateName(name, type) {
        var errors = [];
        name = name.trim();

        if (isEmpty(name)) {
            errors.push(type + " is empty");
        }

        if (!isOnlyLetters(name)) {
            errors.push(type + " can contain only letters");
        }

        return errors;
    }
    function validateUsername(username) {
        var errors = [];
        username = username.trim();

        if (isEmpty(username)) {
            errors.push("Username is empty");
        }

        if (!isOnlyCharacters(username)) {
            errors.push("Username can contain only letters (a-Z), digits (0-9) and underscore (_)");
        }

        return errors;
    }

    // Game
    // -------------------------------------------------------------------------
    function validateGame(guess) {
        var errors = [];
        guess = guess.trim();

        if (isEmpty(guess)) {
            errors.push("Guess is empty");
        }

        if (/\D/.test(guess)) {
            errors.push("Guess is not a number");
        }

        if (! /^([3-9]|1[0-8])$/.test(guess)) {
            errors.push("Guess out of range");
        }

        if (errors.length !== 0) {
            return errors;
        } else {
            return;
        }
    }

    // Log in
    // -------------------------------------------------------------------------
    function validateLogIn(logInInputs) {
        var email = logInInputs.email;
        var password = logInInputs.password;
        var errors = [];

        errors = errors.concat(validateEmail(email));
        errors = errors.concat(validatePassword(password));

        if (errors.length !== 0) {
            return errors;
        } else {
            return;
        }
    }

    // Sign up
    // -------------------------------------------------------------------------
    function validateSignUp(signUpInputs) {
        var firstName = signUpInputs.firstName;
        var lastName = signUpInputs.lastName;
        var email = signUpInputs.email;
        var username = signUpInputs.username;
        var password = signUpInputs.password;
        var repeatPassword = signUpInputs.repeatPassword;
        var errors = [];

        errors = errors.concat(validateName(firstName, "First name"));
        errors = errors.concat(validateName(lastName, "Last name"));
        errors = errors.concat(validateEmail(email));
        errors = errors.concat(validateUsername(username));
        errors = errors.concat(validatePassword(password));

        if (password !== repeatPassword) {
            errors.push("Passwords do not match");
        }

        if (errors.length !== 0) {
            return errors;
        } else {
            return;
        }
    }

    return {
        validateLogIn: validateLogIn,
        validateSignUp: validateSignUp,
        validateGame: validateGame
    };
})(jQuery);
