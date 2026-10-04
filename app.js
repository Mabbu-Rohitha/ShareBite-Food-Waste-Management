// 9. APP - links all the files together and starts the website (loaded last)

// Show one page (home, donate, find or history)
function showPage(name) {
  var sections = document.querySelectorAll("section");
  for (var i = 0; i < sections.length; i++) {
    if (sections[i].id === name) { sections[i].classList.add("on"); }
    else { sections[i].classList.remove("on"); }
  }
  var buttons = document.querySelectorAll("#nav button");
  for (var j = 0; j < buttons.length; j++) {
    if (buttons[j].dataset.p === name) { buttons[j].classList.add("on"); }
    else { buttons[j].classList.remove("on"); }
  }
  showAll();
}

// Refresh everything on the screen
function showAll() {
  showAlerts();
  showStats();
  showList();
  showHistory();
  showDonorPage();
  showLocations();
}

function startApp() {
  loadData();
  fillAreaLists();
  getEl("meName").value = myName;

  // name box at the top
  getEl("meName").addEventListener("input", function () {
    myName = getEl("meName").value.trim();
    saveData();
    showHistory();
  });

  // menu buttons
  getEl("nav").addEventListener("click", function (event) {
    if (event.target.dataset.p) { showPage(event.target.dataset.p); }
  });

  // connect each feature file
  initDonors();
  initDonations();
  initFind();
  initHistory();
  initLocations();

  showAll();
  setInterval(showAll, 60000);   // refresh every minute so countdowns stay correct
}

startApp();
