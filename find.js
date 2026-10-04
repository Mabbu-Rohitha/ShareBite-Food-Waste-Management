// 7. FIND FOOD - show available food and let recipients claim it

function showList() {
  var myArea = getEl("myArea").value;
  var type = getEl("fType").value;
  var sortBy = getEl("fSort").value;

  // 1. keep only food that is still available
  var available = [];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.status === "available" && timeLeft(item) > 0) {
      if (type === "" || item.type === type) { available.push(item); }
    }
  }

  // 2. sort the list
  available.sort(function (a, b) {
    if (sortBy === "dist") { return getDistance(myArea, a.area) - getDistance(myArea, b.area); }
    return a.exp - b.exp;
  });

  // 3. build the HTML
  if (available.length === 0) {
    getEl("list").innerHTML = '<p class="muted">No food available right now. Check back soon!</p>';
    return;
  }
  var html = "";
  for (var j = 0; j < available.length; j++) {
    var f = available[j];
    var km = getDistance(myArea, f.area).toFixed(1);
    html = html + '<div class="card item"><div>';
    html = html + "<h3>" + escapeHtml(f.title) + ' <span class="muted">- ' + f.kg + " kg</span></h3>";
    html = html + '<div><span class="tag">' + escapeHtml(f.type) + "</span>" + getExpiryTag(f);
    html = html + '<span class="tag">' + escapeHtml(f.area) + " (" + km + " km)</span></div>";
    html = html + '<div class="muted">Donor: ' + escapeHtml(f.donor);
    if (f.contact) { html = html + " - " + escapeHtml(f.contact); }
    if (f.notes) { html = html + "<br>" + escapeHtml(f.notes); }
    html = html + '</div></div><div><button class="btn" onclick="claimFood(' + f.id + ')">Claim</button></div></div>';
  }
  getEl("list").innerHTML = html;
}

// Called when someone presses the Claim button
function claimFood(id) {
  if (myName === "") {
    showToast("Please enter your name / organization at the top first");
    getEl("meName").focus();
    return;
  }
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.id === id) {
      if (item.status !== "available" || timeLeft(item) <= 0) {
        showToast("Sorry, this item is no longer available");
      } else {
        item.status = "claimed";
        item.claimedBy = myName;
        item.claimedAt = Date.now();
        saveData();
        showToast("Claimed! Contact the donor to arrange pickup.");
      }
    }
  }
  showAll();
}

function initFind() {
  getEl("myArea").addEventListener("change", function () {
    myArea = getEl("myArea").value;
    saveData();
    showList();
  });
  getEl("gpsBtn").addEventListener("click", useMyGps);
  getEl("fType").addEventListener("change", showList);
  getEl("fSort").addEventListener("change", showList);
}
