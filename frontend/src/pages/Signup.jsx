import signupImg from '../assets/Images/signup.webp'
import Spinner from '../components/common/Spinner';
import Template from '../components/core/Login-SignupPage/Template';
import { useState } from 'react';

function Signup() {

    const [loading, setLoading] = useState(false)

    if(loading) return <Spinner />

    return (
        <div>
            <Template
                title='Join the millions learning to code with StudyNotion for free'
                desc1='Build skills for today, tomorrow, and beyond'
                desc2='Education to future-proof your career'
                image={signupImg}
                formtype='signup'
                setLoading={setLoading}
            />
        </div>
    )
}

export default Signup;