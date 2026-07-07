const sharedLinkService = require("../services/sharedLink.service");


async function createSharedLink(req, res, next) {
    try{

        const {folderId, duration} = req.body;
        const sharedLink = await sharedLinkService.createSharedLink(folderId, req.user.id, duration);
        res.redirect(`/folders/${folderId}?shareLink=${sharedLink.token}`);

    }catch(err){
        next(err);
    }
    
}

async function viewSharedFolder(req, res, next) {
    try{

        const folder = await sharedLinkService.getFolderByToken(req.params.token);
        res.render("share/show", {folder});

    }catch(err){
        next(err);
    } 
}

module.exports= {
    createSharedLink,
    viewSharedFolder
}