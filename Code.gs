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
    "Phone Number",
    "Video File Name",
    "Video Drive URL"
  ]);

  let videoUrl = "";
  if (payload.video && payload.filename) {
    videoUrl = uploadVideoToDrive(payload.video, payload.filename);
  }

  sheet.appendRow([
    payload.submittedAt || new Date().toISOString(),
    payload.name || "",
    payload.instagram || "",
    payload.followers || "",
    payload.niche || "",
    payload.email || "",
    payload.phone || "",
    payload.filename || "",
    videoUrl
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

function uploadVideoToDrive(base64Data, filename) {
  const bytes = Utilities.base64Decode(base64Data);
  const blob = Utilities.newBlob(bytes, getMimeType(filename), filename);
  const folder = DRIVE_FOLDER_ID
    ? DriveApp.getFolderById(DRIVE_FOLDER_ID)
    : DriveApp.getRootFolder();

  const file = folder.createFile(blob);
  file.setName(filename);
  return file.getUrl();
}

function getMimeType(filename) {
  const extension = (filename.split(".").pop() || "").toLowerCase();

  if (extension === "mov") return "video/quicktime";
  if (extension === "avi") return "video/x-msvideo";
  if (extension === "webm") return "video/webm";
  return "video/mp4";
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
