const form = document.getElementById("userForm");
const output = document.getElementById("output");
const userCountBadge = document.getElementById("userCount");

// Load data on page load
window.onload = () => {
  displayUsers();
};

// Save data
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();

  // Get existing users or initialize empty array
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Add new user with unique ID
  const newUser = {
    id: Date.now(),
    name,
    email,
    createdAt: new Date().toLocaleString()
  };

  users.push(newUser);

  // Save to localStorage
  localStorage.setItem("users", JSON.stringify(users));

  // Update display
  displayUsers();

  // Reset form
  form.reset();

  // Visual feedback
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.style.background = 'var(--success)';
  submitBtn.textContent = '✓ Saved!';
  
  setTimeout(() => {
    submitBtn.textContent = originalText;
    submitBtn.style.background = '';
  }, 2000);
});

// Display users in table
function displayUsers() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  
  userCountBadge.textContent = users.length;

  if (users.length === 0) {
    output.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p>No users saved yet</p>
        <small>Add your first user using the form above</small>
      </div>
    `;
    return;
  }

  output.innerHTML = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${users.map((user, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${user.name}</td>
              <td>${user.email}</td>
              <td>${user.createdAt}</td>
              <td>
                <div class="action-buttons">
                  <button class="btn-secondary btn-small" onclick="editUser(${user.id})">
                    Edit
                  </button>
                  <button class="btn-danger btn-small" onclick="deleteUser(${user.id})">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// Delete single user
function deleteUser(id) {
  if (!confirm('Are you sure you want to delete this user?')) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.filter(user => user.id !== id);
  localStorage.setItem("users", JSON.stringify(users));
  displayUsers();
}

// Edit user
function editUser(id) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.id === id);
  
  if (user) {
    document.getElementById("name").value = user.name;
    document.getElementById("email").value = user.email;
    
    // Delete the old entry
    deleteUser(id);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Clear all data
function clearAllData() {
  if (!confirm('Are you sure you want to delete ALL users? This cannot be undone.')) return;
  
  localStorage.removeItem("users");
  displayUsers();
}

// Clear form
function clearForm() {
  form.reset();
}