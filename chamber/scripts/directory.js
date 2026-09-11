const directory = document.querySelector("#directory");
const errorMessage = document.querySelector("#directory-error");
const memberCount = document.querySelector("#member-count");
const gridButton = document.querySelector("#grid-view");
const listButton = document.querySelector("#list-view");
const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#primary-navigation");

const membershipNames = {
  1: "Member",
  2: "Silver",
  3: "Gold",
};

function createDetail(label, content) {
  const item = document.createElement("li");
  const heading = document.createElement("strong");
  heading.textContent = `${label}: `;
  item.append(heading, content);
  return item;
}

function createMemberCard(member) {
  const card = document.createElement("article");
  const imageWrap = document.createElement("div");
  const image = document.createElement("img");
  const content = document.createElement("div");
  const category = document.createElement("p");
  const heading = document.createElement("h3");
  const badge = document.createElement("span");
  const details = document.createElement("ul");
  const address = document.createElement("span");
  const phone = document.createElement("a");
  const website = document.createElement("a");
  const membership = membershipNames[member.membershipLevel] || "Member";

  card.className = "member-card";
  imageWrap.className = "member-image-wrap";
  image.className = "member-image";
  image.src = `images/members/${member.image}`;
  image.alt = `${member.name} business illustration`;
  image.width = 640;
  image.height = 360;
  image.loading = "lazy";
  imageWrap.append(image);

  content.className = "member-content";
  category.className = "member-category";
  category.textContent = member.category;
  heading.textContent = member.name;
  badge.className = `membership-badge ${membership.toLowerCase()}`;
  badge.textContent = `${membership} member`;

  details.className = "member-details";
  address.textContent = member.address;
  phone.href = `tel:${member.phone.replace(/[^\d+]/g, "")}`;
  phone.textContent = member.phone;
  website.href = member.website;
  website.target = "_blank";
  website.rel = "noopener noreferrer";
  website.textContent = "Visit website";
  website.setAttribute(
    "aria-label",
    `Visit ${member.name} website (opens in a new tab)`,
  );

  details.append(
    createDetail("Address", address),
    createDetail("Phone", phone),
    createDetail("Web", website),
  );
  content.append(category, heading, badge, details);
  card.append(imageWrap, content);
  return card;
}

function displayMembers(members) {
  const fragment = document.createDocumentFragment();
  members.forEach((member) => fragment.append(createMemberCard(member)));
  directory.replaceChildren(fragment);
  directory.setAttribute("aria-busy", "false");
  memberCount.textContent = `${members.length} local businesses and community partners`;
}

async function loadMembers() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) {
      throw new Error(`Member request failed with status ${response.status}`);
    }

    const members = await response.json();
    if (!Array.isArray(members) || members.length === 0) {
      throw new Error("Member data is empty or invalid");
    }

    displayMembers(members);
  } catch (error) {
    console.error("Unable to load chamber members:", error);
    directory.hidden = true;
    directory.setAttribute("aria-busy", "false");
    errorMessage.hidden = false;
    memberCount.textContent = "Directory temporarily unavailable";
  }
}

function setView(view) {
  const showGrid = view === "grid";
  directory.classList.toggle("grid-view", showGrid);
  directory.classList.toggle("list-view", !showGrid);
  gridButton.setAttribute("aria-pressed", String(showGrid));
  listButton.setAttribute("aria-pressed", String(!showGrid));
}

gridButton.addEventListener("click", () => setView("grid"));
listButton.addEventListener("click", () => setView("list"));

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
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuButton.focus();
  }
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
document.querySelector("#last-modified").textContent =
  `Last modified: ${document.lastModified}`;

loadMembers();
