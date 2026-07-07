const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const authService = require("../services/auth.service");

passport.use(
    new LocalStrategy(
        {usernameField: "email", passwordField: "password"},
        async(email, password, done) => {
            try{
                const user = await authService.findUserByEmail(email);
                
                if(!user){
                    return done(null, false, {message: "Incorrect email or password"});
                }

                const isValid = await authService.validatePassword(password, user.password);

                if(!isValid){
                    return done(null, false, {message: "Incorrect Password"});
                }

                return done(null, user);

            }catch (err) {
                return done(err);
            }
        }
    )
);


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try{
        const user = await authService.findUserById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});


module.exports = passport;

