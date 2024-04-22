const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const connectDB =require('./server/config/db');
const cookieParser =require('cookie-parser')
const MongoStore = require('connect-mongo')
const session = require('express-session');

const app = express();
const port = 3000 || process.env.PORT;


//connect to DB
connectDB();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser())

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
   store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/blog'
})

}));


app.use(express.static('public'));

// Templating Engine
app.use(expressEjsLayouts);
app.set('view engine', 'ejs');

// Import and use the router
const mainRouter = require('./server/routes/main')(app);
const adminRouter = require('./server/routes/admin')(app);
app.use('/', mainRouter);
app.use('/', adminRouter)

app.listen(port, () => {
    console.log(`app listening @ ${port} glory be to God`);
});

