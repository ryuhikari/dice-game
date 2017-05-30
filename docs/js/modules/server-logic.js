/**
 * Server module
 * @namespace
 * @param  {Object} $ - jQuery
 * @return {Object}   - public methods and variables
 */
var Server = (function($) {
    /**
     * Server info
     * @memberof Server
     * @private
     * @type {Object}
     */
    var info = {
        serverURL: "http://193.10.30.163/",
        signUpURL: "users",
        logInURL: "users/login",
        logOutURL: "users/logout",
        scoresURL: "scores",
    };

    /**
     * Sign Up - Create new account
     * @memberof Server
     * @public
     * @param  {Object}   signUpValues - sign up info: {firstName, lastName, email, username, password}
     * @param  {Function} callback     - callback function
     * @return {Function}              - callback(errors, status, signUpValues || response);
     */
    function signUp(signUpValues, callback) {
        // Check if there is internet connection
        if (!navigator.onLine) {
            return callback(['No internet connection'], 400, undefined);
        }
        $.ajax({
            method: "POST",
            url: info.serverURL + info.signUpURL,
            contentType: "application/json",
            data: JSON.stringify(signUpValues),
            success: function(data, textStatus, response) {
                return callback(undefined, response.status, signUpValues);
            },
            error: function(response, textStatus, errorThrown) {
                return callback([errorThrown], response.status, signUpValues);
            },
            statusCode: {
                422: function(response, textStatus, errorThrown) {
                    var responseJSON = response.responseJSON;
                    var errors = [];
                    if (responseJSON.emailTaken) {
                        errors.push("Email is already in use");
                    } else if (responseJSON.usernameTaken) {
                        errors.push("Username is already in use");
                    } else if (responseJSON.passwordEmpty) {
                        errors.push("Password is empty");
                    }

                    return callback(errors, response.status, signUpValues);
                }
            }
        });
    }

    /**
     * Log in user
     * @memberof Server
     * @public
     * @param  {Object}   logInValues - log in info: {email, password}
     * @param  {Function} callback    - callback function
     * @return {Function}             - callback(errors, status, logInValues || response);
     */
    function logIn(logInValues, callback) {
        if (!navigator.onLine) {
            return callback(['No internet connection'], 400, logInValues);
        }
        $.ajax({
            method: "POST",
            url: info.serverURL + info.logInURL,
            contentType: "application/json",
            data: JSON.stringify(logInValues),
            success: function(data, textStatus, response) {
                return callback(undefined, response.status, data);
            },
            error: function(response, textStatus, errorThrown) {
                return callback([errorThrown], response.status, logInValues);
            },
            statusCode: {
                401: function(response, textStatus, errorThrown) {
                    var responseJSON = response.responseJSON;
                    var errors = [];
                    if (responseJSON.wrongEmail) {
                        errors.push("Email is worng");
                    } else if (responseJSON.wrongPassword) {
                        errors.push("Password is worng");
                    }

                    return callback(errors, response.status, logInValues);
                }
            }
        });
    }

    /**
     * Log out - Sign out a user
     * @memberof Server
     * @public
     * @param  {Object}   userInfo - user info: {session}
     * @param  {Function} callback - callback function
     * @return {Function}          - callback(errors, status, response);
     */
    function logOut(userInfo, callback) {
        if (!navigator.onLine) {
            return callback(['No internet connection'], 400, userInfo);
        }
        $.ajax({
            method: "POST",
            url: info.serverURL + info.logOutURL,
            contentType: "application/xml",
            data: "<?xml version=\"1.0\"?><data><session>" + userInfo.session + "</session></data>",
            success: function(data, textStatus, response) {
                return callback(undefined, response.status, response);
            },
            error: function(response, textStatus, errorThrown) {
                return callback([errorThrown], response.status, userInfo);
            }
        });
    }

    /**
     * Upload user score
     * @memberof Server
     * @public
     * @param  {number}   score    - score number
     * @param  {Object}   userInfo - user info: {username, session}
     * @param  {Function} callback - callback function
     * @return {Function}          - callback(errors, status, userInfo || response);
     */
    function addUserScore(score, userInfo, callback) {
        if (!navigator.onLine) {
            return callback(['No internet connection'], 400, userInfo);
        }
        $.ajax({
            method: "POST",
            url: info.serverURL + info.scoresURL + "/" + userInfo.username,
            contentType: "application/xml",
            data: "<?xml version=\"1.0\"?><data><session>" + userInfo.session + "</session><score>" + score + "</score></data>",
            success: function(data, status, response) {
                return callback(undefined, response.status, response);
            },
            error: function(response, textStatus, errorThrown) {
                return callback([errorThrown], response.status, userInfo);
            }
        });
    }

    /**
     * Get top scores
     * @memberof Server
     * @public
     * @param  {Object}   userInfo - user info: {session}
     * @param  {Function} callback - callback function
     * @return {Function}          - callback(errors, status, userInfo || scores);
     */
    var getTopScores = function(userInfo, callback) {
        if (!navigator.onLine) {
            return callback(['No internet connection'], 400, userInfo);
        }
        $.ajax({
            method: "GET",
            url: info.serverURL + info.scoresURL,
            dataType: "jsonp",
            data: {
                session: userInfo.session,
            },
            jsonp: "callback",
            success: function(data, textStatus, response) {
                var status = data.status;
              	var errors;
                switch (status) {
                    case 400:
                        errors = ['Something is wrong with the request sent to the server'];
                        callback(errors, status, userInfo);
                        break;
                    case 401:
                        errors = ['The session id passed in the request is no longer valid'];
                        callback(errors, status, userInfo);
                        break;
                    default:
                        var scores = data.data.scores;
                        return callback(undefined, status, scores);
                }
            },
        });
    };

    /**
     * Get user's scores
     * @memberof Server
     * @public
     * @param  {Object}   userInfo - user info: {username, session}
     * @param  {Function} callback - callback function
     * @return {Function}          - callback(errors, status, userInfo || scores);
     */
    var getUserScores = function(userInfo, callback) {
        if (!navigator.onLine) {
            return callback(['No internet connection'], 400, userInfo);
        }
        $.ajax({
            method: "GET",
            url: info.serverURL + info.scoresURL + "/" + userInfo.username,
            dataType: "jsonp",
            data: {
                session: userInfo.session,
            },
            jsonp: "callback",
            success: function(data, textStatus, response) {
                var status = data.status;
              	var errors;
                switch (status) {
                    case 400:
                        errors = ['Something is wrong with the request sent to the server'];
                        callback(errors, status, userInfo);
                        break;
                    case 401:
                        errors = ['The session id passed in the request is no longer valid'];
                        callback(errors, status, userInfo);
                        break;
                    default:
                        var scores = data.data.scores;
                        scores.forEach(function(score) {
                            score.username = userInfo.username;
                        });
                        callback(undefined, status, scores);
                }
            },
        });
    };

    // Public methods
    return {
        signUp: signUp,
        logIn: logIn,
        logOut: logOut,
        addUserScore: addUserScore,
        getTopScores: getTopScores,
        getUserScores: getUserScores
    };
})(jQuery);
