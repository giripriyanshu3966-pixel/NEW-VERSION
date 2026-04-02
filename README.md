# Next Creatives Website

This folder is ready for:

- Google Sheets form storage through Google Apps Script
- GitHub upload
- GitHub Pages deployment

## Project files

- `index.html`
- `style.css`
- `script.js`
- `google-apps-script/Code.gs`

## 1. Connect the website to Google Sheets

### Create the spreadsheet

1. Open [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Name it something like `Next Creatives Leads`.

### Add the Apps Script code

1. In that spreadsheet, click `Extensions > Apps Script`.
2. Delete the default code.
3. Open [google-apps-script/Code.gs](/Users/priyanshugiri/Desktop/AI%20Agent/next-creatives-site/google-apps-script/Code.gs) and paste that code into Apps Script.
4. Save the project.

### Deploy the Apps Script

1. Click `Deploy > New deployment`.
2. Choose `Web app`.
3. Set `Execute as` to `Me`.
4. Set access to `Anyone`.
5. Click `Deploy`.
6. Copy the web app URL.

### Paste the URL into the website

Open [script.js](/Users/priyanshugiri/Desktop/AI%20Agent/next-creatives-site/script.js) and make sure `SHEET_URL` is your deployed Apps Script URL.

The current file already contains a URL. If that URL is your own active deployment, you can keep it. If not, replace it with your new one.

## 2. What gets stored

The Apps Script automatically creates two sheets:

- `Creator Applications`
- `Brand Enquiries`

Creator submissions store:

- name
- Instagram username
- followers
- niche
- email
- phone
- uploaded video file name
- Google Drive link for the uploaded video

Brand submissions store:

- brand name
- brand type
- email
- phone

## 3. Important note about video upload

The video upload is set to `10MB max`.

That limit is intentional. Sending very large videos from a static website into Google Apps Script is unreliable and can fail or time out. If you need big uploads later, the better setup is:

- upload directly to cloud storage
- save only the file link in Google Sheets

## 4. Upload to GitHub

### Create a repository

1. Go to [GitHub](https://github.com).
2. Create a new repository.
3. Upload the contents of this folder.

You can upload these files directly from the GitHub website, or use Git locally.

## 5. Deploy on GitHub Pages

1. Open your repository on GitHub.
2. Go to `Settings > Pages`.
3. Under `Build and deployment`, choose:
   `Source: Deploy from a branch`
4. Select:
   `Branch: main`
   `Folder: / (root)`
5. Save.

After a minute or two, GitHub will give you a live website URL.

## 6. Before going live

Test both forms once after deployment:

1. Submit a creator form.
2. Submit a brand form.
3. Check the Google Sheet.
4. Confirm the creator video link opens from Google Drive.
