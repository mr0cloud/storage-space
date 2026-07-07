const { name } = require("ejs");
const prisma = require("../config/prisma");

async function getRootFolders(userId) {
    return await prisma.folder.findMany({
        where: { ownerId: userId, parentId: null },
        orderBy: { name: "asc" }
    });
}

async function getFolderById(folderId, userId) {
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    include: {
      children: { orderBy: { name: "asc" } },
      files: { orderBy: { name: "asc" } },
    },
  });

  if (!folder || folder.ownerId !== userId) {
    const err = new Error("Folder not found");
    err.status = 404;
    throw err;
  }

  return folder;
}


async function getBreadcrumb(folderId, userId) {
    const tail = [];
    let currentId = folderId;

    while (currentId) {
        const folder = await prisma.folder.findUnique({ where: { id: currentId } });

        if (!folder || folder.ownerId !== userId) break;

        tail.unshift(folder);
        currentId = folder.parentId;
    }

    return tail;
}

async function createFolder(name, ownerId, parentId = null) {
    if (parentId) {
        await getFolderById(parentId, ownerId);
    }

    return await prisma.folder.create({
        data: { name, ownerId, parentId }
    });
}

async function renameFolder(folderId, userId, newName) {
    await getFolderById(folderId, userId);
    return await prisma.folder.update({
        where: { id: folderId },
        data: { name: newName }
    });
}

async function deleteFolder(folderId, userId) {
    await getFolderById(folderId, userId);

    return await prisma.folder.delete({
        where: { id: folderId }
    });

}

module.exports = {
    getRootFolders,
    getFolderById,
    getBreadcrumb,
    createFolder,
    renameFolder,
    deleteFolder
}