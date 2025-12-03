import Template from "../components/core/Login-SignupPage/Template"
import loginImg from '../assets/Images/login.webp'
import { useState } from "react";
import Spinner from "../components/common/Spinner";

function Login(){

    const [loading, setLoading] = useState(false)

    if(loading) return <Spinner />

    return(
        <div>
            <Template 
                title = 'Welcome Back'
                desc1 = 'Build skills for today, tomorrow, and beyond'
                desc2 = 'Education to future-proof your career'
                image = {loginImg}
                formtype = 'login'
                setLoading={setLoading}
            />
        </div>
    )
}

export default Login;