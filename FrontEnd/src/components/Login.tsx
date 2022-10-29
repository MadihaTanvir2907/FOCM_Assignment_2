import React, {useCallback, useEffect, useState} from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from "react-google-login";
import { gapi } from 'gapi-script';
import { LoginSocialTwitter } from 'reactjs-social-login';
import Button from 'react-bootstrap/Button';
import {useGeolocated} from "react-geolocated";
import axios from "axios";
import { useNavigate } from "react-router-dom";



function loginAuth(source: any, token: any, email: any, lat: any, lng: any) {
    return axios.post('http://localhost:8000/profile/token/', {
        source: source,
        token: token,
        email: email,
        lat: lat,
        lng: lng
    },{
        method: 'post'
    })
        .then(function (response) {
            console.log(response);
            localStorage.setItem('token', response.data.access)
            localStorage.setItem('source', response.data.user.source)
            return true
        })
        .catch(function (error) {
            console.log(error);
            return false
        });
}

function LoadFacebookLogin(login:any) {
    const navigate = useNavigate()
    const { coords } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: false,
        },
        userDecisionTimeout: 5000,
    });
    const FacebookResponse = async (res: any) => {
        console.log(res)
        const resp = await loginAuth('fb',res.accessToken,res.email,coords?.latitude,coords?.longitude)
        if (resp) {navigate("/")}
    }

    return (
        <div>
            {login &&
              <FacebookLogin
                cssClass="btn btn-info text-white w-100"
                textButton='Facebook'
                appId="660144899039889"
                fields="name,email,picture"
                callback={FacebookResponse}
              />
            }
        </div>
    )
}
function LoadGoogleLogin(login: any): any {
    const navigate = useNavigate()
    const clientId = '644475778543-lnlrnugfqs13qh15e33qhdkbo18ksmng.apps.googleusercontent.com';
    const { coords } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: false,
        },
        userDecisionTimeout: 5000,
    });
    const GoogleResponse = async (res: any) => {
        console.log(res)
        const resp = await loginAuth('google',res.accessToken,res.profileObj.email,coords?.latitude,coords?.longitude)
        if (resp) navigate("/")
    }
    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: clientId,
                scope: ''
            });
        };
        gapi.load('client:auth2', initClient);
    });

    return (
        <div>
            {login &&
              <GoogleLogin
                clientId={clientId}
                buttonText="Google"
                onSuccess={GoogleResponse}
                onFailure={response}
                cookiePolicy={'single_host_origin'}
              />
            }
        </div>
    )
}
function LoadTwitterLogin(): any {
    const onLoginStart = useCallback(() => {}, [])
    const navigate = useNavigate()
    return (
        <div>
            <LoginSocialTwitter
                client_id={process.env.REACT_APP_TWITTER_API_KEY || ''}
                redirect_uri="https://localhost:3000/login"
                onLoginStart={onLoginStart}
                onResolve={(data) => {
                    console.log(data)
                }}
                onReject={(err: any) => {
                    console.log(err)
                }}
            >
                <Button type='button' className='w-100'>Twitter</Button>
            </LoginSocialTwitter>
        </div>
    )
}

function response(res: any){
    console.log(res)
}
function Login(){
    const navigate = useNavigate();

    return (
            <div className='vh-100 bg-dark d-flex align-items-center'>
                <div className="container p-6 bg-white h-50">
                    <div className="mb-4">
                        <h1>Welcome To Login Page</h1>
                    </div>
                        <div>
                            <div className='mt-2'>
                                <LoadFacebookLogin  />
                            </div>
                            <div className='mt-2'   >
                                <LoadTwitterLogin />
                            </div>
                            <div className='mt-2'>
                                <LoadGoogleLogin />
                            </div>
                        </div>
                    <div>
                    </div>
                </div>
            </div>
    );
}

export default Login;
