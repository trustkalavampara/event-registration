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
    
    // If data is empty or only contains one empty row
    if (!data || data.length === 0 || (data.length === 1 && data[0][0] === "")) {
        container.innerHTML = "<p style='text-align:center; color:#888;'>No registrations found yet.</p>";
        return;
    }

    if (type === 'registrations') {
        // Since there is NO header, we process every row starting from index 0
        data.forEach(row => {
            // Check if row has a name (Column B / Index 1)
            const name = row[1];
            if (!name) return; // Skip empty rows

            // Collect all events from Column C (Index 2) onwards
            const events = row.slice(2).filter(e => e && e.toString().trim() !== "");

            const card = document.createElement('div');
            card.className = 'data-card';
            
            card.innerHTML = `
                <div class="card-header">${name}</div>
                <div class="card-body">
                    <div class="registration-meta">
                        <small>Registered on: ${formatDate(row[0])}</small>
                    </div>
                    <div class="tag-container">
                        ${events.map(e => `<span class="tag">${e}</span>`).join('')}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } else {
        // Participants logic remains the same (mapping by Program names)
        renderParticipantsCards(container, data);
    }
}

// Helper to format the Google Sheets Date string
function formatDate(dateValue) {
    if (!dateValue) return "N/A";
    const d = new Date(dateValue);
    return isNaN(d.getTime()) ? dateValue : d.toLocaleDateString() + " " + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
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
