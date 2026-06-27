const addGardenBed = document.querySelector("#addGardenBed");
const jumpToBuilder = document.querySelector("#jumpToBuilder");
const drawer = document.querySelector("#cartDrawer");
const backdrop = document.querySelector("#drawerBackdrop");
const closeDrawer = document.querySelector("#closeDrawer");
const soilToggle = document.querySelector("#soilToggle");
const soilReco = document.querySelector("#soilReco");
const soilAdded = document.querySelector("#soilAdded");
const soilSkipped = document.querySelector("#soilSkipped");
const showSoilReco = document.querySelector("#showSoilReco");
const drawerTotal = document.querySelector("#drawerTotal");
const drawerSubtotal = document.querySelector("#drawerSubtotal");
const checkoutButton = document.querySelector("#checkoutButton");
const soilSubtitle = document.querySelector("#soilSubtitle");
const cartTitle = document.querySelector("#cartTitle");
const savingText = document.querySelector("#savingText");

let hasSoil = true;
let skippedSoil = false;

function openDrawer() {
  backdrop.hidden = false;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
}

function closeCartDrawer() {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  window.setTimeout(() => {
    if (!drawer.classList.contains("open")) backdrop.hidden = true;
  }, 220);
}

function updateDrawer() {
  hasSoil = soilToggle.checked;
  soilReco.hidden = skippedSoil;
  soilReco.classList.toggle("soil-off", !hasSoil);
  soilSubtitle.textContent = hasSoil ? "Calculated for this bed size" : "Not added";
  soilAdded.hidden = true;
  soilSkipped.hidden = !skippedSoil;
  const total = hasSoil ? "$235.31" : "$145.31";
  drawerSubtotal.textContent = total;
  drawerTotal.textContent = total;
  cartTitle.textContent = hasSoil ? "Your Cart (2)" : "Your Cart (1)";
  savingText.textContent = hasSoil ? "Saving $114.64" : "Saving $114.64";
  checkoutButton.textContent = "Check Out";
}

addGardenBed.addEventListener("click", () => {
  openDrawer();
  updateDrawer();
});

jumpToBuilder.addEventListener("click", () => {
  openDrawer();
  updateDrawer();
});

soilToggle.addEventListener("change", () => {
  updateDrawer();
});

showSoilReco.addEventListener("click", () => {
  skippedSoil = false;
  updateDrawer();
});

closeDrawer.addEventListener("click", closeCartDrawer);
backdrop.addEventListener("click", closeCartDrawer);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCartDrawer();
});

updateDrawer();
