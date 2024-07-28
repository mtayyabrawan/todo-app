// activate nav buttons according current to page
const page = document.location.pathname;
const navlinks = document.querySelectorAll("#main-nav a");

if (page !== "/" && page !== "/index.html") {
    navlinks.forEach((navlink) => {
        if (page.startsWith(navlink.getAttribute("href"))) {
            navlink.classList.add("active");
        }
    });
}
