var nav = document.getElementById("nav");
var navSidebar = document.getElementById("nav-sidebar");

var openNavSidebarButton = document.getElementById("open-nav-sidebar");
openNavSidebarButton.addEventListener("click", openNav);

var closeNavSidebarButton = document.getElementById("close-nav-sidebar");
closeNavSidebarButton.addEventListener("click", closeNav);

var showLogInElements = document.getElementsByClassName("show-log-in");
var showLogOutElements = document.getElementsByClassName("show-log-out");

function openNav(event) {
    event.preventDefault();

    nav.style.display = "none";
    navSidebar.style.width = "100%";
    navSidebar.style.display = "block";
}

function closeNav(event) {
    event.preventDefault();

    nav.style.display = "initial";
    navSidebar.style.display = "none";
}

function showLogIn() {
    for (var i = 0; i < showLogInElements.length; i++) {
        showLogInElements[i].style.display = "initial";
    }

    for (var i = 0; i < showLogOutElements.length; i++) {
        showLogOutElements[i].style.display = "none";
    }
}

function showLogOut() {
    for (var i = 0; i < showLogInElements.length; i++) {
        showLogInElements[i].style.display = "none";
    }

    for (var i = 0; i < showLogOutElements.length; i++) {
        showLogOutElements[i].style.display = "initial";
    }
}
