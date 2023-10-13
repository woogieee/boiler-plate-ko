const mongoose = require('mongoose');


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

//model
const User = mongoose.model('User', userSchema)

//다른 파일에서도 User 모델을 쓰기위해 exports함
module.exports = {User}