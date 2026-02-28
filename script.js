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

  fetch(API_URL + "?action=getPrograms")
    .then(response => response.json())
    .then(data => {
      if (data) {
        loadEvents(data);
      } else {
        alert("Failed to load programs.");
      }
    })
    .catch(error => {
      console.error("Error loading programs:", error);
      alert("Error connecting to server.");
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

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("name");
    const name = nameInput.value.trim();

    if (name === "") {
      alert("Please enter your name.");
      return;
    }

    const selectedEvents = [];
    const checkedBoxes = document.querySelectorAll("#eventsContainer input:checked");

    checkedBoxes.forEach(cb => {
      selectedEvents.push(cb.value);
    });

    if (selectedEvents.length === 0) {
      alert("Please select at least one event.");
      return;
    }

    console.log("Name:", name);
    console.log("Selected Events:", selectedEvents);

    alert("Registration captured (console only).");

    form.reset();
  });

});
