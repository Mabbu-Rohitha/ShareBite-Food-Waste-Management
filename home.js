// 4. HOME - perishable alerts and statistics

// Warn about food that expires within 3 hours
function showAlerts() {
  var names = [];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var left = timeLeft(item);
    if (item.status === "available" && left > 0 && left <= 3 * HOUR) {
      names.push(escapeHtml(item.title) + " (" + formatTime(left) + ")");
    }
  }
  if (names.length > 0) {
    getEl("alerts").innerHTML = '<div class="alert"><b>Perishable alert:</b> ' + names.join(", ") + " - claim quickly!</div>";
  } else {
    getEl("alerts").innerHTML = "";
  }
}

// Count food available, claimed, kg and meals
function showStats() {
  var available = 0;
  var claimed = 0;
  var kg = 0;
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.status === "available" && timeLeft(item) > 0) { available = available + 1; }
    if (item.status === "claimed") {
      claimed = claimed + 1;
      kg = kg + Number(item.kg);
    }
  }
  getEl("sAvail").textContent = available;
  getEl("sClaimed").textContent = claimed;
  getEl("sKg").textContent = kg;
  getEl("sMeals").textContent = Math.round(kg * 2.5);
}
