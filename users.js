// Store users in localStorage with error handling
let users = [];

// DOM elements
const userTableBody = document.getElementById('userTableBody');

// Function to load users from JSON file
async function loadUsers() {
    try {
        const response = await fetch('data.json');
        users = await response.json();
    } catch (error) {
        console.error('Error loading users from JSON file:', error);
        users = [];
    }
}

// Function to save users to JSON file
async function saveUsers() {
    try {
        const response = await fetch('data.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(users)
        });
        return response.ok;
    } catch (error) {
        console.error('Error saving users to JSON file:', error);
        alert('Error saving data. Please try again.');
        return false;
    }
}

// Search and filter functionality
const searchInput = document.getElementById('searchInput');
const filterCategory = document.getElementById('filterCategory');
const ageFilterContainer = document.getElementById('ageFilterContainer');
const ageFilter = document.getElementById('ageFilter');

// Filter event listeners
searchInput.addEventListener('input', filterUsers);
filterCategory.addEventListener('change', handleCategoryChange);
ageFilter.addEventListener('change', filterUsers);

function handleCategoryChange() {
    ageFilterContainer.style.display = filterCategory.value === 'age' ? 'block' : 'none';
    filterUsers();
}

function filterUsers() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = filterCategory.value;
    const ageRange = ageFilter.value;

    const filteredUsers = users.filter(user => {
        // Apply search filter
        if (category === 'all') {
            return Object.values(user).some(value => 
                value.toString().toLowerCase().includes(searchTerm)
            );
        } else if (category === 'age' && ageRange !== 'all') {
            // Apply age range filter
            const age = parseInt(user.age);
            const [min, max] = ageRange === '51+' ? [51, Infinity] : 
                                ageRange.split('-').map(num => parseInt(num));
            return age >= min && age <= max;
        } else {
            // Apply category-specific filter
            return user[category].toString().toLowerCase().includes(searchTerm);
        }
    });

    renderFilteredUsers(filteredUsers);
}

function renderFilteredUsers(filteredUsers) {
    userTableBody.innerHTML = '';
    filteredUsers.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.age}</td>
            <td>
                <button class="edit-btn" onclick="window.location.href='index.html?edit=' + ${index}">Edit</button>
                <button class="delete-btn" onclick="deleteUser(${index})">Delete</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

// Function to delete user
function deleteUser(index) {
    if (confirm('Are you sure you want to delete this user?')) {
        users.splice(index, 1);
        if (saveUsers()) {
            renderUsers();
        }
    }
}

// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.material-icons');

// Check for saved theme preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    themeIcon.textContent = 'light_mode';
}

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    themeIcon.textContent = isDarkMode ? 'light_mode' : 'dark_mode';
});

// Load users when the page loads
loadUsers();
// Initial render
renderUsers();