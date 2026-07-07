const {Router} = require("express");
const router = Router();
const fileController = require("../controllers/file.controller");
const {ensureAuthenticated} = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.use(ensureAuthenticated);

router.post("/files", upload.single("file"), fileController.uploadFile);
router.get("/files/:id", fileController.showFile);
router.delete("/files/:id", fileController.deleteFile);

module.exports = router;
