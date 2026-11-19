(() => {
  "use strict";
  const COLORS = ["coral", "cyan", "violet", "lime", "amber", "blue"];
  const MAX_TURNS = 10;
  const $ = (id) => document.getElementById(id);
  let secret = [];
  let selection = [];
  let turn = 0;
  let finished = false;
  let wins = 0;
  let streak = 0;
  let best = null;
  let toastTimer;

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function startGame() {
    secret = shuffle(COLORS).slice(0, 4);
    selection = [];
    turn = 0;
    finished = false;
    $("history").innerHTML = '<div class="empty-state" id="emptyState"><span class="empty-symbol">⌁</span><span>Your attempts will appear here.</span><small>Choose four different colours below.</small></div>';
    $("secretSlots").innerHTML = '<span class="secret-slot">?</span><span class="secret-slot">?</span><span class="secret-slot">?</span><span class="secret-slot">?</span>';
    $("secretHint").textContent = "Crack the 4-colour sequence";
    $("secretHint").style.color = "";
    updateStats();
    renderSelection();
    renderPalette();
    $("submitButton").disabled = true;
    const banner = document.querySelector(".result-banner");
    if (banner) banner.remove();
  }

  function updateStats() {
    $("attemptsStat").textContent = turn + "/" + MAX_TURNS;
    $("bestStat").textContent = best === null ? "—" : best + "/10";
    $("streakStat").textContent = streak;
  }

  function renderPalette() {
    document.querySelectorAll(".color-choice").forEach((button) => {
      const color = button.dataset.color;
      button.disabled = finished || selection.includes(color);
      button.classList.toggle("active", selection.includes(color));
      button.setAttribute("aria-pressed", String(selection.includes(color)));
    });
  }

  function renderSelection() {
    $("selectionText").textContent = "Select 4 colours · " + selection.length + "/4";
    document.querySelectorAll(".selected-slot").forEach((button, index) => {
      const color = selection[index];
      button.className = "selected-slot" + (color ? " filled c-" + color : "");
      button.textContent = color ? "" : "+";
      button.setAttribute("aria-label", color ? "Remove " + color + " from slot " + (index + 1) : "Empty slot " + (index + 1));
    });
    $("submitButton").disabled = selection.length !== 4 || finished;
    renderPalette();
  }

  function addColor(color) {
    if (finished || selection.length >= 4 || selection.includes(color)) return;
    selection.push(color);
    renderSelection();
  }

  function removeColor(index) {
    if (finished || !selection[index]) return;
    selection.splice(index, 1);
    renderSelection();
  }

  function getFeedback(guess) {
    let exact = 0;
    for (let i = 0; i < 4; i++) if (guess[i] === secret[i]) exact++;
    const common = guess.filter((color) => secret.includes(color)).length;
    return { exact, close: common - exact };
  }

  function submitGuess() {
    if (finished || selection.length !== 4) return;
    const guess = [...selection];
    const feedback = getFeedback(guess);
    turn++;
    $("emptyState")?.remove();

    const row = document.createElement("div");
    row.className = "guess-row";
    const colors = document.createElement("div");
    colors.className = "guess-colors";
    const number = document.createElement("span");
    number.className = "guess-number";
    number.textContent = String(turn).padStart(2, "0");
    colors.appendChild(number);
    guess.forEach((color) => {
      const peg = document.createElement("span");
      peg.className = "mini-peg c-" + color;
      peg.setAttribute("aria-label", color);
      colors.appendChild(peg);
    });
    const markers = document.createElement("div");
    markers.className = "feedback";
    for (let i = 0; i < feedback.exact; i++) {
      const dot = document.createElement("span");
      dot.className = "feedback-dot exact";
      dot.title = "Correct colour and position";
      markers.appendChild(dot);
    }
    for (let i = 0; i < feedback.close; i++) {
      const dot = document.createElement("span");
      dot.className = "feedback-dot close";
      dot.title = "Correct colour, different position";
      markers.appendChild(dot);
    }
    for (let i = feedback.exact + feedback.close; i < 4; i++) {
      const dot = document.createElement("span");
      dot.className = "feedback-dot miss";
      dot.title = "No match";
      markers.appendChild(dot);
    }
    row.append(colors, markers);
    $("history").prepend(row);
    selection = [];
    updateStats();
    renderSelection();

    if (feedback.exact === 4) {
      finished = true;
      wins++;
      streak++;
      best = best === null ? turn : Math.min(best, turn);
      revealSecret("Code cracked in " + turn + (turn === 1 ? " attempt!" : " attempts!"));
      showBanner("MISSION COMPLETE — Brilliant deduction!", true);
      showToast("You cracked the code!");
    } else if (turn >= MAX_TURNS) {
      finished = true;
      streak = 0;
      revealSecret("The code was revealed");
      showBanner("OUT OF ATTEMPTS — Try another round.", false);
      showToast("New code generated. Keep practising!");
    } else {
      showToast(feedback.exact + " exact · " + feedback.close + " colour match" + (feedback.close === 1 ? "" : "es"));
    }
    updateStats();
    renderSelection();
  }

  function revealSecret(message) {
    $("secretSlots").innerHTML = "";
    secret.forEach((color) => {
      const slot = document.createElement("span");
      slot.className = "secret-slot filled c-" + color;
      slot.setAttribute("aria-label", color);
      $("secretSlots").appendChild(slot);
    });
    $("secretHint").textContent = message;
    $("secretHint").style.color = "#9cf0cd";
  }

  function showBanner(message, won) {
    const banner = document.createElement("div");
    banner.className = "result-banner " + (won ? "win-banner" : "lose-banner");
    banner.textContent = message;
    $("history").prepend(banner);
  }

  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2100);
  }

  document.querySelectorAll(".color-choice").forEach((button) => {
    button.addEventListener("click", () => addColor(button.dataset.color));
  });
  document.querySelectorAll(".selected-slot").forEach((button) => {
    button.addEventListener("click", () => removeColor(Number(button.dataset.slot)));
  });
  $("submitButton").addEventListener("click", submitGuess);
  $("clearButton").addEventListener("click", () => {
    selection = [];
    renderSelection();
  });
  $("newGameButton").addEventListener("click", startGame);
  $("helpButton").addEventListener("click", () => $("helpDialog").showModal());
  $("closeHelp").addEventListener("click", () => $("helpDialog").close());
  $("gotItButton").addEventListener("click", () => $("helpDialog").close());
  $("helpDialog").addEventListener("click", (event) => {
    if (event.target === $("helpDialog")) $("helpDialog").close();
  });

  startGame();
})();