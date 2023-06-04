const router = require("express").Router();

const urlController = require("../controller/urlController");


router.post("/encode", urlController.createUrl);
// router.get("/", urlController.getUrl);
router.get("/decode/:shortUrl", urlController.getUrlById);
router.get("/statistic/:shortUrl", urlController.getUrlStat);

module.exports = router;