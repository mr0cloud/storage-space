const { Router } = require("express");
const router = Router();
const sharedLinkController = require("../controllers/sharedLink.controller");

router.get("/share/:token", sharedLinkController.viewSharedFolder);

module.exports = router;