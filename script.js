// Store users in localStorage with error handling
let users = [];
let editingIndex = -1;

// DOM elements
const userForm = document.getElementById('userForm');
const userTableBody = document.getElementById('userTableBody');
const submitButton = document.querySelector('#userForm button[type="submit"]');

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

// Function to validate user data
function validateUser(user) {
    if (!user.name || !user.email || !user.phone || !user.age) {
        return false;
    }
    if (isNaN(user.age) || user.age < 0) {
        return false;
    }
    return true;
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
                <button class="edit-btn" onclick="editUser(${index})">Edit</button>
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

// Function to edit user
function editUser(index) {
    editingIndex = index;
    const user = users[index];
    
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('phone').value = user.phone;
    document.getElementById('age').value = user.age;
    
    submitButton.textContent = 'Update';
}

// Function to cancel editing
function cancelEdit() {
    editingIndex = -1;
    userForm.reset();
    submitButton.textContent = 'Register';
}

// Handle form submission
userForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const user = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        age: document.getElementById('age').value
    };

    if (!validateUser(user)) {
        alert('Please fill all fields correctly.');
        return;
    }

    if (editingIndex === -1) {
        // Add new user
        users.push(user);
    } else {
        // Update existing user
        users[editingIndex] = user;
        editingIndex = -1;
        submitButton.textContent = 'Register';
    }

    // Save to localStorage
    if (saveUsers()) {
        // Render updated table
        renderUsers();
        // Reset form
        userForm.reset();
    }
});

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

// Age control functions
function incrementAge() {
    const ageInput = document.getElementById('age');
    ageInput.value = parseInt(ageInput.value || 0) + 1;
}

function decrementAge() {
    const ageInput = document.getElementById('age');
    const currentValue = parseInt(ageInput.value || 0);
    if (currentValue > 0) {
        ageInput.value = currentValue - 1;
    }
}

// Load users when the page loads
loadUsers();
// Initial render
renderUsers();