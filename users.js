// Store users in localStorage with error handling
let users = [];

// DOM elements
const userTableBody = document.getElementById('userTableBody');

// Function to load users from localStorage with error handling
function loadUsers() {
    try {
        const storedUsers = localStorage.getItem('users');
        users = storedUsers ? JSON.parse(storedUsers) : [];
    } catch (error) {
        console.error('Error loading users from localStorage:', error);
        users = [];
    }
}

// Function to save users to localStorage with error handling
function saveUsers() {
    try {
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    } catch (error) {
        console.error('Error saving users to localStorage:', error);
        alert('Error saving data. Please try again.');
        return false;
    }
}

// Function to render users table
function renderUsers() {
    userTableBody.innerHTML = '';
    users.forEach((user, index) => {
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