/**
 * 작성자 : jay
 * 일자   : 2023.10.19
 * 설명   : 개발환경, 배포환경 구분
 */

if(process.env.NODE_ENV === 'production') {
    //process.env.NODE_ENV = 개발/배포 환경 확인
    module.exports = require('./prod');
    //배포 환경일 경우 prod.js
} else {
    module.exports = require('./dev')
    //개발 환경일 경우  dev.js 파일
}