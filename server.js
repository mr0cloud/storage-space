require("dotenv/config");
const app = require("./src/app");


const PORT = 3000;

app.listen(PORT, (err) => {
    if(err){
        throw err;
    }

    console.log(`server is running on port ${PORT}`);
});

