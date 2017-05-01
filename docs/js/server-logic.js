// var script = document.createElement("script");
// script.src = "http://193.10.30.163/scores?callback=myCallback&session= b4..c3";
// function myCallback(response) {
//     console.log("We got response from server!");
//     console.log("Status code:", response.status);
//     console.log("Data:", response.data);
// }
// document.head.appendChild(script);

var serverURL = "http://193.10.30.163/";
var signUpURL = "users";
var logInURL = "users/login";
var logOutURL = "users/logout";
var scoresURL = "scores";

var session = {
    loggedIn : false,

    user : {
        firstName : "",
        lastName : "",
        email : "",
        username : "",
        password : "",
        session : "",
        scores : [],
    },

    Topscores : [],
};

/**
 * Create a new account
 */
function createAccount(signUpInputs) {
    var request = new XMLHttpRequest();
    request.open("POST", serverURL+signUpURL, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(signUpInputs));

    request.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                console.log("Account created");
                console.log("Status code: ", request.status);
                console.log("Body: ", request.responseText);
                return 200;
            }

            errors.signUpErrors = [];
            if (this.status == 400) {
                errors.signUpErrors.push("Something is wrong with the request");
                console.log("Something is wrong with the request");
                console.log("Status code: ", request.status);
                console.log("Body: ", request.responseText);
                return 400;
            }

            if (this.status == 415) {
                errors.signUpErrors.push("The Content-Type header is wrong");
                console.log("The Content-Type header is wrong");
                console.log("Status code: ", request.status);
                console.log("Body: ", request.responseText);
                return 415;
            }

            if (this.status == 422) {
                errors.signUpErrors.push("The server cannot create the user as requested due to validation errors/conflicts");
                console.log("The server cannot create the user as requested due to validation errors/conflicts");
                var requestErrors = JSON.parse(request.responseText);
                if (requestErrors.emailTaken) {
                    errors.signUpErrors.push("There already exists a user with the given email");
                    console.log("There already exists a user with the given email");
                }

                if (requestErrors.usernameTaken) {
                    errors.signUpErrors.push("There already exists a user with the given username");
                    console.log("There already exists a user with the given username");
                }

                if (requestErrors.passwordEmpty) {
                    errors.passwordEmpty.push("The empty string is not allowed as password");
                    console.log("The empty string is not allowed as password");
                }

                console.log("Status code: ", request.status);
                console.log("Body: ", request.responseText);
                return 422;
            }
        }
    };
}

/**
 * Log in user
 */
function logIn(logInInputs) {
    var request = new XMLHttpRequest();
    request.open("POST", serverURL+logInURL, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(logInInputs));

    request.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                console.log("User logged in");
                console.log("Status code: ", request.status);
                console.log("Body: ", request.responseText);

                session.user = JSON.parse(this.responseText);
                session.loggedIn = true;
                return 200;
            }

            errors.logInErrors = [];
            if (this.status == 400) {
                errors.logInErrors.push("Something is wrong with the request sent to the server");
                console.log("Something is wrong with the request sent to the server");
                console.log("Status code: ", request.status);
                console.log("Body: ", request.responseText);
                return 400;
            }

            if (this.status == 401) {
                errors.signUpErrors.push("No account with the given email and password were found");
                console.log("No account with the given email and password were found");
                var requestErrors = JSON.parse(request.responseText);
                if (requestErrors.wrongEmail) {
                    errors.signUpErrors.push("The email is wrong");
                    console.log("The email is wrong");
                }

                if (requestErrors.wrongPassword) {
                    errors.signUpErrors.push("The password is wrong");
                    console.log("The password is wrong");
                }

                console.log("Status code: ", request.status);
                console.log("Body: ", request.responseText);
                return 401;
            }

            if (this.status == 415) {
                errors.logInErrors.push("The Content-Type header is wrong");
                console.log("The Content-Type header is wrong");
                console.log("Status code: ", request.status);
                console.log("Body: ", request.responseText);
                return 415;
            }
        }
    };
}

/**
 * Sign out
 * Log out
 */
