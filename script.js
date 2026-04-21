const TRAVEL_DATE = "2026-09-12T00:00:00";

const welcomeScreen = document.getElementById("welcome-screen");
const mapScreen = document.getElementById("map-screen");
const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("traveler-name");
const greeting = document.getElementById("greeting");
const countdown = document.getElementById("countdown");

let countdownInterval;

function sanitizeName(value) {
  return value.replace(/\s+/g, " ").trim();
}

function daysUntilTrip() {
  const now = new Date();
  const target = new Date(TRAVEL_DATE);
  const diffMs = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

function updateCountdown() {
  const remainingDays = daysUntilTrip();
  const suffix = remainingDays === 1 ? "day" : "days";
  countdown.textContent = `${remainingDays} ${suffix} until Italy 🇮🇹`;
}

function showMapWithName(name) {
  greeting.textContent = `Hi, ${name}`;
  updateCountdown();

  if (countdownInterval) {
    window.clearInterval(countdownInterval);
  }

  countdownInterval = window.setInterval(updateCountdown, 60000);

  welcomeScreen.classList.remove("screen-active");
  mapScreen.classList.add("screen-active");
}

nameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const enteredName = sanitizeName(nameInput.value);

  if (!enteredName) {
    nameInput.focus();
    return;
  }

  localStorage.setItem("italyTravelerName", enteredName);
  showMapWithName(enteredName);
});

window.addEventListener("load", () => {
  const savedName = sanitizeName(localStorage.getItem("italyTravelerName") || "");

  if (savedName) {
    showMapWithName(savedName);
  } else {
    nameInput.focus();
  }
});
