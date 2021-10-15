/*
    1) crear un sistema de logeo 
    2) hacer que el usuario no se pueda repetir
    3)agregar restriciones a los link para que no se pueda acceder a links primados por medio de url 
*/
const express = require("express");
const path = require('path');
const passport = require('passport');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const exphbs = require("express-handlebars");
const passportLocal = require('passport-local').Strategy
const app = express()

app.set('port' ,process.env.PORT || 3000)
app.use(express.urlencoded({extended: true}));
app.use(cookieParser('mi secreto'))
app.use(session({
    secret:'mi secreto',
    resave:true,
    saveUninitialized:true,
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal( (username,password,done)=>{

}))

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout:'main',  //define el archivo raiz 
    extname:'.hbs',
    
}))
app.set('view engine','.hbs');


app.get('/', (req,res)=>{
    res.render('index.hbs')
})


app.use(require('./routes/routes.js'));
app.use(express.static(path.join(__dirname, 'public')));



app.listen(app.get('port'), ()=>{
    console.log("servidor funcionando")
    
})
