var UserInfo = function() {
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.username = "";
    this.password = "";
    this.session = "";
    this.scores = [];
}

var Session = function() {
    this.serverURL = "http://193.10.30.163/";
    this.signUpURL = "users";
    this.logInURL = "users/login";
    this.logOutURL = "users/logout";
    this.scoresURL = "scores";

    this.info = new UserInfo();

    this.topscores = [];

    this.isLogIn = function() {
        if (this.info.session !== "") {
            return true;
        } else {
            return false;
        }
    };

    /**
     * Create a new account
     */
    this.createAccount = function(signUpInputs) {
        var request = new XMLHttpRequest();
        request.open("POST", this.serverURL+this.signUpURL, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(signUpInputs));

        request.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    console.log("Account created");
                    console.log("Status code: ", this.status);
                    console.log("Body: ", this.responseText);
                    return {
                        code: this.status,
                        info: ["Account created"],
                    };
                }

                if (this.status == 400) {
                    console.log("Something is wrong with the request");
                    console.log("Status code: ", this.status);
                    console.log("Body: ", this.responseText);
                    return {
                        code: this.status,
                        info: ["Something is wrong with the request"],
                    };
                }

                if (this.status == 415) {
                    errors.signUpErrors.push("The Content-Type header is wrong");
                    console.log("The Content-Type header is wrong");
                    console.log("Status code: ", this.status);
                    console.log("Body: ", this.responseText);
                    return {
                        code: this.status,
                        info: ["The Content-Type header is wrong"],
                    };
                }

                if (this.status == 422) {
                    console.log("The server cannot create the user as requested due to validation errors/conflicts");
                    var requestErrors = JSON.parse(this.responseText);

                    var errors = [];
                    if (requestErrors.emailTaken) {
                        errors.push("There already exists a user with the given email");
                        console.log("There already exists a user with the given email");
                    }

                    if (requestErrors.usernameTaken) {
                        errors.push("There already exists a user with the given username");
                        console.log("There already exists a user with the given username");
                    }

                    if (requestErrors.passwordEmpty) {
                        errors.push("The empty string is not allowed as password");
                        console.log("The empty string is not allowed as password");
                    }

                    console.log("Status code: ", this.status);
                    console.log("Body: ", this.responseText);
                    return {
                        code: this.status,
                        info: errors,
                    };
                }
            }
        };
    };

    /**
     * Log in user
     */
    this.logIn = function(logInInputs, that = this) {
        var request = new XMLHttpRequest();
        request.open("POST", this.serverURL+this.logInURL, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(logInInputs));

        request.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    console.log("User logged in");
                    console.log("Status code: ", this.status);
                    console.log("Body: ", this.responseText);
                    that.info = JSON.parse(this.responseText);
                    return {
                        code: this.status,
                        info: ["User logged in"],
                    };
                }

                if (this.status == 400) {
                    console.log("Something is wrong with the request sent to the server");
                    console.log("Status code: ", this.status);
                    console.log("Body: ", this.responseText);
                    return {
                        code: this.status,
                        info: ["Something is wrong with the request sent to the server"],
                    };
                }

                if (this.status == 401) {
                    errors.signUpErrors.push("No account with the given email and password were found");
                    console.log("No account with the given email and password were found");
                    var requestErrors = JSON.parse(this.responseText);

                    var errors = [];
                    if (requestErrors.wrongEmail) {
                        errors.push("The email is wrong");
                        console.log("The email is wrong");
                    }

                    if (requestErrors.wrongPassword) {
                        errors.push("The password is wrong");
                        console.log("The password is wrong");
                    }

                    console.log("Status code: ", this.status);
                    console.log("Body: ", this.responseText);
                    return {
                        code: this.status,
                        info: errors,
                    };
                }

                if (this.status == 415) {
                    console.log("The Content-Type header is wrong");
                    console.log("Status code: ", request.status);
                    console.log("Body: ", request.responseText);
                    return {
                        code: this.status,
                        info: ["The Content-Type header is wrong"],
                    };
                }
            }
        };
    };

    /**
     * Sign out
     * Log out
     */
    this.signOut = function(that = this) {
        var request = new XMLHttpRequest();
        request.open("POST", this.serverURL+this.logOutURL, true);
        request.setRequestHeader("Content-Type", "application/xml");
        request.send("<?xml version='1.0'?><data><session>"+this.info.session+"</session></data>");

        request.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    console.log("User logged out");
                    console.log("Status code: ", this.status);
                    console.log("Body: ", this.responseText);

                    that.info = new UserInfo();
                    return {
                        code: this.status,
                        info: ["User logged out"],
                    };
                }

                if (this.status == 400) {
                    console.log("Something is wrong with the request sent to the server");
                    console.log("Status code: ", this.status);
                    console.log("Body: ", this.responseText);
                    return {
                        code: this.status,
                        info: ["Something is wrong with the request sent to the server"],
                    };
                }

                if (this.status == 415) {
                    console.log("The Content-Type header is wrong");
                    console.log("Status code: ", this.status);
                    console.log("Body: ", this.responseText);
                    return {
                        code: this.status,
                        info: ["The Content-Type header is wrong"],
                    };
                }
            }
        };
    };

    /**
     * Add user score
     */
    this.addScore = function(score) {
        var request = new XMLHttpRequest();
        request.open("POST", this.serverURL+this.scoresURL+"/"+this.info.username, true);
        request.setRequestHeader("Content-Type", "application/xml");
        request.send("<?xml version='1.0'?><data><session>"+this.info.session+"</session><score>"+score+"</score></data>");

        request.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    console.log("The score has been added to your account");
                    console.log("Status code: ", this.status);
                    console.log("Body: ", this.responseText);
                    return {
                        code: this.status,
                        info: ["The score has been added to your account"],
                    };
                }

                if (this.status == 400) {
                    console.log("The score has been added to the account");
                    console.log("Status code: ", this.status);
                    console.log("Body: ", this.responseText);
                    return {
                        code: this.status,
                        info: ["The score has been added to the account"],
                    };
                }

                if (this.status == 401) {
                    console.log("The session id passed and the request is no longer valid");
                    console.log("Status code: ", this.status);
                    console.log("Body: ", this.responseText);
                    return {
                        code: this.status,
                        info: ["The session id passed and the request is no longer valid"],
                    };
                }

                if (this.status == 404) {
                    console.log("There does not exist a user with the given"+this.info.username);
                    console.log("Status code: ", this.status);
                    console.log("Body: ", this.responseText);
                    return {
                        code: this.status,
                        info: ["There does not exist a user with the given"+this.info.username],
                    };
                }

                if (this.status == 415) {
                    console.log("The Content-Type header is wrong");
                    console.log("Status code: ", this.status);
                    console.log("Body: ", this.responseText);
                    return {
                        code: this.status,
                        info: ["The Content-Type header is wrong"],
                    };
                }
            }
        };
    };

    /**
     * Get top 10 high scores
     */
    this.getTopScores = function(that = this) {
        var script = document.createElement("script");
        script.src = this.serverURL+this.scoresURL+"?callback=myCallback&session="+this.info.session;
        function myCallback(response) {
            if (response.status == 200) {
                console.log("Got 10 top scores");
                console.log("Status code:", response.status);
                console.log("Data:", response.data);

                that.topScores = response.data.scores;
                return {
                    code: response.status,
                    info: ["Got 10 top scores"],
                };
            }

            if (response.status == 400) {
                console.log("Something is wrong with the request sent to the server");
                console.log("Status code:", response.status);
                console.log("Data:", response.data);
                return {
                    code: response.status,
                    info: ["Something is wrong with the request sent to the server"],
                };
            }

            if (response.status == 401) {
                console.log("The session id passed in the request is no longer valid");
                console.log("Status code:", response.status);
                console.log("Data:", response.data);
                return {
                    code: response.status,
                    info: ["The session id passed in the request is no longer valid"],
                };
            }
        }
        document.head.appendChild(script)
    };

    /**
     * Get user's scores
     */
    this.getUserScores = function(that = this) {
        var script = document.createElement("script");
        script.src = this.serverURL+this.scoresURL+"/"+this.info.username+"?callback=myCallback&session="+this.info.session;
        function myCallback(response) {
            if (response.status == 200) {
                console.log("Got user's scores");
                console.log("Status code:", response.status);
                console.log("Data:", response.data);

                that.info.scores = response.data.scores;
                return {
                    code: response.status,
                    info: ["Got user's scores"],
                };
            }

            if (response.status == 400) {
                console.log("Something is wrong with the request sent to the server");
                console.log("Status code:", response.status);
                console.log("Data:", response.data);
                return {
                    code: response.status,
                    info: ["Something is wrong with the request sent to the server"],
                };
            }

            if (response.status == 401) {
                console.log("The session id passed in the request is no longer valid");
                console.log("Status code:", response.status);
                console.log("Data:", response.data);
                return {
                    code: response.status,
                    info: ["The session id passed in the request is no longer valid"],
                };
            }

            if (response.status == 404) {
                console.log("There does not exist a user with the given"+this.info.username);
                console.log("Status code:", response.status);
                console.log("Data:", response.data);
                return {
                    code: response.status,
                    info: ["There does not exist a user with the given"+this.info.username],
                };
            }
        }
        document.head.appendChild(script);
    };
};