function signOut() {
    var request = new XMLHttpRequest();
    request.open("POST", serverURL+logOutURL, true);
    request.setRequestHeader("Content-Type", "application/xml");
    request.send("<?xml version='1.0'?> <data> <session>"+session.user.session+"</session> </data>");

    request.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                console.log("User logged out");
                console.log("Status code: ", request.status);
                console.log("Body: ", request.responseText);

                session.user = {};
                session.loggedIn = false;
                return 200;
            }

            errors.serverErrors = [];
            if (this.status == 400) {
                errors.serverErrors.push("Something is wrong with the request sent to the server");
                console.log("Something is wrong with the request sent to the server");
                console.log("Status code: ", request.status);
                console.log("Body: ", request.responseText);
                return 400;
            }

            if (this.status == 415) {
                errors.serverErrors.push("The Content-Type header is wrong");
                console.log("The Content-Type header is wrong");
                console.log("Status code: ", request.status);
                console.log("Body: ", request.responseText);
                return 415;
            }
        }
    };
}

/**
 * Add user score
 */
function addScore(score, numTries = 0) {
    var request = new XMLHttpRequest();
    request.open("POST", serverURL+scoresURL+"/"+session.user.username, true);
    request.setRequestHeader("Content-Type", "application/xml");
    request.send("<?xml version='1.0'?> <data> <session>" + session.user.session + "</session> <score>" + score +"</score> </data>");

    request.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                console.log("The score has been added to your account");
                console.log("Status code: ", request.status);
                console.log("Body: ", request.responseText);
                return 200;
            }

            errors.gameErrors = [];
            if (this.status == 400) {
                errors.gameErrors.push("The score has been added to your account");
                console.log("The score has been added to your account");
                console.log("Status code: ", request.status);
                console.log("Body: ", request.responseText);
                return 400;
            }

            if (this.status == 400) {
                if (numTries < 10) {
                    if (logIn(session.user.email, session.user.password) === 200) {
                        if (addScore(score, numTries + 1) === 200) {
                            return 200;
                        }
                    }
                } else {
                    errors.gameErrors.push("Log in again please");
                    console.log("Log in again please");
                    console.log("Status code: ", request.status);
                    console.log("Body: ", request.responseText);
                    return 400;
                }
            }

            if (this.status == 404) {
                errors.gameErrors.push("There does not exist a user with the given" + session.user.username);
                console.log("There does not exist a user with the given" + session.user.username);
                console.log("Status code: ", request.status);
                console.log("Body: ", request.responseText);
                return 404;
            }

            if (this.status == 415) {
                errors.gameErrors.push("The Content-Type header is wrong");
                console.log("The Content-Type header is wrong");
                console.log("Status code: ", request.status);
                console.log("Body: ", request.responseText);
                return 404;
            }
        }
    };
}

/**
 * Get top 10 high scores
 */
function topScores(response) {
    if (response.status == 200) {
        console.log("Got 10 top scores");
        console.log("Status code:", response.status);
        console.log("Data:", response.data);

        session.topScores = response.data.scores;
        return 200;
    }

    if (response.status == 400) {
        console.log("Something is wrong with the request sent to the server");
        console.log("Status code:", response.status);
        console.log("Data:", response.data);
        return 400;
    }

    if (response.status == 401) {
        console.log("The session id passed in the request is no longer valid");
        console.log("Status code:", response.status);
        console.log("Data:", response.data);
        return 401;
    }
}

function getTopScores() {
    var script = document.createElement("script");
    console.log(session.user.session);
    script.src = serverURL+scoresURL+"?callback=topScores&session="+session.user.session;
    document.head.appendChild(script);
}

/**
 * Get user's scores
 */
function userScoresCallback(response) {
    if (response.status == 200) {
        console.log("Got user's scores");
        console.log("Status code:", response.status);
        console.log("Data:", response.data);

        session.user.scores = response.data.scores;
        return 200;
    }

    if (response.status == 400) {
        console.log("Something is wrong with the request sent to the server");
        console.log("Status code:", response.status);
        console.log("Data:", response.data);
        return 400;
    }

    if (response.status == 401) {
        console.log("The session id passed in the request is no longer valid");
        console.log("Status code:", response.status);
        console.log("Data:", response.data);
        return 401;
    }

    if (response.status == 404) {
        console.log("There does not exist a user with the given"+session.user.username);
        console.log("Status code:", response.status);
        console.log("Data:", response.data);
        return 404;
    }
}
function getUserScores() {
    var script = document.createElement("script");
    script.src = serverURL+scoresURL+"/"+session.user.username+"?callback=userScoresCallback&session="+session.user.session;
    document.head.appendChild(script);
}
