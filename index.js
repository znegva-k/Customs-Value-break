const customValueInput = document.querySelector("#custom-value");
const fobElm = document.querySelector(".fob");
const freightElm = document.querySelector(".freight");
const insuranceElm = document.querySelector(".insurance");
const cvElm = document.querySelector(".cv");

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "Ksh",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function calculateValues(customValue) {
  const cv = parseFloat(customValue);
  if (isNaN(cv)) return;

  const freight = Math.round((18.5 / 100) * cv);
  const insurance = Math.round((1.5 / 100) * cv);
  const fob = cv - (freight + insurance);

  fobElm.value = formatCurrency(fob);
  freightElm.value = formatCurrency(freight);
  insuranceElm.value = formatCurrency(insurance);
  cvElm.value = formatCurrency(cv);

  animateValue(fobElm);
  animateValue(freightElm);
  animateValue(insuranceElm);
  animateValue(cvElm);
}

function animateValue(element) {
  element.style.transform = "scale(1.05)";
  element.style.transition = "transform 0.3s ease";
  setTimeout(() => {
    element.style.transform = "scale(1)";
  }, 300);
}

customValueInput.addEventListener("input", (e) => {
  calculateValues(e.target.value);
});

// Initialize with empty values
calculateValues(0);
