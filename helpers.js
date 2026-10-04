// 3. HELPERS - small tools used by many files

function getEl(id) {
  return document.getElementById(id);
}

// Show a small message at the bottom of the screen
function showToast(message) {
  var toast = getEl("toast");
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(function () { toast.style.display = "none"; }, 2500);
}

// Make text safe before putting it inside HTML
function escapeHtml(text) {
  text = String(text);
  text = text.replace(/&/g, "&amp;");
  text = text.replace(/</g, "&lt;");
  text = text.replace(/>/g, "&gt;");
  text = text.replace(/"/g, "&quot;");
  return text;
}

// Distance in km between two saved locations (uses latitude and longitude)
function getDistance(nameA, nameB) {
  var a = findLocation(nameA);
  var b = findLocation(nameB);
  if (a === null || b === null) { return 0; }
  var toRad = Math.PI / 180;
  var dLat = (b.lat - a.lat) * toRad;
  var dLng = (b.lng - a.lng) * toRad;
  var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(a.lat * toRad) * Math.cos(b.lat * toRad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

// Milliseconds left before the food expires
function timeLeft(item) {
  return item.exp - Date.now();
}

// Turn milliseconds into text like "2h 10m left"
function formatTime(ms) {
  if (ms <= 0) { return "Expired"; }
  var minutes = Math.floor(ms / 60000);
  if (minutes < 60) { return minutes + " min left"; }
  var hours = Math.floor(minutes / 60);
  if (hours < 48) { return hours + "h " + (minutes % 60) + "m left"; }
  return Math.floor(hours / 24) + " days left";
}

// Coloured label showing how long the food stays fresh
function getExpiryTag(item) {
  if (item.status !== "available") { return ""; }
  var left = timeLeft(item);
  if (left <= 0) { return '<span class="tag bad">Expired</span>'; }
  if (left <= 3 * HOUR) { return '<span class="tag warn">Warning: ' + formatTime(left) + '</span>'; }
  return '<span class="tag">' + formatTime(left) + '</span>';
}
