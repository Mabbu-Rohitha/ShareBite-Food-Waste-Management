// 10. LOCATION - see, add, change and delete locations, and use GPS

var editingIndex = -1;   // -1 means we are adding; 0, 1, 2... means we are editing that place

// Starting places (sample coordinates - change them on the Locations page)
function getSampleLocations() {
  return [
    {name: "Central Market", lat: 17.000, lng: 78.000},
    {name: "North Colony", lat: 17.045, lng: 78.009},
    {name: "East Park", lat: 17.009, lng: 78.057},
    {name: "South Bazaar", lat: 16.955, lng: 78.000},
    {name: "West Station", lat: 17.000, lng: 77.944}
  ];
}

// Find a location by its name (or null)
function findLocation(name) {
  for (var i = 0; i < locations.length; i++) {
    if (locations[i].name === name) { return locations[i]; }
  }
  return null;
}

// Put all location names into every area drop-down
function fillAreaLists() {
  var html = "";
  for (var i = 0; i < locations.length; i++) {
    html = html + "<option>" + escapeHtml(locations[i].name) + "</option>";
  }
  var lists = document.querySelectorAll(".areaSel");
  for (var j = 0; j < lists.length; j++) {
    var oldValue = lists[j].value;          // remember what was selected
    lists[j].innerHTML = html;
    if (findLocation(oldValue) !== null) { lists[j].value = oldValue; }
  }
  getEl("myArea").value = myArea;
}

// Ask the browser for the GPS position, then call onDone(lat, lng)
function getGps(onDone) {
  if (!navigator.geolocation) {
    showToast("GPS is not supported in this browser");
    return;
  }
  showToast("Finding your location...");
  navigator.geolocation.getCurrentPosition(
    function (position) { onDone(position.coords.latitude, position.coords.longitude); },
    function () { showToast("Could not get your location. Please allow location access."); }
  );
}

// "Use my GPS" button on the Find Food page
function useMyGps() {
  getGps(function (lat, lng) {
    var place = findLocation("My GPS location");
    if (place === null) {
      locations.push({name: "My GPS location", lat: lat, lng: lng});
    } else {
      place.lat = lat;
      place.lng = lng;
    }
    myArea = "My GPS location";
    saveData();
    fillAreaLists();
    showAll();
    showToast("Your area is now your GPS location");
  });
}

// Show the table of saved locations
function showLocations() {
  var rows = [];
  for (var i = 0; i < locations.length; i++) {
    var p = locations[i];
    rows.push("<tr><td>" + escapeHtml(p.name) + "</td><td>" + p.lat.toFixed(4) + "</td><td>" + p.lng.toFixed(4) +
      '</td><td><button class="btn sec" onclick="editLocation(' + i + ')">Edit</button> ' +
      '<button class="btn sec" onclick="deleteLocation(' + i + ')">Delete</button></td></tr>');
  }
  getEl("locList").innerHTML = makeTable(["Name", "Latitude", "Longitude", "Actions"], rows);
}

// Put the form back to "add" mode
function resetLocForm() {
  editingIndex = -1;
  getEl("locForm").reset();
  getEl("locSave").textContent = "Add location";
  getEl("locCancel").style.display = "none";
}

// Edit button: fill the form with this place
function editLocation(index) {
  editingIndex = index;
  getEl("locName").value = locations[index].name;
  getEl("locLat").value = locations[index].lat;
  getEl("locLng").value = locations[index].lng;
  getEl("locSave").textContent = "Save changes";
  getEl("locCancel").style.display = "inline-block";
  getEl("locName").focus();
}

// Delete button
function deleteLocation(index) {
  var name = locations[index].name;
  if (locations.length <= 1) { showToast("You need at least one location"); return; }
  for (var i = 0; i < items.length; i++) {
    if (items[i].area === name) {
      showToast("Food is posted at this place, so it cannot be deleted");
      return;
    }
  }
  locations.splice(index, 1);
  if (myArea === name) { myArea = locations[0].name; }
  resetLocForm();
  saveData();
  fillAreaLists();
  showAll();
  showToast("Location deleted");
}

// Add or save a location when the form is submitted
function handleLocSubmit(event) {
  event.preventDefault();
  var name = getEl("locName").value.trim();
  var lat = Number(getEl("locLat").value);
  var lng = Number(getEl("locLng").value);

  if (name === "") { showToast("Please enter a place name"); return; }

  // do not allow two places with the same name
  for (var i = 0; i < locations.length; i++) {
    if (i !== editingIndex && locations[i].name.toLowerCase() === name.toLowerCase()) {
      showToast("A place with this name already exists");
      return;
    }
  }

  if (editingIndex >= 0) {
    var oldName = locations[editingIndex].name;
    locations[editingIndex] = {name: name, lat: lat, lng: lng};
    if (oldName !== name) {              // keep everything else pointing to the new name
      for (var a = 0; a < items.length; a++) { if (items[a].area === oldName) { items[a].area = name; } }
      for (var b = 0; b < users.length; b++) { if (users[b].darea === oldName) { users[b].darea = name; } }
      if (myArea === oldName) { myArea = name; }
    }
    showToast("Location updated");
  } else {
    locations.push({name: name, lat: lat, lng: lng});
    showToast("Location added");
  }

  resetLocForm();
  saveData();
  fillAreaLists();
  showAll();
}

function initLocations() {
  getEl("locForm").addEventListener("submit", handleLocSubmit);
  getEl("locCancel").addEventListener("click", resetLocForm);
  getEl("locGps").addEventListener("click", function () {
    getGps(function (lat, lng) {
      getEl("locLat").value = lat.toFixed(5);
      getEl("locLng").value = lng.toFixed(5);
    });
  });
  getEl("locReset").addEventListener("click", function () {
    locations = getSampleLocations();
    myArea = locations[0].name;
    resetLocForm();
    saveData();
    fillAreaLists();
    showAll();
    showToast("Sample locations restored");
  });
}
