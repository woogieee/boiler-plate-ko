const express = require('express')      //다운받은 express 모듈을 가져옴
const app = express()                   //function을 이용해서 새로운 app을 만들고
const port = 5000                       //5000번 포트를 백 서버로 둠
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const config = require('./config/key');
const { auth } = require('./middleware/auth');

const { User } = require("./models/User");

//application/x-www-form-urlencoded 정보 분석
app.use(bodyParser.urlencoded({extended: true}));

//application/json 정보 분석
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');    //mongoose를 이용해서 mongoDB 연결
const res = require('express/lib/response');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongDB Connected...'))   //연결 완료시 console
  .catch(err => console.log(err))                   //에러시 console


    app.get('/', (req,res) => res.send('Hello World!~~안녕하세요~'))     //루트 디렉토리에 'Hello World' 출력


    app.post('/api/users/register', (req, res) => {
        //회원 가입 할때 필요한 정보들을 clinet에서 가져오면
        //그것들을 데이터 베이스에 넣어준다.
        const user = new User(req.body)
        //user모델에 정보가 저장됨
        //실패 시, 실패한 정보를 보내줌
        /*
        Mongoose6 이전엔 Model.prototype.save()에 콜백 함수를 전달하여
        비동기 작업이 완료될때 실행하는게 가능했지만 6이후엔 사용 불가
        user.save((err, userInfo) => {
            if(err) return res.json({ success: false, err})
            return res.status(200).json({
                success: true
            })
        })
        */
       //User.js에 비밀번호 암호화 작업 시작. 에러시 이 줄로 돌아옴(next함수)

       //비밀번호 암호화 하기
        user.save().then(()=>{
            res.status(200).json({
                success:true
            })
        }).catch((err)=>{
            return res.json({success:false, err})
        })
    })

    app.post('/api/users/login', (req, res) => {
        //요청된 이메일을 데이터베이스에서 찾기
        User.findOne({ email: req.body.email }).then(user => {
            if(!user) {
                return res.json({
                    loginSuccess: false,
                    message: "제공된 이메일에 해당하는 유저가 없습니다."
                })
            }

            //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
            user.comparePassword(req.body.password, (err, isMatch) => {
                if(!isMatch)
                    return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})

                //비밀번호까지 같다면 Token 생성하기.
                user.generateToken((err, user) => {
                    if (err) return res.status(400).send(err);

                    // 토큰을 저장한다. 어디에? 쿠키
                    res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id})
                })
            })
        })
        .catch((err) => {
            return res.status(400).send(err);
        })
    })


    //auth route 생성
    //role 0 -> 일반유저   role 0이 아니면 관리자 role 1 어드민 role 2 특정 부서 어드민
    app.get('/api/users/auth', auth,  (req, res) => {
        //여기까지 미들웨어(auth)를 통과했다는 얘기는 Authentication이 True라는 말.
        res.status(200).json({
            _id: req.user._id,
            isAdmin: req.user.role === 0 ? false : true,
            isAuth: true,
            email: req.user.email,
            name: req.user.name,
            lastname: req.user.lastname,
            role: req.user.role,
            Image: req.user.Image
        })
    })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))   //이 앱이 port 5000번에서 실행