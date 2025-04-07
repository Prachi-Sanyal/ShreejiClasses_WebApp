{/*
    require('dotenv').config({ path: '../.env' });  // Move one level up to backend folder


const fs = require('fs');
const { google } = require('googleapis');

require('dotenv').config();

console.log("Client ID:", process.env.GOOGLE_DRIVE_CLIENT_ID);
console.log("Client Secret:", process.env.GOOGLE_DRIVE_CLIENT_SECRET);
console.log("Redirect URI:", process.env.GOOGLE_DRIVE_REDIRECT_URI);
console.log("Refresh Token:", process.env.GOOGLE_DRIVE_REFRESH_TOKEN);
console.log("Folder ID:", process.env.GOOGLE_DRIVE_FOLDER_ID);


const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_DRIVE_CLIENT_ID,
    process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    process.env.GOOGLE_DRIVE_REDIRECT_URI
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_DRIVE_REFRESH_TOKEN
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

async function uploadFile() {
    const fileMetadata = {
        name: 'test.txt',
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
    };
    const media = {
        mimeType: 'text/plain',
        body: fs.createReadStream('test.txt')
    };

    const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    });

    console.log('File uploaded successfully, File ID:', response.data.id);
}

uploadFile().catch(console.error);
*/}