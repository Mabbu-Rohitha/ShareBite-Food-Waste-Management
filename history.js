// 8. HISTORY - donor details and donation history

// Build a simple table from a list of headings and rows
function makeTable(headings, rows) {
  if (rows.length === 0) { return '<p class="muted">Nothing here yet.</p>'; }
  var html = "<table><tr>";
  for (var i = 0; i < headings.length; i++) { html = html + "<th>" + headings[i] + "</th>"; }
  html = html + "</tr>" + rows.join("") + "</table>";
  return html;
}

function showHistory() {
  var donor = findDonor();

  // Donor details
  if (donor === null) {
    getEl("hProfile").innerHTML = '<p class="muted">Log in as a donor to see your saved details.</p>';
    getEl("hPosted").innerHTML = '<p class="muted">Log in as a donor (Donate Food tab) to see your donations.</p>';
  } else {
    var joined = donor.joined ? new Date(donor.joined).toLocaleDateString() : "-";
    getEl("hProfile").innerHTML = "<table>" +
      "<tr><th>Name</th><td>" + escapeHtml(donor.name) + "</td></tr>" +
      "<tr><th>Email</th><td>" + escapeHtml(donor.email) + "</td></tr>" +
      "<tr><th>Phone</th><td>" + escapeHtml(donor.phone || "-") + "</td></tr>" +
      "<tr><th>Donor type</th><td>" + escapeHtml(donor.dtype || "-") + "</td></tr>" +
      "<tr><th>Pickup area</th><td>" + escapeHtml(donor.darea || "-") + "</td></tr>" +
      "<tr><th>Address</th><td>" + escapeHtml(donor.address || "-") + "</td></tr>" +
      "<tr><th>Joined</th><td>" + joined + "</td></tr></table>";

    // Donations posted by this donor
    var postedRows = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.donor === donor.name) {
        var status = "Available";
        if (item.status === "claimed") { status = "Claimed by " + escapeHtml(item.claimedBy); }
        else if (timeLeft(item) <= 0) { status = "Expired"; }
        postedRows.push("<tr><td>" + escapeHtml(item.title) + "</td><td>" + item.kg + " kg</td><td>" +
          new Date(item.created).toLocaleString() + "</td><td>" + status + "</td></tr>");
      }
    }
    getEl("hPosted").innerHTML = makeTable(["Item", "Qty", "Posted", "Status"], postedRows);
  }

  // Food claimed by the name in the top bar
  if (myName === "") {
    getEl("hClaimed").innerHTML = '<p class="muted">Enter your name or organization at the top to see food you claimed.</p>';
  } else {
    var claimedRows = [];
    for (var j = 0; j < items.length; j++) {
      var c = items[j];
      if (c.claimedBy === myName) {
        claimedRows.push("<tr><td>" + escapeHtml(c.title) + "</td><td>" + c.kg + " kg</td><td>" +
          escapeHtml(c.donor) + "</td><td>" + new Date(c.claimedAt).toLocaleString() + "</td></tr>");
      }
    }
    getEl("hClaimed").innerHTML = makeTable(["Item", "Qty", "From", "Claimed on"], claimedRows);
  }
}

function initHistory() {
  getEl("reset").addEventListener("click", function () {
    items = getSampleItems();     // donor accounts are kept
    saveData();
    showAll();
    showToast("Demo data reset");
  });
}
