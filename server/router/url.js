const router = require("express").Router();

const urlController = require("../controller/urlController");


router.post("/encode", urlController.createUrl);
router.get("/:shortUrl", urlController.getUrl);
router.get("/decode/:shortUrl", urlController.getUrlById);
router.get("/statistic/:shortUrl", urlController.getUrlStat);
router.get("/", urlController.getAllUrls); // New endpoint

module.exports = router;