const express =require("express");
const app =express();
const path = require("path");

const passport= require("./config/passport");
const sessionMiddleware = require("./config/session");

const indexRouter = require("./routes/index.routes");
const authRouter = require("./routes/auth.routes");
const folderRouter = require("./routes/folder.routes");
const fileRouter = require("./routes/file.routes");
const sharedLinkRouter = require("./routes/sharedLink.routes");
const shareRouter = require("./routes/share.routes");

const methodeOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodeOverride("_method"));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.currentUser = req.user || null;
    next();
});

app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/", folderRouter);
app.use("/", fileRouter);
app.use("/", sharedLinkRouter);
app.use("/", shareRouter);


module.exports = app;