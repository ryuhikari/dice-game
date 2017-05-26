;var Validation = (function($) {

    // Utility functions
    // -------------------------------------------------------------------------
    function isEmpty(input) {
        if (/.+/.test(input)) {
            return false;
        } else {
            return true;
        }
    }
    function isOnlyLetters(input) {
        if (/^[a-zA-Z]+$/.test(input)) {
            return true;
        } else {
            return false;
        }
    }
    function isOnlyCharacters(input) {
        if (/^\w+$/.test(input)) {
            return true;
        } else {
            return false;
        }
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

        if (isEmpty(firstName)) {
            errors.push(type + " is empty");
        }

        if (isOnlyLetters(firstName)) {
            errors.push(type + "can contain only letters");
        }
    }
    function validateUsername(username) {
        var errors = [];
        username = username.trim();

        if (isEmpty(username)) {
            errors.push("Username is empty");
        }

        if (isOnlyCharacters(username)) {
            errors.push("Username can contain only letters (a-Z), digits (0-9) and underscore (_)");
        }

        return errors;
    };

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

        errors.push(validateEmail(email));
        errors.push(validatePassword(password));

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

        errors.push(validateName(firstName, "First name"));
        errors.push(validateName(lastName, "Last name"));
        errors.push(validateEmail(email));
        errors.push(validateUsername(username));
        errors.push(validatePassword(password));

        if (password === repeatPassword) {
            errors.push("Passowords do not match");
        }

        if (errors.length !== 0) {
            return errors;
        } else {
            return;
        }
    }
})(jQuery);
