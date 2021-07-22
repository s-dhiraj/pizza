require("dotenv").config();
const express=require("express");
const app=express();
const PORT=process.env.PORT||8000;
const ejs=require("ejs");
var expressLayouts = require('express-ejs-layouts');
const path=require("path");
const static_path=path.join(__dirname,"./public");
const template_path=path.join(__dirname,"./templates/views");
// const partials_path=path.join(__dirname,"./templates/views");
const mongoose=require("mongoose")
const session=require('express-session');
const flash=require("express-flash");
const passport=require("passport");
const Emitter = require('events')
// setting moongoose conncection
var bodyParser = require('body-parser')

app.use(express.urlencoded({ extended: true }));

app.use(express.static(static_path));
app.set("view engine", "ejs");
app.use(expressLayouts);

app.set("views",template_path);
const MongoDbStore = require('connect-mongo')(session)
//mongoose.connect("mongodb://localhost:27017/pizza", { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true, useFindAndModify : true });
var connection=require("./src/db/connection");
 connection = mongoose.connection;


// Session store
let mongoStore = new MongoDbStore({
                mongooseConnection: connection,
                collection: 'session'
            })
 
app.use(express.json());
app.use(flash());


// Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

// session config
app.use(session({
    secret: process.env.COOKIE_SECRETKEY,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
}))
// passport config
const passportInit=require("./controllers/auth/passport"); 
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

require('./routes/web')(app);

const server=app.listen(process.env.port,()=>{
    console.log(`listening on port ${PORT}`);
})

// socket 

const io = require('socket.io')(server)
io.on('connection', (socket) => {
      // Join
      socket.on('join', (orderId) => {
        socket.join(orderId)
      })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})
