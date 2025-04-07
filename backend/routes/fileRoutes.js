const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer'); 
const { uploadFile, getFiles, editFile, deleteFile, getFilesBySubject, getFilteredFiles, 
    viewFile, 
    downloadFile} = require('../controllers/fileController');
const {authMiddleware}= require('../middlewares/authMiddleware'); 




router.post("/upload", upload.single("file"), uploadFile);

router.get('/', getFiles);

router.get('/by-subject', getFilesBySubject);
router.get('/filtered', getFilteredFiles);
router.get('/view/:fileId', viewFile);
router.get('/download/:fileId', downloadFile);

router.put('/edit/:fileId', authMiddleware, editFile);

router.delete('/delete/:fileId', authMiddleware, deleteFile);

module.exports = router;
