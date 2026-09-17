const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#primary-navigation");

function closeMenu() {
  if (!menuButton || !navigation) return;
  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");
}

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Open navigation menu" : "Close navigation menu",
    );
    navigation.classList.toggle("open", !isOpen);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation.classList.contains("open")) {
      closeMenu();
      menuButton.focus();
    }
  });
}

const year = document.querySelector("#current-year");
const lastModified = document.querySelector("#last-modified");
if (year) year.textContent = new Date().getFullYear();
if (lastModified) {
  lastModified.textContent = `Last modified: ${document.lastModified}`;
}
