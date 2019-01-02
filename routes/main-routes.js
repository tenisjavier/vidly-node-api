//@desc     All de routes + Error Middleware for Uncaught Exceptions
const movieRoutes = require("./api/movie-routes");
const clientRoutes = require("./api/client-routes");
const genreRoutes = require("./api/genre-routes");
const rentalRoutes = require("./api/rental-routes");
const usersRoutes = require("./api/user-routes");
const authRoutes = require("./api/auth-routes");
const error = require("../middleware/error-middleware");

function setAllRoutes(app) {
    app.use("/api/movies", movieRoutes);
    app.use("/api/clients", clientRoutes);
    app.use("/api/genres", genreRoutes);
    app.use("/api/rentals", rentalRoutes);
    app.use("/api/users", usersRoutes);
    app.use("/api/auth", authRoutes);

    // error middleware
    app.use(error);
}

module.exports.init = setAllRoutes;
