const timestamp = document.querySelector("#timestamp");
const membershipCards = document.querySelector("#membership-cards");
const dialogTriggers = document.querySelectorAll("[data-dialog]");

if (timestamp) {
  timestamp.value = new Date().toISOString();
}

if (membershipCards) {
  requestAnimationFrame(() => membershipCards.classList.add("cards-ready"));
}

dialogTriggers.forEach((trigger) => {
  const dialog = document.querySelector(`#${trigger.dataset.dialog}`);
  if (!dialog) return;

  const closeButton = dialog.querySelector(".close-dialog");

  trigger.addEventListener("click", () => {
    dialog.showModal();
  });

  closeButton?.addEventListener("click", () => {
    dialog.close();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", () => {
    trigger.focus();
  });
});
