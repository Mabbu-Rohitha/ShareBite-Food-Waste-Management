// 6. DONATIONS - donors post surplus food

function handleDonateSubmit(event) {
  event.preventDefault();

  var donor = findDonor();
  if (donor === null) {
    showToast("Please log in as a donor first");
    showDonorPage();
    return;
  }

  var form = getEl("donateForm");
  var hours = Number(form.elements["hours"].value);

  var newItem = {
    id: Date.now(),
    title: form.elements["title"].value,
    kg: Number(form.elements["kg"].value),
    type: form.elements["type"].value,
    area: form.elements["area"].value,
    exp: Date.now() + hours * HOUR,
    donor: donor.name,
    contact: form.elements["contact"].value,
    notes: form.elements["notes"].value,
    status: "available",
    created: Date.now()
  };

  items.push(newItem);
  saveData();

  form.reset();
  form.elements["hours"].value = 6;
  form.elements["kg"].value = 5;
  form.elements["contact"].value = donor.phone || donor.email;

  showToast("Thank you! Donation posted.");
  showPage("find");
}

function initDonations() {
  getEl("donateForm").addEventListener("submit", handleDonateSubmit);
}
