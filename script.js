const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzGbRp6YMCiYQv5PVgKwVnuQk24h2GymyVJ7dp4T3YhdkiY4miJHp1L6Ysg1_W0LKff/exec";

// Elements
const loadingOverlay = document.getElementById('loadingOverlay');
const eventsContainer = document.getElementById('eventsContainer');
const registrationForm = document.getElementById('registrationForm');
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.card-section');

// --- 1. INITIALIZE: FETCH PROGRAMS ---
window.addEventListener('DOMContentLoaded', () => {
    fetchPrograms();
});

async function fetchPrograms() {
    showLoading(true);
    try {
        const response = await fetch(WEB_APP_URL);
        const programs = await response.json();
        renderCheckboxes(programs);
    } catch (error) {
        console.error("Error fetching programs:", error);
        eventsContainer.innerHTML = "<p style='color:red;'>Failed to load programs. Please refresh.</p>";
    } finally {
        showLoading(false);
    }
}

function renderCheckboxes(programs) {
    eventsContainer.innerHTML = ""; // Clear
    programs.forEach(program => {
        const div = document.createElement('label');
        div.className = 'event-item';
        div.innerHTML = `
            <input type="checkbox" name="events" value="${program}">
            <span>${program}</span>
        `;
        eventsContainer.appendChild(div);
    });
}

// --- 2. NAVIGATION LOGIC ---
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-section');
        
        // Update Buttons
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update Sections
        sections.forEach(sec => {
            sec.classList.remove('active');
            if (sec.id === target) sec.classList.add('active');
        });
    });
});

// --- 3. FORM SUBMISSION ---
registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(registrationForm);
    const name = formData.get('name');
    const selectedEvents = formData.getAll('events');

    if (selectedEvents.length === 0) {
        alert("Please select at least one program.");
        return;
    }

    const payload = {
        name: name,
        events: selectedEvents
    };

    showLoading(true);

    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (result.status === "success") {
            alert("Registration successful!");
            registrationForm.reset();
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Submission error:", error);
        alert("Network error. Please try again.");
    } finally {
        showLoading(false);
    }
});

// --- HELPERS ---
function showLoading(show) {
    if (show) {
        loadingOverlay.classList.remove('hidden');
        document.body.classList.add('loading');
    } else {
        loadingOverlay.classList.add('hidden');
        document.body.classList.remove('loading');
    }
}


// --- 4. VIEW DATA (Registrations & Participants) ---

// Update the navigation listener to fetch data when switching tabs
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-section');
        
        // ... (your existing active class toggle logic) ...

        if (target === 'registrations') fetchTableData('registrations');
        if (target === 'participants') fetchTableData('participants');
    });
});

function renderCards(container, data, type) {
    container.innerHTML = ""; // Clear
    
    if (data.length < 2) {
        container.innerHTML = "<p>No data available yet.</p>";
        return;
    }

    const headers = data[0];
    const rows = data.slice(1);

    if (type === 'registrations') {
        // STYLE: One card per person
        rows.forEach(row => {
            const card = document.createElement('div');
            card.className = 'data-card';
            
            // Format: Name at top, then list of events
            const name = row[1];
            const events = row.slice(2).filter(e => e !== ""); // Get selected events
            
            card.innerHTML = `
                <div class="card-header">${name}</div>
                <div class="card-body">
                    <small>Selected Events:</small>
                    <div class="tag-container">
                        ${events.map(e => `<span class="tag">${e}</span>`).join('')}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } else {
        // STYLE: One card per Event (Participants view)
        headers.forEach((eventName, index) => {
            const participants = rows.map(row => row[index]).filter(p => p !== "");
            
            const card = document.createElement('div');
            card.className = 'data-card';
            card.innerHTML = `
                <div class="card-header event-title">${eventName}</div>
                <div class="card-body">
                    <div class="participant-list">
                        ${participants.length > 0 
                            ? participants.map(p => `<div class="p-name">${p}</div>`).join('') 
                            : '<span style="color:#999">No participants yet</span>'}
                    </div>
                    <div class="count-badge">${participants.length} Total</div>
                </div>
            `;
            container.appendChild(card);
        });
    }
}

// Update your fetchTableData to call renderCards
async function fetchTableData(type) {
    const container = document.getElementById(`${type}Container`);
    container.innerHTML = "<div class='loading-spinner'>Updating...</div>";

    try {
        const response = await fetch(`${WEB_APP_URL}?view=${type}`);
        const data = await response.json();
        renderCards(container, data, type);
    } catch (error) {
        container.innerHTML = "<p style='color:red;'>Failed to load. Check connection.</p>";
    }
}
