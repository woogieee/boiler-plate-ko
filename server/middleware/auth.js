const { User } = require('../models/User');

//인증 처리를 하는곳
let auth = (req, res, next) => {

    //클라이언트 쿠키에서 토큰 가져오기.
    let token = req.cookies.x_auth;

    //토큰을 복후화 한 후 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        //유저가 없으면 인증 No!
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true});
        
        //유저가 있으면 인증 Ok
        req.token = token;
        req.user = user; //user를 req에 넣었기 때문에 /api/users/auth에서 불러올수 있음.
        next();
    });
}

module.exports = { auth };