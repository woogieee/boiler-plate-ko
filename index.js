const express = require('express')      //다운받은 express 모듈을 가져옴
const app = express()                   //function을 이용해서 새로운 app을 만들고
const port = 5000                       //5000번 포트를 백 서버로 둠


const mongoose = require('mongoose')    //mongoose를 이용해서 mongoDB 연결
mongoose.connect('mongodb+srv://jay:aaaa1234@cluster0.sddrall.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongDB Connected...'))   //연결 완료시 console
  .catch(err => console.log(err))                   //에러시 console



app.get('/', (req,res) => res.send('Hello World!~~안녕하세요~'))     //루트 디렉토리에 'Hello World' 출력

app.listen(port, () => console.log(`Example app listening on port ${port}!`))   //이 앱이 port 5000번에서 실행