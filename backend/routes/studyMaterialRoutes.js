

const express = require("express");
const router = express.Router();
const studyMaterialController = require("../controllers/studyMaterialController");
const {authMiddleware} = require("../middlewares/authMiddleware")
// Route to upload study material
router.post('/upload',authMiddleware,studyMaterialController.uploadMaterial);

// Route to get all study materials
router.get('/materials', studyMaterialController.getMaterials);

router.get('/student',authMiddleware, studyMaterialController.getMaterialsForStudents);

router.get("/download/:id", studyMaterialController.downloadStudyMaterial);


router.get('/teacher/:teacherId',authMiddleware, studyMaterialController.getMaterialsByTeacher);



// Route to delete a study material by ID
router.delete('/:id', studyMaterialController.deleteMaterial);

module.exports = router;





{/*
const express = require("express");
const router = express.Router();
const studyMaterialController = require("../controllers/studyMaterialController");

// Route to upload study material
router.post('/upload', studyMaterialController.uploadMaterial);

// Route to get all study materials
router.get('/materials', studyMaterialController.getMaterials);

// Route to delete a study material by ID
router.delete('/:id', studyMaterialController.deleteMaterial);

module.exports = router;


*/}