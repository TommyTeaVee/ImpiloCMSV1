    const express = require("express");

    const {
    getPublishedMagazines,
    getPublishedMagazine,
    getPublishedMagazinePages,
    getPublishedMagazinePage
    } = require("../controllers/magazineController");

    const router = express.Router();


    // ==================================================
    // PUBLIC MAGAZINE ROUTES
    // ==================================================

    // Get all published magazines
    router.get(
    "/",
    getPublishedMagazines
    );


    // Get one published magazine
    router.get(
    "/public/:slug",
    getPublishedMagazine
    );


    // Get all pages for one magazine
    router.get(
    "/public/:slug/pages",
    getPublishedMagazinePages
    );


    // Get one page
    router.get(
    "/public/:slug/pages/:position",
    getPublishedMagazinePage
    );


    module.exports = router;