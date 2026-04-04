// ============================================
//   NEXT CREATIVES — script.js
// ============================================

const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbxMcMYTvskJI_IbSjhrKEUlKZDsbpRR2eDu6THMbdp-o7USCRP54n9KXogSqVL7k7Gyrw/exec";

// ---- NAV SCROLL ----
window.addEventListener("scroll", function () {
  var nav = document.getElementById("navbar");
  if (window.scrollY > 40) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

// ---- TOAST ----
function showToast(msg, type) {
  var old = document.getElementById("toast");
  if (old) old.remove();

  var toast = document.createElement("div");
  toast.id = "toast";
  toast.textContent = msg;
  toast.style.background = type === "success" ? "#2e7d32" : "#b71c1c";
  document.body.appendChild(toast);

  setTimeout(function () {
    toast.style.opacity = "0";
    setTimeout(function () {
      toast.remove();
    }, 400);
  }, 3500);
}

// ---- LOADING ----
function setLoading(btnId, loaderId, on) {
  document.getElementById(btnId).style.display = on ? "none" : "inline";
  document.getElementById(loaderId).style.display = on ? "inline" : "none";
}

// ---- VALIDATE ----
function validate(fields) {
  for (var i = 0; i < fields.length; i++) {
    var el = document.getElementById(fields[i][0]);
    if (!el.value.trim()) {
      el.focus();
      el.style.borderColor = "#e05252";
      (function (elem) {
        setTimeout(function () {
          elem.style.borderColor = "";
        }, 2000);
      })(el);
      showToast("Please fill in: " + fields[i][1]);
      return false;
    }
  }
  return true;
}

function isConfiguredSheetUrl() {
  return SHEET_URL && !SHEET_URL.includes("PASTE_YOUR");
}

async function postToSheet(data) {
  if (!isConfiguredSheetUrl()) {
    throw new Error("Google Apps Script URL is not configured yet.");
  }

  var response = await fetch(SHEET_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Request failed with status " + response.status);
  }

  var resultText = await response.text();

  if (!resultText) {
    return { status: "success" };
  }

  try {
    return JSON.parse(resultText);
  } catch (error) {
    return { status: "success", raw: resultText };
  }
}

function resetCreatorForm() {
  ["name", "instagram", "followers", "niche", "email", "phone"].forEach(function (id) {
    document.getElementById(id).value = "";
  });
}

function resetBrandForm() {
  ["brandname", "typebrand", "brandemail", "brandphone"].forEach(function (id) {
    document.getElementById(id).value = "";
  });
}

// ============================================
//   SUBMIT CREATOR
// ============================================
function submitCreator() {
  var fields = [
    ["name", "Full Name"],
    ["instagram", "Instagram Username"],
    ["followers", "Followers Count"],
    ["niche", "Niche"],
    ["email", "Email Address"],
    ["phone", "Phone Number"]
  ];

  if (!validate(fields)) return;
  sendCreatorData();
}

async function sendCreatorData() {
  setLoading("creator-btn-text", "creator-loader", true);

  var data = {
    type: "creator",
    submittedAt: new Date().toISOString(),
    name: document.getElementById("name").value.trim(),
    instagram: document.getElementById("instagram").value.trim(),
    followers: document.getElementById("followers").value.trim(),
    niche: document.getElementById("niche").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim()
  };

  try {
    var result = await postToSheet(data);
    if (result.status && result.status !== "success") {
      throw new Error(result.message || "Unable to submit creator form.");
    }

    resetCreatorForm();
    showToast("Application submitted successfully!", "success");
  } catch (error) {
    console.error(error);
    showToast(error.message || "Submission failed. Please try again.");
  } finally {
    setLoading("creator-btn-text", "creator-loader", false);
  }
}

// ============================================
//   SUBMIT BRAND
// ============================================
async function submitBrand() {
  var fields = [
    ["brandname", "Brand Name"],
    ["typebrand", "Type of Brand"],
    ["brandemail", "Business Email"],
    ["brandphone", "Phone Number"]
  ];

  if (!validate(fields)) return;

  setLoading("brand-btn-text", "brand-loader", true);

  var data = {
    type: "brand",
    submittedAt: new Date().toISOString(),
    brand: document.getElementById("brandname").value.trim(),
    typebrand: document.getElementById("typebrand").value.trim(),
    email: document.getElementById("brandemail").value.trim(),
    phone: document.getElementById("brandphone").value.trim()
  };

  try {
    var result = await postToSheet(data);
    if (result.status && result.status !== "success") {
      throw new Error(result.message || "Unable to submit brand form.");
    }

    resetBrandForm();
    showToast("Enquiry sent! We will be in touch soon.", "success");
  } catch (error) {
    console.error(error);
    showToast(error.message || "Submission failed. Please try again.");
  } finally {
    setLoading("brand-btn-text", "brand-loader", false);
  }
}
