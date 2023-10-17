const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;  //slatRounds 10자리인 saltRounds를 만들어서 암호화 함
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,         //문자열의 공백을 지워줌
        unique: 1           //유니크 1개만
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {                 //일반유저 0, 관리자 1
        type: Number,
        default: 0
    },
    image: String,
    //유효성 관리
    token: {
        type: String
    },
    //토큰 유효기간
    tokenExp: {
        type: Number
    }
})


userSchema.pre('save', function( next ){
    var user = this;

    //비밀번호를 바꿀때만 (isModified는 mongoose 모듈에 포함되어 있는 함수)
    //파라미터로 들어온 값이 db에 기록된 값과 비교해서 변경된 경우는 true를, 그렇지 않은 경우는 false를 반환하는 함수
    if(user.isModified('password')) {

        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)    //에러가 발생했으면 리턴
            
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash    //hash(암호화된 비밀번호)를 만드는데 성공하면 user.password를 hash로 교체
                next()
        })
    })
    } else {
        //비밀번호를 바꾸지않고 다른경우 next
        next()
    }
})

//비밀번호 일치여부
userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword 1234567 암호화된 비밀번호 $2b$10$Xljc.cweu1Wm/kA1IRpnR.zCk9kwv1DtHpuVh85QO4VWJjchLqYk.
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err)  //만약 비밀번호가 같지 않으면 err 콜백
        cb(null, isMatch)       //맞을 경우
    })

}


//Token생성
userSchema.methods.generateToken = function(cb) {

    var user = this;

    // jsonwebtoken을 이용해서 token을 생성하기

    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id + 'secretToken' = token
    // ->
    // 'secretToken' -> user._id

    user.token = token
    /* 
    함수 권장방식 변경으로 인한 문법 수정
    user.save(function(err, user) {
        if(err) return cb(err)  //문제 생기면 err 콜백
        cb(null, user)          //문제 없다면 err 없고 user 정보만 전달
    })
    */
    user.save().then(() => {
        return cb(null, user)   //문제 없다면 err 없고, user 정보만 전달
    }).catch((err) => {
        return cb(err)          //문제 생기면 err 콜백
    })
}


userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    //코튼을 decode(복호화)한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        // user.findOne({"_id": decoded, "token": token}, function(err, user) {

        //     if(err) return cb(err);
        //     cb(null, user)
        // })
        /////////// promise문 변경
        user.findOne({"_id": decoded, "token": token})
        .then((user) => {
            return cb(null, user);
        })
        .catch((err) => {
            return cb(err);
        })
    })
}

//model
const User = mongoose.model('User', userSchema)

//다른 파일에서도 User 모델을 쓰기위해 exports함
module.exports = {User}