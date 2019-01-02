// @desc    genres API routes
// @func    CRUD functions for the genres collection
const express = require("express");
const router = express.Router();
const genreController = require("../../controllers/genre-api");
const auth = require("../../middleware/auth-middleware");
const admin = require("../../middleware/admin-middleware");
const validateId = require("../../middleware/validateId-middleware");

// @desc    return all the movies array
// @access  public
router.get("/", async (req, res) => {
    const result = await genreController.getGenres();
    res.send(result);
});

// @desc    return a genre with an especific id or null 404 not found
// @access  public
router.get("/:id", validateId, async (req, res) => {
    const result = await genreController.getGenreById(req.params.id);
    if (!result) return res.status(404).send("Genre not found.");
    res.send(result);
});

// @desc    insert a new genre to the db
// @access  private
router.post("/", auth, async (req, res) => {
    const result = await genreController.createGenre(req.body);
    if (result.error) return res.status(400).send(result.error);
    res.send(result);
});

// @desc    update a genre in the db
// @access  private
router.put("/:id", [auth, validateId], async (req, res) => {
    const result = await genreController.updateGenreById(
        req.params.id,
        req.body
    );
    if (!result) return res.status(404).send("Genre not found.");
    if (result.error) return res.status(400).send(result.error);
    res.send(result);
});

// @desc    delete a genre
// @access  admin
router.delete("/:id", [auth, admin, validateId], async (req, res) => {
    const result = await genreController.removeGenreById(req.params.id);
    if (!result) return res.status(404).send("Genre not found.");
    res.send(result);
});

module.exports = router;
