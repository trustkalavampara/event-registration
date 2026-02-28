document.addEventListener("DOMContentLoaded", function () {

  /* =========================
     SECTION SWITCHING (SPA)
  ========================= */

  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".card-section");

  navButtons.forEach(button => {
    button.addEventListener("click", function () {

      // Remove active class from all buttons
      navButtons.forEach(btn => btn.classList.remove("active"));

      // Hide all sections
      sections.forEach(section => section.classList.remove("active"));

      // Activate clicked button
      this.classList.add("active");

      // Show corresponding section
      const targetSection = document.getElementById(this.dataset.section);
      if (targetSection) {
        targetSection.classList.add("active");
      }

    });
  });


  /* =========================
     LOAD EVENTS (TEMP DATA)
     Will be replaced by API
  ========================= */

  const eventsContainer = document.getElementById("eventsContainer");

  const sampleEvents = [
    "പാട്ട്",
    "കവിത",
    "ഡാൻസ്",
    "ക്വിസ്",
    "ബോൾ പാസിംഗ്"
  ];

  loadEvents(sampleEvents);

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
     (Console only for now)
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

    // Optional reset
    form.reset();
  });


});
