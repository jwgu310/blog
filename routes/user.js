var express = require('express');

var User = require('../model').User;
var util = require('util');
var auth = require('../auth');
var multer = require('multer');
var upload = multer({ dest: 'public/' });

var router = express.Router();
router.get('/signUp',auth.checkNotLogin,function (req,res) {
    res.render('user/signUp',{title:'用户注册'})
});
router.post('/signUp',auth.checkNotLogin,upload.single('avatar'),function (req,res) {
    var user = req.body;
    user.avatar = '/' + req.file.filename;
    // console.log(user);
    User.findOne({username:user.username},function (err,doc) {
        if(err){
            req.session.error = inspect(err);
            res.status(500).send(err);
        }else {
            if(doc){
                //console.log(doc);
                // res.send({code:'error',data:'此用户名已经被使用了'});
                req.session.error = '此用户名已经被占用，请选择其它用名';
                res.redirect('back')
            }else{
                User.create(user,function (err,doc) {
                    if(err){
                        //console.log(1111111111111111);
                        req.session.error = util.inspect(err);
                        res.redirect('back')
                    }else {
                        req.session.success = '恭喜你注册成功,欢迎登录';
                        res.redirect('/user/signIn');
                    }
                })
            }
        }
    });
});

router.get('/signIn',auth.checkNotLogin,function (req,res) {
    res.render('user/signIn',{title:'用户登录'})
});

router.post('/signIn',auth.checkNotLogin,function (req,res) {
    var user = req.body;
    console.log(user);
    User.findOne(user,function(err,doc){
        if(err){
            req.session.error = util.inspect(err);
            res.redirect('back');
        }else{
            if(doc){
                req.session.success = '恭喜你登录成功';
                req.session.user = doc;
                res.redirect('/');
            }else{
                req.session.error = '用户名和密码不正确';
                res.redirect('back');
            }
        }
    })
});
router.get('/signOut',auth.checkLogin,function (req,res) {
    req.session.user = null;
    req.session.success = '你已退出';
    res.redirect('/')
});
module.exports = router;