// 1. CONFIG - settings and the data our website keeps in memory

// Locations are stored in the "locations" list below (name, latitude, longitude).
// Sample locations are in location.js and can be changed on the Locations page.

var STORAGE_KEY = "sharebite_v1";        // localStorage key for food items
var DONOR_KEY = "sharebite_donors";      // localStorage key for donor accounts
var HOUR = 3600000;                      // one hour in milliseconds

var items = [];            // list of all food donations
var users = [];            // list of all donor accounts
var loggedInEmail = "";    // email of the donor who is logged in ("" = nobody)
var myName = "";           // name typed in the top bar
var locations = [];        // list of places: {name, lat, lng}
var myArea = "";           // the location chosen as "Your area"
