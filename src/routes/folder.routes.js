const {Router} = require("express");
const router = Router();
const folderController = require("../controllers/folder.controller");
const {ensureAuthenticated} = require("../middleware/auth.middleware");

router.use(ensureAuthenticated);

router.get("/folders", folderController.listRootFolders);
router.get("/folders/new", folderController.newFolderForm);
router.post("/folders", folderController.createFolder);


router.get("/folders/:id", folderController.showFolder);
router.get("/folders/:id/edit",folderController.editFolderForm);
router.put("/folder/:id", folderController.updateFolder);
router.delete("/folders/:id", folderController.deleteFolder);


module.exports = router;