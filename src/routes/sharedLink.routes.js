const {Router} = require("express");
const router = Router();
const sharedLinkController = require("../controllers/sharedLink.controller");

const {ensureAuthenticated} = require("../middleware/auth.middleware");

router.post("/shared-links", ensureAuthenticated, sharedLinkController.createSharedLink);

module.exports = router;