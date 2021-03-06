var nuuid = require('node-uuid');
var redis=null;

if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  redis = require("redis").createClient(rtg.port, rtg.hostname);
  redis.auth(rtg.auth.split(":")[1]); 
} else {
  redis = require("redis").createClient();
}

exports._ = function(req, res){
  redis.get("admin", function (err, val) {
    if(val==req.signedCookies.admin && req.signedCookies.admin){
      res.render('admin/index',{logged: true});
    }else{
      res.render('admin/index');
    }
  });
};

exports.login = function(req, res){
  //FIXME IMPROVEMENT HERE AUTH!
  if(req.body.user=='admin' && req.body.pass=='123456'){
    console.log(req.session);
    var _uuid=nuuid.v1();
    res.cookie("admin", _uuid, {signed: true}); //vulnerability here.. find other way! ;)
    redis.setex("admin", 600, _uuid);//10min

    res.send({});
  }else{
    res.send({status:404});
  }
};

exports.logout = function(req, res){
  redis.del("admin");
  res.redirect('/admin');
};

