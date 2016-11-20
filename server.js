var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var index = require('./routes/index');
var user = require('./routes/user');
var article = require('./routes/article');
var session = require('express-session');//会话中间件
var MongoStore = require('connect-mongo')(session);
var config = require('./config');
global.inspect = require('util').inspect;

var app = express();

app.set('view engine','html');
app.set('views',path.resolve('views'));
app.engine('.html',require('ejs').__express);
app.use(express.static(path.resolve('public')));   //静态文件中间件
app.use(bodyParser.urlencoded({extended:true}));
//会话
app.use(session({
    resave:true,
    saveUninitialized:true,
    secret:'jwgu',
    cookie:{httpOnly:true},
    store:new MongoStore({  //指定存储位置
        url:config.dbUrl
    })
}));

app.use(function(req,res,next){
    // res.locals 是真正渲染模板的对象
    res.locals.success = req.session.success;
    res.locals.error = req.session.error;
    //把会话对象中的user属性取出来赋给res.locals 对象
    res.locals.user = req.session.user;
    req.session.success = req.session.error = null;
    next();
});


app.use('/',index);
app.use('/user',user);
app.use('/article',article);
app.listen(9099,console.log('正在监听9099'));