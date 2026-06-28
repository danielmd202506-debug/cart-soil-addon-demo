const addGardenBed = document.querySelector("#addGardenBed");
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
const colorButtons = Array.from(document.querySelectorAll(".swatch"));
const heightButtons = Array.from(document.querySelectorAll(".config-choice"));
const selectedColorLabel = document.querySelector("#selectedColorLabel");
const selectedHeightLabel = document.querySelector("#selectedHeightLabel");
const shipStatus = document.querySelector("#shipStatus");
const scenarioButtons = Array.from(document.querySelectorAll(".scenario-switcher button"));
const addonRecommendation = document.querySelector("#addonRecommendation");
const addonSummary = document.querySelector("#addonSummary");
const addonSummaryText = document.querySelector("#addonSummaryText");
const addonSummaryPrice = document.querySelector("#addonSummaryPrice");
const bundlePanel = document.querySelector("#bundlePanel");
const bundleOptions = Array.from(document.querySelectorAll(".bundle-option"));

let hasSoil = true;
let skippedSoil = false;
let selectedColor = "Olive Green";
let selectedHeight = "17";
let currentScenario = "cold";
let selectedBundle = "soil";

function isOutOfStock(color, height) {
  return color === "Olive Green" && height === "32";
}

function updateProductOptions() {
  colorButtons.forEach((button) => {
    const isActive = button.dataset.color === selectedColor;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-label", `${button.dataset.color}${isActive ? " selected" : ""}`);
  });

  heightButtons.forEach((button) => {
    const isSoldOut = isOutOfStock(selectedColor, button.dataset.height);
    const isActive = button.dataset.height === selectedHeight;
    button.classList.toggle("active", isActive);
    button.classList.toggle("disabled", isSoldOut);
    button.disabled = isSoldOut;
    button.setAttribute("aria-disabled", String(isSoldOut));
    button.textContent = `▰ ${button.dataset.height}" Tall${isSoldOut ? " · Sold out" : ""}`;
  });

  if (isOutOfStock(selectedColor, selectedHeight)) {
    selectedHeight = "17";
    updateProductOptions();
    return;
  }

  const currentSoldOut = isOutOfStock(selectedColor, selectedHeight);
  selectedColorLabel.textContent = `Color: ${selectedColor}`;
  selectedHeightLabel.textContent = `Height: ${selectedHeight}" Tall`;
  shipStatus.innerHTML = currentSoldOut
    ? "<strong>Shipping Status:</strong> Out of Stock"
    : "<strong>Shipping Status:</strong> In Stock";
  addGardenBed.disabled = currentSoldOut;
  addGardenBed.textContent = currentSoldOut ? "Out of Stock" : "Add to Cart";
}

function openDrawer() {
  backdrop.hidden = false;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
}

function getBundleOption(bundle) {
  return bundleOptions.find((option) => option.dataset.bundle === bundle);
}

function setBundle(bundle) {
  selectedBundle = bundle;
  bundleOptions.forEach((option) => {
    option.classList.toggle("active", option.dataset.bundle === selectedBundle);
  });
  const option = getBundleOption(selectedBundle);
  const label = option?.querySelector("strong")?.textContent ?? "Bed only";
  const price = option?.querySelector("b")?.textContent ?? "$145.31";
  const includesSoil = option?.dataset.soil === "true";

  addonSummaryPrice.textContent = price;
  addonSummaryText.textContent =
    currentScenario === "warm"
      ? "Open when you want to compare setup add-ons."
      : `${label} selected. ${includesSoil ? "Soil will be included in cart." : "No add-on selected."}`;
}

function applyScenario(scenario) {
  currentScenario = scenario;
  scenarioButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.scenario === currentScenario);
  });

  addonRecommendation.classList.remove("is-cold", "is-warm", "is-cart", "is-expanded");
  addonRecommendation.classList.add(`is-${currentScenario}`);

  if (currentScenario === "cold") {
    setBundle("soil");
    addonRecommendation.classList.add("is-expanded");
    bundlePanel.hidden = false;
    addonSummary.setAttribute("aria-expanded", "true");
    closeCartDrawer();
  } else if (currentScenario === "warm") {
    setBundle("bed");
    bundlePanel.hidden = true;
    addonSummary.setAttribute("aria-expanded", "false");
    closeCartDrawer();
  } else {
    setBundle("soil");
    bundlePanel.hidden = true;
    addonSummary.setAttribute("aria-expanded", "false");
    soilToggle.checked = true;
    skippedSoil = false;
    openDrawer();
    updateDrawer();
  }
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
  if (addGardenBed.disabled) return;
  const option = getBundleOption(selectedBundle);
  soilToggle.checked = currentScenario === "cart" || option?.dataset.soil === "true";
  skippedSoil = false;
  openDrawer();
  updateDrawer();
});

addonSummary.addEventListener("click", () => {
  if (currentScenario === "cart") {
    openDrawer();
    updateDrawer();
    return;
  }

  const isExpanded = addonRecommendation.classList.toggle("is-expanded");
  bundlePanel.hidden = !isExpanded;
  addonSummary.setAttribute("aria-expanded", String(isExpanded));
  if (currentScenario === "warm" && isExpanded) {
    addonSummaryText.textContent = "Choose only if you want to complete the setup now.";
  } else {
    setBundle(selectedBundle);
  }
});

soilToggle.addEventListener("change", () => {
  updateDrawer();
});

colorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedColor = button.dataset.color;
    updateProductOptions();
  });
});

heightButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.disabled) return;
    selectedHeight = button.dataset.height;
    updateProductOptions();
  });
});

bundleOptions.forEach((option) => {
  option.addEventListener("click", () => {
    setBundle(option.dataset.bundle);
  });
});

scenarioButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyScenario(button.dataset.scenario);
  });
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
updateProductOptions();
applyScenario("cold");
