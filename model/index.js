var mongoose = require('mongoose');
mongoose.Promise = Promise;
var config = require('../config');
mongoose.connect(config.dbUrl);
var UserSchema = new mongoose.Schema({
    avatar:String,
   username:String,
    password:String
},{collection:'user'});
var User = mongoose.model('User',UserSchema);
exports.User = User;
/*
User.remove({},function (err,data) {
    console.log(data.result);
});*/
User.create({username:123,password:123,as:123},function (err,data) {
    console.log(data);
});

var ObjectId = mongoose.Schema.Types.ObjectId;
var ArticleSchema = new mongoose.Schema({
    title:String,
    content:String,
    user:{type:ObjectId,ref:'User'},
    createAt:{type:String,default:new Date()}
},{collection:'article'});
exports.Article = mongoose.model('Article',ArticleSchema);