// activate nav buttons according current to page
let page = document.location.pathname;
const navlinks = document.querySelectorAll(
    "#main-nav a"
) as NodeListOf<HTMLAnchorElement>;

page = page.replace("/todo-app", "");
if (page !== "/" && page !== "/index.html") {
    navlinks.forEach((navlink) => {
        if (page.startsWith(`/${navlink.id}`)) {
            navlink.classList.add("active");
        }
    });
}

// set footer year
const year = document.querySelector("#year") as Element;
year.textContent = new Date().getFullYear().toString();
