document.addEventListener("DOMContentLoaded", function () {

  /* =========================
     SECTION SWITCHING
  ========================= */
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".card-section");
  navButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      navButtons.forEach(b => b.classList.remove("active"));
      sections.forEach(s => s.classList.remove("active"));
      this.classList.add("active");
      const target = document.getElementById(this.dataset.section);
      if (target) target.classList.add("active");
    });
  });

  /* =========================
     LOAD PROGRAMS
  ========================= */
  const API_URL = "https://script.google.com/macros/s/AKfycbzGbRp6YMCiYQv5PVgKwVnuQk24h2GymyVJ7dp4T3YhdkiY4miJHp1L6Ysg1_W0LKff/exec";
  const eventsContainer = document.getElementById("eventsContainer");
  const loadingOverlay = document.getElementById("loadingOverlay");

  function showLoading() { loadingOverlay.classList.remove("hidden"); }
  function hideLoading() { loadingOverlay.classList.add("hidden"); }

  showLoading();
  fetch(API_URL + "?action=getPrograms")
    .then(res => res.json())
    .then(data => {
      if (data.programs) loadEvents(data.programs);
      else console.error("Programs data missing:", data);
    })
    .catch(err => { console.error("Error loading programs:", err); alert("Error connecting to server."); })
    .finally(() => { hideLoading(); });

  function loadEvents(events) {
    eventsContainer.innerHTML = "";
    events.forEach(ev => {
      const label = document.createElement("label");
      label.className = "event-item";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "events";
      checkbox.value = ev;
      const span = document.createElement("span");
      span.textContent = ev;
      label.appendChild(checkbox);
      label.appendChild(span);
      eventsContainer.appendChild(label);
    });
  }

  /* =========================
     FORM SUBMISSION
  ========================= */
  const form = document.getElementById("registrationForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    if (!name) { alert("Please enter your name."); return; }

    const selectedEvents = Array.from(
      document.querySelectorAll("input[name='events']:checked")
    ).map(cb => cb.value);

    if (selectedEvents.length === 0) { alert("Please select at least one event."); return; }

    showLoading();

    // -----------------------------
    // Simple text/plain POST to bypass CORS
    // -----------------------------
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "register", name: name, events: selectedEvents })
    })
    .then(() => {
      alert("Registration successful!");
      form.reset();
    })
    .catch(err => {
      console.error("Submit error:", err);
      alert("Error submitting registration.");
    })
    .finally(() => { hideLoading(); });

  });

});
