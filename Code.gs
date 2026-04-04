const CREATOR_SHEET = "Creator Applications";
const BRAND_SHEET = "Brand Enquiries";
const DRIVE_FOLDER_ID = "";

function doGet() {
  return jsonResponse({
    status: "success",
    message: "Next Creatives Apps Script is running."
  });
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    if (payload.type === "creator") {
      saveCreatorLead(spreadsheet, payload);
    } else if (payload.type === "brand") {
      saveBrandLead(spreadsheet, payload);
    } else {
      throw new Error("Unsupported submission type.");
    }

    return jsonResponse({
      status: "success",
      message: "Submission stored successfully."
    });
  } catch (error) {
    return jsonResponse({
      status: "error",
      message: error.message
    });
  }
}

function saveCreatorLead(spreadsheet, payload) {
  const sheet = getOrCreateSheet(spreadsheet, CREATOR_SHEET, [
    "Timestamp",
    "Full Name",
    "Instagram Username",
    "Followers Count",
    "Niche",
    "Email Address",
    "Phone Number"
  ]);

  sheet.appendRow([
    payload.submittedAt || new Date().toISOString(),
    payload.name || "",
    payload.instagram || "",
    payload.followers || "",
    payload.niche || "",
    payload.email || "",
    payload.phone || ""
  ]);
}

function saveBrandLead(spreadsheet, payload) {
  const sheet = getOrCreateSheet(spreadsheet, BRAND_SHEET, [
    "Timestamp",
    "Brand Name",
    "Type of Brand",
    "Business Email",
    "Phone Number"
  ]);

  sheet.appendRow([
    payload.submittedAt || new Date().toISOString(),
    payload.brand || "",
    payload.typebrand || "",
    payload.email || "",
    payload.phone || ""
  ]);
}

function getOrCreateSheet(spreadsheet, name, headers) {
  let sheet = spreadsheet.getSheetByName(name);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }

  return sheet;
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
