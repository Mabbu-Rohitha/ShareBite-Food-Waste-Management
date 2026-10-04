// 5. DONORS - create account, login, logout

var authMode = "login";     // "login" or "register"
var lastFilledEmail = "";   // remembers whose details we already put in the donate form

// Scramble the password a little before saving (demo only, not real security)
function hashPassword(text) {
  var h = 5381;
  for (var i = 0; i < text.length; i++) {
    h = (h * 33 + text.charCodeAt(i)) % 4294967296;
  }
  return h.toString(16);
}

// Find the donor who is logged in (or null)
function findDonor() {
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === loggedInEmail) { return users[i]; }
  }
  return null;
}

// Show either the login box or the donation form
function showDonorPage() {
  var donor = findDonor();
  if (donor === null) {
    getEl("loginBox").style.display = "block";
    getEl("donateBox").style.display = "none";
    lastFilledEmail = "";
  } else {
    getEl("loginBox").style.display = "none";
    getEl("donateBox").style.display = "block";
    getEl("who").textContent = "Logged in as " + donor.name;
    if (lastFilledEmail !== donor.email) {   // fill phone and area only once
      var form = getEl("donateForm");
      form.elements["contact"].value = donor.phone || donor.email;
      if (donor.darea) { form.elements["area"].value = donor.darea; }
      lastFilledEmail = donor.email;
    }
  }
}

// Switch between the Login tab and the Create account tab
function setMode(mode) {
  authMode = mode;
  var extraFields = document.querySelectorAll(".regOnly");
  for (var i = 0; i < extraFields.length; i++) {
    extraFields[i].style.display = (mode === "register") ? "flex" : "none";
  }
  if (mode === "register") {
    getEl("authBtn").textContent = "Create account";
    getEl("tabLogin").className = "btn sec";
    getEl("tabReg").className = "btn";
  } else {
    getEl("authBtn").textContent = "Login";
    getEl("tabLogin").className = "btn";
    getEl("tabReg").className = "btn sec";
  }
  getEl("authMsg").textContent = "";
}

// Start a login session for a donor
function startSession(donor) {
  loggedInEmail = donor.email;
  myName = donor.name;
  getEl("meName").value = myName;
  saveData();
  showAll();
}

function logoutDonor() {
  loggedInEmail = "";
  saveData();
  showAll();
  showToast("Logged out");
}

// Runs when the login / register form is submitted
function handleAuthSubmit(event) {
  event.preventDefault();
  var form = getEl("authForm");
  var email = form.elements["email"].value.trim().toLowerCase();
  var password = hashPassword(form.elements["pass"].value);

  var existing = null;
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === email) { existing = users[i]; }
  }

  if (authMode === "register") {
    var name = form.elements["name"].value.trim();
    if (name === "") { getEl("authMsg").textContent = "Please enter your name or organization."; return; }
    if (existing !== null) { getEl("authMsg").textContent = "This email is already registered. Please log in."; return; }
    var newDonor = {
      email: email, name: name, pass: password,
      phone: form.elements["phone"].value.trim(),
      dtype: form.elements["dtype"].value,
      darea: form.elements["darea"].value,
      address: form.elements["address"].value.trim(),
      joined: Date.now()
    };
    users.push(newDonor);
    form.reset();
    startSession(newDonor);
    showToast("Account created. Welcome, " + name + "!");
  } else {
    if (existing === null || existing.pass !== password) {
      getEl("authMsg").textContent = "Wrong email or password.";
      return;
    }
    form.reset();
    startSession(existing);
    showToast("Welcome back, " + existing.name + "!");
  }
}

// Connect the buttons to the functions above
function initDonors() {
  getEl("tabLogin").addEventListener("click", function () { setMode("login"); });
  getEl("tabReg").addEventListener("click", function () { setMode("register"); });
  getEl("logout").addEventListener("click", logoutDonor);
  getEl("authForm").addEventListener("submit", handleAuthSubmit);
}
