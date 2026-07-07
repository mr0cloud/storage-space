const prisma = require("../config/prisma");
const  LocalStorageProvider  = require("./storage/localStorageProvider");
const folderService = require("./folder.service");

const storageProvider = new LocalStorageProvider();

async function uploadFile(multerFile, ownerId, folderId = null) {
    if (folderId) {
        await folderService.getFolderById(folderId, ownerId);
    }

    const { url, size, mimeType } = await storageProvider.save(multerFile);

    return await prisma.file.create({
        data: {
            name: multerFile.originalname,
            size,
            mimeType,
            url,
            ownerId,
            folderId
        },
    });
}

async function getFileById(fileId, userId) {
    const file = await prisma.file.findUnique({ where: { id: fileId } });
    if (!file || file.ownerId !== userId) {
        const err = new Error("File not Found");
        err.status = 404;
        throw err;
    }

    return file;
}


async function deleteFile(fileId, userId) {
    const file = await getFileById(fileId, userId);
    await storageProvider.delete(file.url);
    return prisma.file.delete({ where: { id: fileId } });

}

async function getRootFiles(userId) {
  return  await prisma.file.findMany({
    where: { ownerId: userId, folderId: null },
    orderBy: { name: "asc" },
  });
}

module.exports = {
    uploadFile,
    getFileById,
    deleteFile,
    getRootFiles
}