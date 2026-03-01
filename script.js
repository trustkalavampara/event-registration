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

async function fetchTableData(type) {
    const container = document.getElementById(`${type}Container`);
    container.innerHTML = "<p>Loading data...</p>";

    try {
        // We add a query parameter ?view=registrations or ?view=participants
        const response = await fetch(`${WEB_APP_URL}?view=${type}`);
        const data = await response.json();

        if (data.length === 0) {
            container.innerHTML = "<p>No data found.</p>";
            return;
        }

        renderTable(container, data);
    } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        container.innerHTML = "<p style='color:red;'>Failed to load data.</p>";
    }
}

function renderTable(container, data) {
    let html = '<div style="overflow-x:auto;"><table class="data-table">';
    
    // Create Headers
    html += '<thead><tr>';
    data[0].forEach(header => {
        html += `<th>${header}</th>`;
    });
    html += '</tr></thead>';

    // Create Rows
    html += '<tbody>';
    for (let i = 1; i < data.length; i++) {
        html += '<tr>';
        data[i].forEach(cell => {
            // Format timestamp if it's the first column of Registrations
            const value = (typeof cell === 'string' && cell.includes('T') && !isNaN(Date.parse(cell))) 
                          ? new Date(cell).toLocaleDateString() 
                          : cell;
            html += `<td>${value || ''}</td>`;
        });
        html += '</tr>';
    }
    html += '</tbody></table></div>';
    
    container.innerHTML = html;
}
