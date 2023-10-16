const express = require('express')      //다운받은 express 모듈을 가져옴
const app = express()                   //function을 이용해서 새로운 app을 만들고
const port = 5000                       //5000번 포트를 백 서버로 둠
const bodyParser = require('body-parser');

const config = require('./config/key');


const { User } = require("./models/User");

//application/x-www-form-urlencoded 정보 분석
app.use(bodyParser.urlencoded({extended: true}));

//application/json 정보 분석
app.use(bodyParser.json());

const mongoose = require('mongoose')    //mongoose를 이용해서 mongoDB 연결
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongDB Connected...'))   //연결 완료시 console
  .catch(err => console.log(err))                   //에러시 console


    app.get('/', (req,res) => res.send('Hello World!~~안녕하세요~'))     //루트 디렉토리에 'Hello World' 출력


    app.post('/register', (req, res) => {
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
        user.save().then(()=>{
            res.status(200).json({
                success:true
            })
        }).catch((err)=>{
            return res.json({success:false,err})
        })
    })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))   //이 앱이 port 5000번에서 실행