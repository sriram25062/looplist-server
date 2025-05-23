const express = require("express");
const app = express();
const cors = require("cors");
const config = require('./config/env.config')
const port = config.appConfig.port
const db = require('./db')
const mountRoute = require('./routes/api.route')
const mountUserRoute = require('./routes/user.route')
const mountLoopRoute = require('./routes/loop.route')
const bearerAuth = require("./utils/bearer-auth");
import serverless from 'serverless-http';

app.use(express.json());
app.use(cors({ origin: ['http://localhost:4200', 'https://looplist-ui.vercel.app'] }));

app.get('/', (req: any, res: any) => res.send('Hello I`m LoopList Server'));

app.use("/api", mountRoute);
app.use("/api/user", mountUserRoute);

app.use(bearerAuth);
app.use("/api/loop", mountLoopRoute);

app.listen(port, async() => {
    console.log(`server running on port ${port}`);
    let connect = await db.connectDB();
    if(connect.rowCount > 0) {
        console.log("DB Connected Successfully")
    } else {
        console.log("DB Connection Failure due to " + connect.message)
    }
});

module.exports = serverless(app);