// $.ajax({
// method: "GET"
// url: "path/to/the/file.json",
// contentType: "application/json",
// dataFormat: "json",
// success: function(response){ },
// data: '{"the": "data"}'
// })

// User
var User = function() {
    this._firstName = "";
    this._lastName = "";
    this._email = "";
    this._username = "";
    this._session = "";
};
User.prototype.getInfo = function() {
    return {
        firstName: this._firstName,
        lastName: this._lastName,
        email: this._email,
        user: this._username,
        session: this._session,
    };
};

// Server
(function($) {
    // Server info
    var info = {
        serverURL: "http://193.10.30.163/",
        signUpURL: "users",
        logInURL: "users/login",
        logOutURL: "users/logout",
        scoresURL: "scores",
    };

    // Create new account
    PubSub.subscribe("Validation.signUp", function(errors, signUpValues) {
        if (!errors) {
            signUp(signUpValues);
        }
    });
    function signUp(signUpValues) {
        console.log(signUpValues);
        $.ajax({
            method: "POST",
            url: info.serverURL + info.signUpURL,
            contentType: "application/json",
            dataFormat: "json",
            data: JSON.stringify(signUpValues),
            success: function(response) {
                PubSub.publish("Server.signUp", undefined, signUpValues);
            },
            error: function(response, textStatus, errorThrown) {
                PubSub.publish("Server.signUp", [errorThrown], signUpValues);
            },
            statusCode: {
                422: function(response, textStatus, errorThrown) {
                    var responseJSON = response.responseJSON;
                    var errors = [];
                    if (responseJSON["emailTaken"]) {
                        errors.push("Email is already in use");
                    } else if (responseJSON["usernameTaken"]) {
                        errors.push("Username is already in use");
                    } else if (responseJSON["passwordEmpty"]) {
                        errors.push("Password is empty");
                    }

                    PubSub.publish("Server.signUp", errors, signUpValues);
                }
            }
        });
    }

    // Log in
    function logIn(logInInputs, callback) {
        var that = this;
        var request = new XMLHttpRequest();
        request.open("POST", this.serverURL+this.logInURL, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(logInInputs));

        request.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    that.info = JSON.parse(this.responseText);
                    var data = {
                        from: name,
                        status: this.status,
                        info: ["User logged in"],
                    };
                    callback(data);
                    return;
                }
                if (this.status == 400) {
                    var data = {
                        from: name,
                        status: this.status,
                        info: ["Something is wrong with the request sent to the server"],
                    };
                    callback(data);
                    return;
                }
                if (this.status == 401) {
                    var requestErrors = JSON.parse(this.responseText);
                    var errors = [];
                    if (requestErrors.wrongEmail) {
                        errors.push("The email is wrong");
                    }
                    if (requestErrors.wrongPassword) {
                        errors.push("The password is wrong");
                    }
                    var data = {
                        from: name,
                        status: this.status,
                        info: errors,
                    };
                    callback(data);
                    return;
                }
                if (this.status == 415) {
                    var data = {
                        from: name,
                        status: this.status,
                        info: ["The Content-Type header is wrong"],
                    };
                    callback(data);
                    return;
                }
            }
        };
    }

    // Sign out / Log out
    function signOut(callback, that = this) {
        var that = this;
        var request = new XMLHttpRequest();
        request.open("POST", this.serverURL+this.logOutURL, true);
        request.setRequestHeader("Content-Type", "application/xml");
        request.send("<?xml version='1.0'?><data><session>"+this.info.session+"</session></data>");

        request.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    that.info = new UserInfo();
                    var data = {
                        from: name,
                        status: this.status,
                        info: ["User logged out"],
                    };
                    callback(data);
                    return;
                }
                if (this.status == 400) {
                    var data = {
                        from: name,
                        status: this.status,
                        info: ["Something is wrong with the request sent to the server"],
                    };
                    callback(data);
                    return;
                }
                if (this.status == 415) {
                    var data = {
                        from: name,
                        status: this.status,
                        info: ["The Content-Type header is wrong"],
                    };
                    callback(data);
                    return;
                }
            }
        };
    }

    // Add user score
    function addScore(score, callback) {
        var request = new XMLHttpRequest();
        request.open("POST", this.serverURL+this.scoresURL+"/"+this.info.username, true);
        request.setRequestHeader("Content-Type", "application/xml");
        request.send("<?xml version='1.0'?><data><session>"+this.info.session+"</session><score>"+score+"</score></data>");

        request.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var data = {
                        from: name,
                        status: this.status,
                        info: ["The score has been added to your account"],
                    };
                    callback(data);
                    return;
                }
                if (this.status == 400) {
                    var data = {
                        from: name,
                        status: this.status,
                        info: ["The score has been added to the account"],
                    };
                    callback(data);
                    return;
                }
                if (this.status == 401) {
                    var data = {
                        from: name,
                        status: this.status,
                        info: ["The session id passed and the request is no longer valid"],
                    };
                    callback(data);
                    return;
                }
                if (this.status == 404) {
                    var data = {
                        from: name,
                        status: this.status,
                        info: ["There does not exist a user with the given"+this.info.username],
                    };
                    callback(data);
                    return;
                }
                if (this.status == 415) {
                    var data = {
                        from: name,
                        status: this.status,
                        info: ["The Content-Type header is wrong"],
                    };
                    callback(data);
                    return;
                }
            }
        };
    }

    // Get top highscores
    function getTopScores(callback) {
        var script = document.createElement("script");
        script.src = this.serverURL+this.scoresURL+"?callback="+callback+"&session="+this.info.session;
        document.head.appendChild(script);
    };

    // Get user's scores
    function getUserScores(callback) {
        var script = document.createElement("script");
        script.src = this.serverURL+this.scoresURL+"/"+this.info.username+"?callback="+callback+"&session="+this.info.session;
        document.head.appendChild(script);
    };
})(jQuery);
