const passport = require("passport");
const authService = require("../services/auth.service");

function getLoginPage(req, res){
    res.render("auth/login", {error: null});
}

function getSignupPage(req, res){
    res.render("auth/signup", {error:null});
}

async function postSignup(req, res, next) {
    const { firstName, lastName, email, password } = req.body

    try{
        await authService.createUser(firstName, lastName, email, password);
        return res.redirect("/login");
    }catch(err){
        if(err.status === 400){
            return res.status(400).render("auth/signup", {error: err.message});
        }
        return next(err);
    }
    
}

function postLogin(req, res,next){
    
    passport.authenticate("local", (err, user, info) => {
        if(err) return next(err);

        if(!user){
            return res.status(401).render("auth/login", { error: info?.message || "Login failed" });
        }

        req.logIn(user, (loginErr) => {
            if(loginErr) return next(loginErr);
            return res.redirect("/");
        });
    }) (req, res, next);
}


function postLogout(req, res, next){
    req.logout((err) => {
        if(err) return next(err);

        res.redirect("/");
    });
}

async function deleteUser(req, res, next) {
    try {
        const userId = req.user.id;

        await authService.deleteUser(userId);

        req.logout(err => {
            if (err) return next(err);

            req.session.destroy(err => {
                if (err) return next(err);

                res.clearCookie("connect.sid");
                res.redirect("/");
            });
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getLoginPage,
    getSignupPage,
    postLogin,
    postSignup,
    postLogout,
    deleteUser
}