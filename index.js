const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require('./config/config');
const postRouter = require("./routes/postRoutes");

const connectWithRetry = () => {
    mongoose.connect(`mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`)
        .then(() => console.log("(^w^) connecté à la base de données (^w^)"))
        .catch((err) => {
            console.log(err)
            setTimeout(connectWithRetry, 5000)
        });
}

connectWithRetry();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h2>Hello There !</h2>");
});

app.use("/api/v1/posts", postRouter);

app.listen(port, () => console.log(`(^w^) connecté au port ${port} (^w^)`));