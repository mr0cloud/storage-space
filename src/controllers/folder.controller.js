const folderService = require("../services/folder.service");
const fileService = require("../services/file.service");

async function listRootFolders(req, res, next) {
    try{
        const folders = await folderService.getRootFolders(req.user.id);
        const files = await fileService.getRootFiles(req.user.id);
        res.render("folders/index", {folders, files});
    }catch (err){
        next(err);
    }
}

async function showFolder(req, res, next) {
  try {
    const folder = await folderService.getFolderById(req.params.id, req.user.id);
    const breadcrumb = await folderService.getBreadcrumb(req.params.id, req.user.id);

    const shareLink = req.query.shareLink
      ? `${req.protocol}://${req.get("host")}/share/${req.query.shareLink}`
      : null;

    res.render("folders/show", { folder, breadcrumb, shareLink });
  } catch (err) {
    next(err);
  }
}

async function newFolderForm(req, res, next) {
    res.render("folders/new", {parentId: req.query.parentId || null, error: null});
}

async function createFolder(req, res, next) {
    const {name, parentId} = req.body;

    try{
        const folder = await folderService.createFolder(name, req.user.id, parentId || null);
        res.redirect(parentId? `/folders/${parentId}` : "/folders");
    }catch (err){
        if (err.status === 404){
            return res.status(404).render("/folders/new", {parentId: req.user.id, error: "Parent folder not found"});
        }
        next(err);
    }
}

async function editFolderForm(req, res,next) {
    try{

        const folder = await folderService.getFolderById(req.params.id, req.user.id);
        res.render("folders/edit", {folder, error: null});

    }catch (err){
        next(err);
    }
}


async function updateFolder(req, res, next) {
    try{

        const folder = await folderService.renameFolder(req.params.id, req.user.id, req.body.name);
        res.redirect(folder.parentId? `/folders/${folder.parentId}` : "/folders");

    }catch(err){
        next(err);
    }
}

async function deleteFolder(req, res, next) {
    
    try{
        const folder = await folderService.getFolderById(req.params.id, req.user.id);
        await folderService.deleteFolder(req.params.id, req.user.id);
        res.redirect(folder.parentId? `/folders/${folder.parentId}` : "/folders")
    }catch(err){
        next(err);
    }
}


module.exports = {
    listRootFolders,
    showFolder,
    newFolderForm,
    createFolder,
    editFolderForm,
    updateFolder,
    deleteFolder
}