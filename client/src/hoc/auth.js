//import { Axios } from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from '../_actions/user_action';
import { useNavigate } from "react-router-dom";

export default function (SpecificComponent, option, adminRoute = null) {

    //사용하지 않을경우 기본값 null이 들어감
    
    /*
    option 종류
    null    => 아무나 출입 가능한 페이지
    true    => 로그인한 유저만 출입이 가능한 페이지
    false   => 로그인한 유저는 출입 불가능
    
    adminRoute 관리자만 접근 가능한 페이지
    true
    false
    */
   
   function AuthenticationCheck() {
        const navigate = useNavigate();
        const dispatch = useDispatch();

        useEffect(() => {

            dispatch(auth()).then(response => {
                console.log(response)

                //분기처리
                //로그인 하지 않은 상태
                if(!response.payload.isAuth) {
                    if(option) {
                        //옵션이 true일 경우
                        navigate('/login')
                    }
                } else {
                    //로그인 한 상태
                    if(adminRoute && !response.payload.isAdmin) {
                        //adminRoute가 true면서, isAdmin이 false일 경우
                        navigate('/')
                    } else {
                        if(option === false)
                        navigate('/')
                    }
                }
            })
        })

        return (
            <SpecificComponent />
        )
    }

    return AuthenticationCheck
}