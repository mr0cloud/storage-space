const bcrypt = require("bcryptjs");
const prisma = require("../config/prisma");

async function findUserByEmail(email) {
    return prisma.user.findUnique({where: {email}});
}

async function findUserById(id) {
    return prisma.user.findUnique({where: {id}});
}

async function validatePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
}

async function createUser(firstName, lastName, email, plainPassword) {
    const existing = await findUserByEmail(email);

    if(existing){
        const err = new Error("email already in use");
        err.status = 400;
        throw err;
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    return prisma.user.create({
        data:{
            firstName,
            lastName,
            email,
            password: hashedPassword
        }
    });
    
}

async function deleteUser(userId) {
    await prisma.user.delete({
        where:{id:userId}
    });
    
}

module.exports = {
    findUserByEmail,
    findUserById,
    validatePassword,
    createUser,
    deleteUser
}
