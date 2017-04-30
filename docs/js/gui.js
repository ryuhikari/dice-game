/**
* Variables
* =============================================================================
*/

// Navigation bar
var navigation = $("#navigation");
var navigationSidebar = $("#nav-sidebar");

// Open and close navigation sidebar
var openNavButton = $("#open-nav-sidebar").on("click", function(event) {
    event.preventDefault();
    openNav();
});
var closeNavButton = $("#close-nav-sidebar").on("click", function(event) {
    event.preventDefault();
    closeNav();
});

//Show elements depending on the user is logged in or not
var showLoggedInElements = $(".show-logged-in");
var showLoggedOutElements = $(".show-logged-out");

// GUI control
var userLoggedIn = false;

/**
* Functions
* =============================================================================
*/

/**
* Open and close navigation sidebar
*/
function openNav() {
    navigation.hide();
    navigationSidebar.css({"width": "100%", "display": "block"});
    /*
    navigation.style.display = "none";
    navigationSidebar.style.width = "100%";
    navigationSidebar.style.display = "block";
    */
}

function closeNav() {
    navigation.show();
    navigationSidebar.hide();
    /*
    navigation.style.display = "initial";
    navigationSidebar.style.display = "none";
    */
}

/**
* Show elements depending on the user is logged in or not
*/
function showLoggedIn() {
    showLoggedInElements.show();
    showLoggedOutElements.hide();
    /*
    for (var i = 0; i < showLoggedInElements.length; i++) {
    showLoggedInElements[i].style.display = "initial";
}

for (var i = 0; i < showLoggedOutElements.length; i++) {
showLoggedOutElements[i].style.display = "none";
}
*/
}

function showLoggedOut() {
    showLoggedInElements.hide();
    showLoggedOutElements.show();
    /*
    for (var i = 0; i < showLoggedInElements.length; i++) {
    showLoggedInElements[i].style.display = "none";
}

for (var i = 0; i < showLoggedOutElements.length; i++) {
showLoggedOutElements[i].style.display = "initial";
}
*/
}

/**
* Smooth scroll
*
* The following code was adapted from a post:
* Add smooth scrolling to page anchors
* at:
* https://www.w3schools.com/jquery/tryit.asp?filename=tryjquery_eff_animate_smoothscroll
* Accessed: 2017-04-30
*/
$(document).ready(function(){
    // Add smooth scrolling to all links
    $(".smooth").on('click', function(event) {

        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = this.hash;

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: $(hash).offset().top - 50
            }, 800, function(){

                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
            });
        } // End if
        closeNav();
    });
});

/**
* Update GUI
*/
function updateGUI() {
    if (userLoggedIn) {
        showLoggedIn();
    } else {
        showLoggedOut();
    }
}
