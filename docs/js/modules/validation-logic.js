;var Validation = (function($) {

    function isEmpty(input) {
        if (/.+/.test(input)) {
            return false;
        } else {
            return true;
        }
    };

    function isOnlyLetters(input) {
        if (/[a-zA-Z]/.test(input)) {
            return true;
        } else {
            return false;
        }
    };
    // Game

    PubSub.subscribe("GUI.game.submit", function(guess) {
        var errors = gameValidation(guess);
        PubSub.publish("Validation.game", errors, guess);
    });

    function gameValidation(guess) {
        guess = guess.trim();
        var errors = [];

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

    PubSub.subscribe("GUI.logIn.submit", function(logInValues) {
        var errors = logInValidation(logInValues);
        PubSub.publish("Validation.logIn", errors, logInValues);
    });

    /*
    * Validate email
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

    function logInValidation(logInInputs) {
        var email = logInInputs.email;
        var password = logInInputs.password;
        var errors = [];

        // Email
        email = email.trim();

        if (isEmpty(email)) {
            errors.push("The email is empty");
        }

        if (!isValidEmail(email)) {
            errors.push("The email is not correct");
        }

        // Password
        if (isEmpty(password)) {
            errors.push("The password is empty");
        }

        if (! /.{3,}/.test(password)) {
            errors.push("The password must be at least 3 characters long");
        }

        if (errors.length !== 0) {
            return errors;
        } else {
            return;
        }
    }

    // Sign up

    PubSub.subscribe("GUI.signUp.submit", function(signUpValues) {
        var errors = signUpValidation(signUpValues);
        PubSub.publish("Validation.signUp", errors, signUpValues);
    });

    function signUpValidation(signUpInputs) {
        var firstName = signUpInputs.firstName;
        var lastName = signUpInputs.lastName;
        var email = signUpInputs.email;
        var username = signUpInputs.username;
        var password = signUpInputs.password;
        var repeatPassword = signUpInputs.repeatPassword;
        var errors = [];

        // First Name
        firstName = firstName.trim();

        if (isEmpty(firstName)) {
            errors.push("The First Name is empty");
        }

        if (isOnlyLetters(firstName)) {
            errors.push("The First Name can contain only letters");
        }

        // Last Name
        lastName = lastName.trim();
        if (isEmpty(lastName)) {
            errors.push("The Last Name is empty")
        }

        if (isOnlyLetters(lastName)) {
            errors.push("The Last Name can contain only letters")
        }

        // Email
        email = email.trim();

        if (isEmpty(email)) {
            errors.push("The email is empty");
        }

        if (!isValidateEmail(email)) {
            errors.push("The email is not correct");
        }

        // Username
        username = username.trim();

        if (! /.{3,}/.test(username)) {
            errors.push("The username must be at least 3 characters long");
        }

        if (isOnlyLetters(username)) {
            errors.push("The username can contain only letters (a-z, A-Z), digits (0-9) and underscores (_)");
        }

        // Password
        if (isEmpty(password)) {
            errors.push("The password is empty");
        }

        if (isEmpty(repeatPassword)) {
            errors.push("The repeated password is empty");
        }

        if (password !== repeatPassword) {
            errors.push("Passwords do not match");
        }

        if (! /.{3,}/.test(password)) {
            errors.push("The password must be at least 3 characters long");
        }

        if (errors.length !== 0) {
            return errors;
        } else {
            return;
        }
    }
})(jQuery);
