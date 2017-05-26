;var Server = (function($) {
    // Server info
    // -------------------------------------------------------------------------
    var info = {
        serverURL: "http://193.10.30.163/",
        signUpURL: "users",
        logInURL: "users/login",
        logOutURL: "users/logout",
        scoresURL: "scores",
    };

    // Sign Up - Create new account
    // -------------------------------------------------------------------------
    function signUp(signUpValues, callback) {
        if (!navigator.onLine) {
            return callback(['No internet connection'], undefined);
        }
        $.ajax({
            method: "POST",
            url: info.serverURL + info.signUpURL,
            contentType: "application/json",
            data: JSON.stringify(signUpValues),
            success: function(response) {
                return callback(undefined, signUpValues);
            },
            error: function(response, textStatus, errorThrown) {
                return callback([errorThrown], signUpValues);
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

                    return callback(errors, signUpValues);
                }
            }
        });
    }

    // Log in
    // -------------------------------------------------------------------------
    function logIn(logInValues, callback) {
        if (!navigator.onLine) {
            return callback(['No internet connection'], logInValues);
        }
        $.ajax({
            method: "POST",
            url: info.serverURL + info.logInURL,
            contentType: "application/json",
            data: JSON.stringify(logInValues),
            success: function(response) {
                return callback(undefined, response);
            },
            error: function(response, textStatus, errorThrown) {
                return callback([errorThrown], logInValues);
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

                    return callback(errors, logInValues);
                }
            }
        });
    }

    // Log out - Sign out
    // -------------------------------------------------------------------------
    function logOut(userInfo, callback) {
        if (!navigator.onLine) {
            return callback(['No internet connection'], userInfo);
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
                return callback(undefined, response);
            },
            error: function(response, textStatus, errorThrown) {
                return callback([errorThrown], userInfo);
            }
        });
    }

    // Add user score
    // -------------------------------------------------------------------------
    function addUserScore(score, userInfo, callback) {
        if (!navigator.onLine) {
            return callback(['No internet connection'], userInfo);
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
                return callback(undefined, response);
            },
            error: function(response, textStatus, errorThrown) {
                return callback([errorThrown], userInfo);
            }
        });
    }

    // Get top scores
    // -------------------------------------------------------------------------
    var getTopScores = function(userInfo) {
        if (!navigator.onLine) {
            return callback(['No internet connection'], userInfo);
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
                        return callback(errors, userInfo);
                        break;
                    case 401:
                        var errors = ['The session id passed in the request is no longer valid'];
                        return callback(errors, userInfo);
                        break;
                    default:
                        var scores = response.data.scores;
                        return callback(undefined, scores);
                }
            },
        });
    }

    // Get user's scores
    // -------------------------------------------------------------------------
    var getUserScores = function(userInfo, callback) {
        if (!navigator.onLine) {
            return callback(['No internet connection'], userInfo);
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
                        return callback(errors, userInfo);
                        break;
                    case 401:
                        var errors = ['The session id passed in the request is no longer valid'];
                        return callback(errors, userInfo);
                        break;
                    default:
                        var scores = response.data.scores;
                        scores.forEach(function(score) {
                            score.username = userInfo.username;
                        });
                        return callback(undefined, scores);
                }
            },
        });
    }

    return {
        signUp: signUp,
        logIn: logIn,
        logOut: logOut,
        addUserScore: addUserScore,
        getTopScores: getTopScores,
        getUserScores: getUserScores
    };
})(jQuery);
