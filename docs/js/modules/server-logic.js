;var Server = (function($) {
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
        if (!navigator.onLine) {
            return PubSub.publish("Server.signUp", ['No internet connection'], signUpValues);
        }
        $.ajax({
            method: "POST",
            url: info.serverURL + info.signUpURL,
            contentType: "application/json",
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
    PubSub.subscribe("Validation.logIn", function(errors, logInValues) {
        if (!errors) {
            logIn(logInValues);
        }
    });
    function logIn(logInValues, callback) {
        if (!navigator.onLine) {
            return PubSub.publish("Server.logIn", ['No internet connection'], logInValues);
        }
        $.ajax({
            method: "POST",
            url: info.serverURL + info.logInURL,
            contentType: "application/json",
            data: JSON.stringify(logInValues),
            success: function(response) {
                PubSub.publish("Server.logIn", undefined, response);
            },
            error: function(response, textStatus, errorThrown) {
                PubSub.publish("Server.logIn", [errorThrown], logInValues);
            },
            statusCode: {
                401: function(response, textStatus, errorThrown) {
                    var responseJSON = response.responseJSON;
                    var errors = [];
                    if (responseJSON["wrongEmail"]) {
                        errors.push("Email is worng");
                    } else if (responseJSON["wrongPassword"]) {
                        errors.push("Password is worng");
                    }

                    PubSub.publish("Server.logIn", errors, logInValues);
                }
            }
        });
    }

    // Sign out / Log out
    PubSub.subscribe("Main.logOut", function(userInfo) {
        logOut(userInfo);
    });
    function logOut(userInfo) {
        if (!navigator.onLine) {
            return PubSub.publish("Server.logOut", ['No internet connection'], userInfo);
        }
        $.ajax({
            method: "POST",
            url: info.serverURL + info.logOutURL,
            contentType: "application/xml",
            data: '<?xml version="1.0"?> \
                        <data> \
                            <session>' + userInfo.session + '</session> \
                        </data>',
            success: function(response) {
                PubSub.publish("Server.logOut", undefined, response);
            },
            error: function(response, textStatus, errorThrown) {
                PubSub.publish("Server.logOut", [errorThrown], userInfo);
            }
        });
    }

    // Add user score
    PubSub.subscribe("Main.addUserScore", function(score, userInfo) {
        addUserScore(score, userInfo);
    });
    function addUserScore(score, userInfo) {
        if (!navigator.onLine) {
            return PubSub.publish("Server.addUserScore", ['No internet connection'], userInfo);
        }
        $.ajax({
            method: "POST",
            url: info.serverURL + info.scoresURL + "/" + userInfo.username,
            contentType: "application/xml",
            data: '<?xml version="1.0"?> \
                        <data> \
                            <session>' + userInfo.session + '</session> \
                            <score>' + score + '</score> \
                        </data>',
            success: function(response) {
                PubSub.publish("Server.addUserScore", undefined, response);
            },
            error: function(response, textStatus, errorThrown) {
                PubSub.publish("Server.addUserScore", [errorThrown], userInfo);
            }
        });
    }

    // Get top scores
    PubSub.subscribe("Main.getTopScores", function(userInfo) {
        getTopScores(userInfo);
    });
    var getTopScores = function(userInfo) {
        if (!navigator.onLine) {
            return PubSub.publish("Server.topScores", ['No internet connection'], userInfo);
        }
        $.ajax({
            method: "GET",
            url: info.serverURL + info.scoresURL,
            dataType: "jsonp",
            data: {
                session: userInfo.session,
            },
            jsonp: "callback",
            success: function(response) {
                var status = response.status;
                switch (status) {
                    case 400:
                        var errors = ['Something is wrong with the request sent to the server'];
                        PubSub.publish("Server.topScores", errors, userInfo);
                        break;
                    case 401:
                        var errors = ['The session id passed in the request is no longer valid'];
                        PubSub.publish("Server.topScores", errors, userInfo);
                        break;
                    default:
                        var scores = response.data.scores;
                        PubSub.publish("Server.topScores", undefined, scores);
                }

            },
        });
    }


    // Get user's scores
    PubSub.subscribe("Main.getUserScores", function(userInfo) {
        getUserScores(userInfo);
    });
    var getUserScores = function(userInfo) {
        if (!navigator.onLine) {
            return PubSub.publish("Server.userScores", ['No internet connection'], userInfo);
        }
        $.ajax({
            method: "GET",
            url: info.serverURL + info.scoresURL + "/" + userInfo.username,
            dataType: "jsonp",
            data: {
                session: userInfo.session,
            },
            jsonp: "callback",
            success: function(response) {
                var status = response.status;
                switch (status) {
                    case 400:
                        var errors = ['Something is wrong with the request sent to the server'];
                        PubSub.publish("Server.userScores", errors, userInfo);
                        break;
                    case 401:
                        var errors = ['The session id passed in the request is no longer valid'];
                        PubSub.publish("Server.userScores", errors, userInfo);
                        break;
                    default:
                        var scores = response.data.scores;
                        scores.forEach(function(score) {
                            score.username = userInfo.username;
                        });
                        PubSub.publish("Server.userScores", undefined, scores);
                }

            },
        });
    }
})(jQuery);
