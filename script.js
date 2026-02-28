document.addEventListener("DOMContentLoaded", function () {

  const eventsContainer = document.getElementById("eventsContainer");
  const form = document.getElementById("registrationForm");

  // Temporary placeholder events
  // Later this will be replaced with API call
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

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const selectedEvents = [];

    const checkboxes = document.querySelectorAll("#eventsContainer input:checked");
    checkboxes.forEach(cb => {
      selectedEvents.push(cb.value);
    });

    console.log("Name:", name);
    console.log("Selected Events:", selectedEvents);

    alert("Form submitted (console log only for now)");
  });

});
