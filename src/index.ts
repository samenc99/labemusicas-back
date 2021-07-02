import app from "./controller/app";
import userRouter from "./router/userRouter";
import musicRouter from "./router/musicRouter";

app.use('/user', userRouter)
app.use('/music', musicRouter)