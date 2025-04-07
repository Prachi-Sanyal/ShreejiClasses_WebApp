const { google } = require("googleapis");
const fs = require("fs");
const ExcelJS = require("exceljs");
require("dotenv").config();

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_DRIVE_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/drive.file"]
});

const drive = google.drive({ version: "v3", auth });

async function uploadToGoogleDrive(filePath) {
  try{

    if (!fs.existsSync(filePath)) {
      console.error("File does not exist:", filePath);
      return null;
    }

  const fileMetadata = {
    name: filePath.split("/").pop(),
    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID] // Google Drive folder ID
  };

  const media = {
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    body: fs.createReadStream(filePath)
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id"
  });
  console.log("Upload Response:", response.data);

  return response.data.id;
}catch (err) {
  console.error("Error uploading to Google Drive:", err.message);
  return null;
}}


async function generateDriveLink(fileId) {
  try{
  await drive.permissions.create({
    fileId,
    requestBody: { role: "reader", type: "anyone" }
  });

  return `https://drive.google.com/file/d/${fileId}/view`;
}catch (err) {
  console.error("Error generating Google Drive link:", err.message);
  return null;
}
}

module.exports = { uploadToGoogleDrive, generateDriveLink };
