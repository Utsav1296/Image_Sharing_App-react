import React from 'react'
import { useNavigate } from 'react-router-dom';
// import { FcGoogle } from 'react-icons/fc'
import login_social from '../assets/login_social.mp4'
import logo from '../assets/logo.png'
import { GoogleLogin, googleLogout, GoogleOAuthProvider } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import { client } from '../client';

const Login = () => {
    const navigate = useNavigate();

    const responseGoogle = (response) => {
        localStorage.setItem('user', JSON.stringify(jwt_decode(response.credential)))
        // console.log(jwt_decode(response.credential))
        const { name, sub, picture } = jwt_decode(response.credential)

        const doc = {
            _id: sub,
            _type: 'user',
            userName: name,
            image: picture
        }
        client.createIfNotExists(doc).then(
            navigate('/', { replace: true })
        )
    }


    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_REACT_APP_GOOGLE_API_TOKEN}>
            <div className="flex items-center justify-start h-screen">
                {/* video  */}
                <div className="relative w-full h-full]">
                    <video
                        src={login_social}
                        type='video.mp4'
                        autoPlay
                        loop
                        muted
                        controls={false}
                        className='w-full h-[100vh] object-cover '
                    />
                </div>
                {/* image with overlay  */}
                <div className="absolute flex flex-col items-center justify-center top-0 left-0 bottom-0 right-0 bg-[#000000a7]">
                    <div className="p-5">
                        <img src={logo} alt="logo" className='w-[60px] rounded-lg' />
                    </div>

                    <div className="shadow-2xl ">

                        <GoogleLogin
                            onSuccess={responseGoogle}
                            onError={() => console.log('error')} theme='filled_black' shape='rectangle' />
                    </div>
                </div>
            </div>

        </GoogleOAuthProvider>
    )
}

export default Login