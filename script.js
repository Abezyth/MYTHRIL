// Store users in JSON file
let users = [];
let editingIndex = -1;

// DOM elements
const userForm = document.getElementById('userForm');
const submitButton = document.querySelector('#userForm button[type="submit"]');

// Check for edit parameter in URL
const urlParams = new URLSearchParams(window.location.search);
const editParam = urlParams.get('edit');
if (editParam !== null) {
    const index = parseInt(editParam);
    if (!isNaN(index)) {
        loadUsers();
        editUser(index);
    }
}

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
        // Reset form and redirect to users page
        userForm.reset();
        window.location.href = 'users.html';
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