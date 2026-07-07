const fs= require("fs/promises");
const path = require("path");

class LocalStorageProvider{
    async save(file){
        return{
            url: `/uploads/${file.filename}`,
            size: file.size,
            mimeType: file.mimetype
        };
    }

    async delete(url){
        const filePath =path.join(__dirname, "..", "..", "..", url);
        try{
            await fs.unlink(filePath);

        }catch(err){
            if (err.code !== "ENOENT") throw err;
        }

    }
}

module.exports = LocalStorageProvider;
