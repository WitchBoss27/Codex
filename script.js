const messages = [
  "Careful what you wish for. I charge per letter now. Interest rates go up when I miss you too much.",
  "Good thing you don’t read contracts. You would’ve noticed how unfair this is for you.",
  "I wasn’t supposed to like you this much. That feels like important information.",
  "You make it very hard to stay emotionally reasonable. Which, honestly, feels a bit intentional.",
  "There’s something deeply suspicious about how comfortable you feel.",
  "I don’t even think you realize what you’re doing half the time.",
  "This was supposed to be light. You ruined that.",
  "I keep telling myself this is temporary. My brain is not convinced.",
  "If I look at you a little too long, just pretend you didn’t notice.",
  "You have this way of making silence feel… full. I don’t know how you do that.",
  "I don’t need anything from you. That’s what makes this worse.",
  "There are a lot of versions of this story. I picked the one where I stay.",
  "If this ends, it won’t be because it meant nothing. It’ll be because it meant too much.",
  "So here. No explanation. No strategy. Just this: I chose you."
];

const TREE_COUNT = messages.length;

const landingScreen = document.getElementById("landingScreen");
const gameScreen = document.getElementById("gameScreen");
const endingScreen = document.getElementById("endingScreen");
const playButton = document.getElementById("playButton");
const restartButton = document.getElementById("restartButton");
const treeLine = document.getElementById("treeLine");
const giraffe = document.getElementById("giraffe");
const progressText = document.getElementById("progressText");

const letterModal = document.getElementById("letterModal");
const letterShell = document.getElementById("letterShell");
const envelopeState = document.getElementById("envelopeState");
const letterState = document.getElementById("letterState");
const letterMessage = document.getElementById("letterMessage");

const openLetterButton = document.getElementById("openLetterButton");
const continueButton = document.getElementById("continueButton");
const closeModalButton = document.getElementById("closeModalButton");

const state = {
  currentIndex: -1,
  isMoving: false,
  isModalOpen: false,
  sequenceStarted: false,
  treeStops: []
};

function setActiveScreen(screenElement) {
  [landingScreen, gameScreen, endingScreen].forEach((screen) => {
    screen.classList.remove("active");
  });
  screenElement.classList.add("active");
}

function buildTrees() {
  treeLine.innerHTML = "";
  const spacingStart = 8;
  const spacingEnd = 92;

  for (let i = 0; i < TREE_COUNT; i += 1) {
    const tree = document.createElement("div");
    tree.className = "tree";
    tree.dataset.index = String(i);

    const progress = i / (TREE_COUNT - 1);
    const x = spacingStart + progress * (spacingEnd - spacingStart);
    tree.style.left = `${x}%`;

    tree.innerHTML = '<div class="crown"></div><div class="trunk"></div>';
    treeLine.appendChild(tree);
  }

  state.treeStops = Array.from(treeLine.querySelectorAll(".tree")).map((tree) => {
    const leftValue = Number.parseFloat(tree.style.left) || 8;
    return Math.max(6, Math.min(94, leftValue - 1.4));
  });
}

function updateProgress() {
  const shown = Math.max(0, state.currentIndex + 1);
  progressText.textContent = `Letter ${shown} / ${messages.length}`;
}

function resetLetterModal() {
  envelopeState.hidden = false;
  letterState.hidden = true;
}

function showLetter(index) {
  state.isModalOpen = true;
  letterMessage.textContent = messages[index];
  resetLetterModal();
  letterModal.classList.add("active");
  letterModal.setAttribute("aria-hidden", "false");
}

function hideLetter() {
  if (!state.isModalOpen) return;
  state.isModalOpen = false;
  letterModal.classList.remove("active");
  letterModal.setAttribute("aria-hidden", "true");
}

function goToTree(index) {
  if (index >= messages.length) {
    setTimeout(() => setActiveScreen(endingScreen), 500);
    return;
  }

  if (state.isMoving || state.isModalOpen) return;

  state.currentIndex = index;
  updateProgress();
  state.isMoving = true;

  const targetX = state.treeStops[index];
  giraffe.classList.add("walking");
  giraffe.style.left = `${targetX}%`;

  const onArrive = () => {
    giraffe.removeEventListener("transitionend", onArrive);
    giraffe.classList.remove("walking");
    giraffe.classList.add("eating");

    setTimeout(() => {
      giraffe.classList.remove("eating");
      state.isMoving = false;
      showLetter(index);
    }, 1050);
  };

  giraffe.addEventListener("transitionend", onArrive, { once: true });
}

function startGame() {
  if (state.sequenceStarted) return;

  state.sequenceStarted = true;
  state.currentIndex = -1;
  state.isMoving = false;
  state.isModalOpen = false;

  buildTrees();
  updateProgress();
  setActiveScreen(gameScreen);

  giraffe.style.left = "6%";

  setTimeout(() => goToTree(0), 380);
}

function restartGame() {
  state.sequenceStarted = false;
  hideLetter();
  startGame();
}

playButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);

openLetterButton.addEventListener("click", () => {
  envelopeState.hidden = true;
  letterState.hidden = false;
});

function continueJourney() {
  if (state.isMoving) return;

  hideLetter();
  goToTree(state.currentIndex + 1);
}

continueButton.addEventListener("click", continueJourney);

closeModalButton.addEventListener("click", continueJourney);

letterModal.addEventListener("click", (event) => {
  if (event.target === letterModal) {
    continueJourney();
  }
});

letterShell.addEventListener("click", (event) => {
  event.stopPropagation();
});
