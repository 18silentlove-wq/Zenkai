(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  let selectedAnswer = null;
  let operation = "plus";
  let seconds = 20;

  document.querySelectorAll("[data-operation]").forEach((button) => {
    button.addEventListener("click", () => {
      operation = button.dataset.operation;
      document.querySelectorAll("[data-operation]").forEach((item) => item.classList.toggle("active", item === button));
      const equation = $("equation");
      equation.innerHTML = operation === "plus"
        ? "<span>12</span><i>＋</i><span>8</span><b>=</b><strong>?</strong>"
        : "<span>20</span><i>−</i><span>8</span><b>=</b><strong>?</strong>";
      clearAnswer();
    });
  });

  document.querySelectorAll("[data-time]").forEach((button) => {
    button.addEventListener("click", () => {
      seconds = Number(button.dataset.time);
      document.querySelectorAll("[data-time]").forEach((item) => item.classList.toggle("active", item === button));
      $("timerValue").textContent = seconds;
    });
  });

  document.querySelectorAll(".answer-option").forEach((button) => {
    button.addEventListener("click", () => {
      selectedAnswer = button.querySelector("strong").textContent;
      document.querySelectorAll(".answer-option").forEach((item) => item.classList.toggle("selected", item === button));
      $("lockAnswer").disabled = false;
      $("lockAnswer").innerHTML = "जवाब लॉक करें <span>→</span>";
    });
  });

  function clearAnswer() {
    selectedAnswer = null;
    document.querySelectorAll(".answer-option").forEach((item) => item.classList.remove("selected"));
    $("lockAnswer").disabled = true;
    $("lockAnswer").innerHTML = "जवाब चुनो <span>→</span>";
  }

  $("lockAnswer").addEventListener("click", () => {
    if (selectedAnswer === null) return;
    showToast("यह अभी UI प्रीव्यू है — गेम लॉजिक अगले चरण में जोड़ेंगे।");
  });

  $("helpBtn").addEventListener("click", () => $("helpDialog").showModal());
  $("closeHelp").addEventListener("click", () => $("helpDialog").close());
  $("gotIt").addEventListener("click", () => $("helpDialog").close());
  $("helpDialog").addEventListener("click", (event) => {
    if (event.target === $("helpDialog")) $("helpDialog").close();
  });

  let toastTimer;
  function showToast(message) {
    $("toast").textContent = message;
    $("toast").classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $("toast").classList.remove("show"), 2300);
  }
})();