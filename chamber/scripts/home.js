const weatherCurrent = document.querySelector("#weather-current");
const weatherForecast = document.querySelector("#weather-forecast");
const weatherError = document.querySelector("#weather-error");
const spotlights = document.querySelector("#spotlights");
const spotlightsError = document.querySelector("#spotlights-error");

const apiKey = "3496a020f0d51379d310e1b98ebd54e1";
const lat = "44.99";
const lon = "-123.02";
const units = "imperial";

const membershipNames = {
  2: "Silver",
  3: "Gold",
};

function capitalize(text) {
  return text.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function weekdayLabel(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function renderCurrentWeather(data) {
  const temp = Math.round(data.main.temp);
  const description = capitalize(data.weather[0].description);
  const icon = data.weather[0].icon;
  const iconSrc = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  weatherCurrent.innerHTML = `
    <div class="weather-now">
      <img src="${iconSrc}" alt="${description}" width="80" height="80">
      <div>
        <p class="weather-temp">${temp}&deg;F</p>
        <p class="weather-desc">${description}</p>
      </div>
    </div>
  `;
}

function pickDailyForecasts(list) {
  const byDay = new Map();

  list.forEach((item) => {
    const dayKey = item.dt_txt.slice(0, 10);
    if (!byDay.has(dayKey)) byDay.set(dayKey, []);
    byDay.get(dayKey).push(item);
  });

  const today = new Date().toISOString().slice(0, 10);
  const days = [...byDay.keys()].filter((day) => day > today).slice(0, 3);

  return days.map((day) => {
    const readings = byDay.get(day);
    const noonish = readings.reduce((best, item) => {
      const hour = Number(item.dt_txt.slice(11, 13));
      const bestHour = Number(best.dt_txt.slice(11, 13));
      return Math.abs(hour - 12) < Math.abs(bestHour - 12) ? item : best;
    });
    return { day, reading: noonish };
  });
}

function renderForecast(list) {
  const forecasts = pickDailyForecasts(list);
  if (forecasts.length === 0) {
    weatherForecast.innerHTML = "<li>Forecast unavailable.</li>";
    return;
  }

  weatherForecast.innerHTML = forecasts
    .map(({ day, reading }) => {
      const temp = Math.round(reading.main.temp);
      const description = capitalize(reading.weather[0].description);
      return `<li>
        <span class="forecast-day">${weekdayLabel(day)}</span>
        <span class="forecast-temp">${temp}&deg;F</span>
        <span class="forecast-desc">${description}</span>
      </li>`;
    })
    .join("");
}

async function loadWeather() {
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

  try {
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl),
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error("Weather request failed");
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();
    renderCurrentWeather(currentData);
    renderForecast(forecastData.list);
  } catch (error) {
    console.error("Unable to load weather:", error);
    weatherCurrent.innerHTML = "";
    weatherForecast.innerHTML = "";
    weatherError.hidden = false;
  }
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createSpotlightCard(member) {
  const level = membershipNames[member.membershipLevel] || "Member";
  const card = document.createElement("article");
  card.className = "spotlight-card";

  const image = document.createElement("img");
  image.src = `images/members/${member.image}`;
  image.alt = `${member.name} business illustration`;
  image.width = 640;
  image.height = 360;
  image.loading = "lazy";

  const content = document.createElement("div");
  content.className = "spotlight-content";

  const heading = document.createElement("h3");
  heading.textContent = member.name;

  const badge = document.createElement("span");
  badge.className = `membership-badge ${level.toLowerCase()}`;
  badge.textContent = `${level} member`;

  const phone = document.createElement("p");
  const phoneLink = document.createElement("a");
  phoneLink.href = `tel:${member.phone.replace(/[^\d+]/g, "")}`;
  phoneLink.textContent = member.phone;
  phone.append("Phone: ", phoneLink);

  const address = document.createElement("p");
  address.textContent = member.address;

  const website = document.createElement("p");
  const siteLink = document.createElement("a");
  siteLink.href = member.website;
  siteLink.target = "_blank";
  siteLink.rel = "noopener noreferrer";
  siteLink.textContent = "Visit website";
  siteLink.setAttribute(
    "aria-label",
    `Visit ${member.name} website (opens in a new tab)`,
  );
  website.append(siteLink);

  content.append(heading, badge, phone, address, website);
  card.append(image, content);
  return card;
}

function displaySpotlights(members) {
  const eligible = members.filter(
    (member) => member.membershipLevel === 2 || member.membershipLevel === 3,
  );
  const selected = shuffle(eligible).slice(0, 3);

  if (selected.length === 0) {
    throw new Error("No gold or silver members available");
  }

  const fragment = document.createDocumentFragment();
  selected.forEach((member) => fragment.append(createSpotlightCard(member)));
  spotlights.replaceChildren(fragment);
  spotlights.setAttribute("aria-busy", "false");
}

async function loadSpotlights() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) {
      throw new Error(`Member request failed with status ${response.status}`);
    }

    const members = await response.json();
    if (!Array.isArray(members) || members.length === 0) {
      throw new Error("Member data is empty or invalid");
    }

    displaySpotlights(members);
  } catch (error) {
    console.error("Unable to load spotlights:", error);
    spotlights.setAttribute("aria-busy", "false");
    spotlightsError.hidden = false;
  }
}

loadWeather();
loadSpotlights();
