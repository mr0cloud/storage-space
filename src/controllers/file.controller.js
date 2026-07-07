const fileService = require("../services/file.service");
const folderService = require("../services/folder.service");

async function uploadFile(req, res, next) {
  const { folderId } = req.body;

  try {
    if (req.fileValidationError) {
      const err = new Error(req.fileValidationError);
      err.status = 400;
      throw err;
    }

    if (!req.file) {
      const err = new Error("No file uploaded");
      err.status = 400;
      throw err;
    }

    await fileService.uploadFile(req.file, req.user.id, folderId || null);
    return res.redirect(folderId ? `/folders/${folderId}` : "/folders");

  } catch (err) {
    if (err.status === 400) {
      return renderWithError(req, res, next, folderId, err.message);
    }
    next(err);
  }
}

async function renderWithError(req, res, next, folderId, message) {
  try {
    if (folderId) {
      const folder = await folderService.getFolderById(folderId, req.user.id);
      const breadcrumb = await folderService.getBreadcrumb(folderId, req.user.id);
      return res.status(400).render("folders/show", { folder, breadcrumb, shareLink: null, error: message });
    }

    const folders = await folderService.getRootFolders(req.user.id);
    const files = await fileService.getRootFiles(req.user.id);
    return res.status(400).render("folders/index", { folders, files, error: message });

  } catch (err) {
    next(err);
  }
}

async function showFile(req, res, next) {
  try {
    const file = await fileService.getFileById(req.params.id, req.user.id);
    res.render("files/show", { file });
  } catch (err) {
    next(err);
  }
}

async function deleteFile(req, res, next) {
  try {
    const file = await fileService.getFileById(req.params.id, req.user.id);
    await fileService.deleteFile(req.params.id, req.user.id);
    res.redirect(file.folderId ? `/folders/${file.folderId}` : "/folders");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  uploadFile,
  showFile,
  deleteFile,
};