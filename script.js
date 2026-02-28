document.addEventListener("DOMContentLoaded", function () {

  /* =========================
     SECTION SWITCHING (SPA)
  ========================= */

  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".card-section");

  navButtons.forEach(button => {
    button.addEventListener("click", function () {

      navButtons.forEach(btn => btn.classList.remove("active"));
      sections.forEach(section => section.classList.remove("active"));

      this.classList.add("active");

      const targetSection = document.getElementById(this.dataset.section);
      if (targetSection) {
        targetSection.classList.add("active");
      }

    });
  });


  /* =========================
     LOAD EVENTS FROM API
  ========================= */

  const eventsContainer = document.getElementById("eventsContainer");

  const API_URL = "https://script.google.com/macros/s/AKfycbxe2gaYlTFS9Oqmo0rmJ5UJ3BGSA95BWeHPAw9n7UV0AJky5Q0hKPzcN3o-HumTrqq-/exec";

const loadingOverlay = document.getElementById("loadingOverlay");

loadingOverlay.classList.remove("hidden");

fetch(API_URL + "?action=getPrograms")
  .then(response => response.json())
  .then(data => {
    loadEvents(data);
  })
  .catch(error => {
    console.error("Error loading programs:", error);
    alert("Error connecting to server.");
  })
  .finally(() => {
    loadingOverlay.classList.add("hidden");
  });


  function loadEvents(events) {
    eventsContainer.innerHTML = "";

    events.forEach(event => {
      const label = document.createElement("label");
      label.className = "event-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = event;

      const span = document.createElement("span");
      span.textContent = event;

      label.appendChild(checkbox);
      label.appendChild(span);

      eventsContainer.appendChild(label);
    });
  }


  /* =========================
     FORM SUBMISSION
  ========================= */

const form = document.getElementById("registrationForm");
const loadingOverlay = document.getElementById("loadingOverlay");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get name
  const name = document.getElementById("name").value.trim();

  // Get selected events (checkboxes)
  const selectedEvents = Array.from(
    document.querySelectorAll("input[name='events']:checked")
  ).map(el => el.value);

  // Validation
  if (!name) {
    alert("Please enter your name.");
    return;
  }

  if (selectedEvents.length === 0) {
    alert("Please select at least one event.");
    return;
  }

  // Show loading overlay
  loadingOverlay.classList.remove("hidden");

  const formData = {
    name: name,
    events: selectedEvents
  };

  fetch(API_URL + "?action=register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Registration successful!");
        form.reset();
      } else {
        alert("Registration failed.");
      }
    })
    .catch(error => {
      console.error("Error submitting:", error);
      alert("Error connecting to server.");
    })
    .finally(() => {
      loadingOverlay.classList.add("hidden");
    });
});

});
