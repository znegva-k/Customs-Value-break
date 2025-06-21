// Theme management
const themeToggle = document.getElementById("themeToggle");
const lightIcon = document.getElementById("lightIcon");
const darkIcon = document.getElementById("darkIcon");
const body = document.body;

// Check for saved theme or default to system preference
const savedTheme = localStorage.getItem("theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";
const currentTheme = savedTheme || systemTheme;

function setTheme(theme) {
  body.setAttribute("data-theme", theme);
  lightIcon.classList.toggle("active", theme === "light");
  darkIcon.classList.toggle("active", theme === "dark");
  localStorage.setItem("theme", theme);
}

setTheme(currentTheme);

themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);

  // Add click animation
  themeToggle.style.transform = "scale(0.9)";
  setTimeout(() => {
    themeToggle.style.transform = "scale(1)";
  }, 150);
});

// Calculator functionality
const customValueInput = document.querySelector("#custom-value");
const fobElm = document.querySelector(".fob");
const freightElm = document.querySelector(".freight");
const insuranceElm = document.querySelector(".insurance");
const cvElm = document.querySelector(".cv");
const copyButtons = document.querySelectorAll(".copy-btn");
const resultsContainer = document.getElementById("results");

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "KSH",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function createFloatingNumber(element, value) {
  const rect = element.getBoundingClientRect();
  const floating = document.createElement("div");
  floating.className = "floating-number";
  floating.textContent = formatCurrency(value);
  floating.style.left = rect.left + rect.width / 2 + "px";
  floating.style.top = rect.top + "px";
  document.body.appendChild(floating);

  setTimeout(() => {
    floating.remove();
  }, 1500);
}

function createPulseRing(element) {
  const rect = element.getBoundingClientRect();
  const ring = document.createElement("div");
  ring.className = "pulse-ring";
  ring.style.left = rect.left + rect.width / 2 - 2 + "px";
  ring.style.top = rect.top + rect.height / 2 - 2 + "px";
  ring.style.width = "4px";
  ring.style.height = "4px";
  document.body.appendChild(ring);

  setTimeout(() => {
    ring.remove();
  }, 1000);
}

function calculateValues(customValue) {
  const cv = parseFloat(customValue);
  if (isNaN(cv) || cv <= 0) {
    [fobElm, freightElm, insuranceElm, cvElm].forEach((el) => (el.value = ""));
    return;
  }

  // Add calculating animation
  resultsContainer.classList.add("calculating");
  setTimeout(() => {
    resultsContainer.classList.remove("calculating");
  }, 500);

  const freight = Math.round((18.5 / 100) * cv);
  const insurance = Math.round((1.5 / 100) * cv);
  const fob = cv - (freight + insurance);

  // Animate value updates
  setTimeout(() => {
    fobElm.value = formatCurrency(fob);
    animateValue(fobElm);
    createFloatingNumber(fobElm, fob);
  }, 100);

  setTimeout(() => {
    freightElm.value = formatCurrency(freight);
    animateValue(freightElm);
    createFloatingNumber(freightElm, freight);
  }, 200);

  setTimeout(() => {
    insuranceElm.value = formatCurrency(insurance);
    animateValue(insuranceElm);
    createFloatingNumber(insuranceElm, insurance);
  }, 300);

  setTimeout(() => {
    cvElm.value = formatCurrency(cv);
    animateValue(cvElm);
  }, 400);
}

function animateValue(element) {
  element.style.transform = "scale(1.01)"; // Reduced from 1.05
  element.style.transition = "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
  element.style.borderColor = "var(--success)";

  setTimeout(() => {
    element.style.transform = "scale(1)";
    element.style.borderColor = "var(--border)";
  }, 400);
}

function copyToClipboard(text, button) {
  const numericValue = text.replace(/[KSH$,\s]/g, "");

  navigator.clipboard
    .writeText(numericValue)
    .then(() => {
      showCopySuccess(button);
    })
    .catch(() => {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = numericValue;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showCopySuccess(button);
    });
}

function showCopySuccess(button) {
  const icon = button.querySelector("i");
  const originalContent = button.innerHTML;

  if (icon) {
    icon.className = "fas fa-check";
  } else {
    button.innerHTML = "✓";
  }

  button.classList.add("copied");
  createPulseRing(button);

  setTimeout(() => {
    if (icon) {
      button.innerHTML = originalContent;
    } else {
      button.innerHTML = "📋";
    }
    button.classList.remove("copied");
  }, 1500);
}

// Event listeners
customValueInput.addEventListener("input", (e) => {
  calculateValues(e.target.value);
});

// Add input animation
customValueInput.addEventListener("focus", () => {
  customValueInput.style.transform = "translateY(-2px)";
});

customValueInput.addEventListener("blur", () => {
  customValueInput.style.transform = "translateY(0)";
});

copyButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const field = e.currentTarget.getAttribute("data-field");
    let valueElement;

    switch (field) {
      case "fob":
        valueElement = fobElm;
        break;
      case "freight":
        valueElement = freightElm;
        break;
      case "insurance":
        valueElement = insuranceElm;
        break;
    }

    if (valueElement && valueElement.value) {
      copyToClipboard(valueElement.value, e.currentTarget);
    }
  });
});

// Add hover effects to field icons
document.querySelectorAll(".field-icon").forEach((icon) => {
  icon.addEventListener("mouseenter", () => {
    icon.style.transform = "scale(1.1) rotate(5deg)";
  });

  icon.addEventListener("mouseleave", () => {
    icon.style.transform = "scale(1) rotate(0deg)";
  });
});

// Initialize
calculateValues(0);
