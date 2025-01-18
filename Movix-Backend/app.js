const express = require("express");
const { PORT_NUMBER } = require("./Config/index");
const { connectDB } = require("./Config/database");
const AuthRouter = require("./Routes/AuthRouter");
const UserRouter = require("./Routes/UserRouter");
const CommentRouter = require("./Routes/CommentRouter");
const GlobalError = require("./Middlewares/GlobalError");
const cookieParser = require("cookie-parser");
const WatchListRouter = require("./Routes/WatchListRouter");
const cors = require("cors");
const path=require('path')


const corsOptions = {
 origin:process.env.frontend_Url,
  credentials: true,
};

const app = express();
app.use(express.static(path.join(__dirname, 'build')));

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use("/Auth", AuthRouter);
app.use("/User", UserRouter);
app.use("/Comment", CommentRouter);
app.use("/WatchList", WatchListRouter);
app.use(GlobalError);

app.listen(PORT_NUMBER, () => {
  console.log("Server is listening on  " + PORT_NUMBER);
});
connectDB();