const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis').default;

const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config');

let redisClient = redis.createClient({
    socket: {
        host: REDIS_URL,
        port: REDIS_PORT
    }
});

(async () => {
    redisClient;
    redisClient.on("error", (error) => console.error(`Error : ${error}`));
    await redisClient.connect();
})();

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const connectWithRetry = () => {
    mongoose.connect(`mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`)
        .then(() => console.log("(^w^) connecté à la base de données (^w^)"))
        .catch((err) => {
            console.log(err)
            setTimeout(connectWithRetry, 5000)
        });
}

connectWithRetry();

app.enable("trust proxy");

app.use(session({
    store: new RedisStore({
        client: redisClient
    }),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 300000
    }
}));

app.use(express.json());

app.get("/api/v1", (req, res) => {
    res.send("<h2>Hello There !</h2>");
    console.log("8==3 ~")
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

app.listen(port, () => console.log(`(^w^) connecté au port ${port} (^w^)`));