const fileService = require("../services/file.service");

async function uploadFile(req, res, next) {
    try {
        if (!req.file) {
            const err = new Error("no file uploaded, or file type is not allowed");
            err.status = 400;
            throw err;
        }

        const { folderId } = req.body;
        await fileService.uploadFile(req.file, req.user.id, folderId || null);
        res.redirect(folderId ? `/folders/${folderId}` : "/folders");

    } catch (err) {
        next(err);
    }
}


async function showFile(req,res, next) {
    try{
        const file = await fileService.getFileById(req.params.id, req.user.id);
        res.render("files/show", {file});
    }   catch(err){
        next(err);
    } 
}


async function deleteFile(req, res, next) {
    try{
        const file = await fileService.getFileById(req.params.id, req.user.id);
        await fileService.deleteFile(req.params.id, req.user.id);
        res.redirect(file.folderId? `/folders/${file.folderId}`:"/folders");

    }catch(err){
        next(err);
    }
}


module.exports = {
    uploadFile,
    showFile,
    deleteFile
}


