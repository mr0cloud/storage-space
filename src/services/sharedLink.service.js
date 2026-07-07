const prisma = require("../config/prisma");
const folderService = require("./folder.service");

const DURATION_MS = {
    "1d": 1 * 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000
}

async function createSharedLink(folderId, ownerId, duration) {
    await folderService.getFolderById(folderId, ownerId);

    const ms = DURATION_MS[duration];

    if (!ms) {
        const err = new Error("Invalid share duration");
        err.status = 400;
        throw err;
    }

    const expiresAt = new Date(Date.now() + ms);

    return prisma.sharedLink.create({
        data: { folderId, expiresAt }
    });
}

async function getFolderByToken(token) {
    const sharedLink = await prisma.sharedLink.findUnique({
        where: { token },
        include: {
            folder: {
                include: {
                    children: { orderBy: { name: "asc" } },
                    files: { orderBy: { name: "asc" } }
                }
            }
        }
    });

    if(!sharedLink){
        const err = new Error("Share link is not found");
        err.status = 404;
        throw err;
    }

    if(sharedLink.expiresAt < new Date()){
        const err = new Error("This share link has expired");
        err.status = 410;
        throw err;
    }

    return sharedLink.folder;
}

module.exports= {
    createSharedLink,
    getFolderByToken
}