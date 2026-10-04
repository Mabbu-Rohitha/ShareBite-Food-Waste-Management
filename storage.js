// 2. STORAGE - save and load data using the browser's localStorage

// Sample food so the website is not empty the first time
function getSampleItems() {
  var now = Date.now();
  return [
    {id: 1, title: "Vegetable pulao", kg: 12, type: "Cooked meal", area: "Central Market", exp: now + 5 * HOUR, donor: "Spice Garden", contact: "98000 11111", notes: "Packed in boxes", status: "available", created: now - HOUR},
    {id: 2, title: "Bread & buns", kg: 6, type: "Bakery", area: "East Park", exp: now + 2 * HOUR, donor: "Daily Bakes", contact: "", notes: "End-of-day stock", status: "available", created: now - 2 * HOUR},
    {id: 3, title: "Mixed vegetables", kg: 20, type: "Fruits & vegetables", area: "South Bazaar", exp: now + 48 * HOUR, donor: "Fresh Mart", contact: "", notes: "", status: "available", created: now - 3 * HOUR},
    {id: 4, title: "Rice & lentils (sealed)", kg: 25, type: "Packaged / dry goods", area: "North Colony", exp: now + 300 * HOUR, donor: "Community Hall", contact: "", notes: "Sealed packs", status: "available", created: now - 4 * HOUR},
    {id: 5, title: "Milk packets", kg: 8, type: "Dairy", area: "West Station", exp: now - HOUR, donor: "City Dairy", contact: "", notes: "", status: "available", created: now - 9 * HOUR},
    {id: 6, title: "Chapati & curry", kg: 9, type: "Cooked meal", area: "Central Market", exp: now + HOUR, donor: "Hotel Sunrise", contact: "", notes: "", status: "claimed", claimedBy: "Hope Food Bank", claimedAt: now - 1800000, created: now - 5 * HOUR}
  ];
}

// Save everything into localStorage
function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ myName: myName, items: items, locations: locations, myArea: myArea }));
    localStorage.setItem(DONOR_KEY, JSON.stringify({ users: users, loggedInEmail: loggedInEmail }));
  } catch (error) {
    console.log("Could not save data", error);
  }
}

// Load everything from localStorage (or use the starting data)
function loadData() {
  items = getSampleItems();
  users = [];
  loggedInEmail = "";
  myName = "";
  locations = getSampleLocations();
  myArea = "";

  try {
    var savedItems = localStorage.getItem(STORAGE_KEY);
    if (savedItems) {
      var data = JSON.parse(savedItems);
      if (data.items) { items = data.items; }
      myName = data.myName || data.me || "";
      if (data.locations && data.locations.length > 0) { locations = data.locations; }
      myArea = data.myArea || "";
    }
    var savedDonors = localStorage.getItem(DONOR_KEY);
    if (savedDonors) {
      var donorData = JSON.parse(savedDonors);
      users = donorData.users || [];
      loggedInEmail = donorData.loggedInEmail || donorData.donor || "";
    }
  } catch (error) {
    console.log("Could not load data", error);
  }

  // Make sure there is always one demo donor account
  if (users.length === 0) {
    users.push({
      email: "demo@sharebite.org", name: "Demo Donor", pass: hashPassword("demo"),
      phone: "98000 00000", dtype: "Restaurant / Hotel", darea: "Central Market",
      address: "Main Road", joined: Date.now()
    });
  }
  if (findLocation(myArea) === null) { myArea = locations[0].name; }
  saveData();
}
