const session = require("express-session");
const {PrismaSessionStore} = require("@quixo3/prisma-session-store");

const prisma = require("./prisma");

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24,
    },
    store: new PrismaSessionStore(prisma, {
        checkPeriod: 1000 * 60 * 60 * 2,
        dbRecordIdIsSessionId: true
    }),
});

module.exports = sessionMiddleware;
