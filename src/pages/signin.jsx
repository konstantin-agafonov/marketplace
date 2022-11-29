import {ReactComponent as ArrowRightIcon} from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import OAuth from "../components/oauth2";

const SignIn = () => {
    const [showPassword,setShowPassword] = useState(false)
    const [formData,setFormData] = useState({
        email: '',
        password: '',
    })
    const {email,password} = formData

    const navigate = useNavigate()
    
    const onChange = e => {
        setFormData(prev=>({
            ...prev,
            [e.target.id]: e.target.value,
        }))
    }

    const onSubmit = async e => {
        e.preventDefault()
        try {
            const auth = getAuth()
            const credentials = await signInWithEmailAndPassword(auth,email,password)
            if (credentials.user) {
                navigate('/profile')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className='pageContainer'>
                <header>
                    <p className="pageHeader">Welcome Back!</p>
                </header>
                <main>
                    <form onSubmit={onSubmit}>
                        <input
                            type="email"
                            className='emailInput'
                            value={email}
                            onChange={onChange}
                            id='email'
                        />
                        <div className="passwordInputDiv">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className='passwordInput'
                                id='password'
                                value={password}
                                onChange={onChange}
                            />
                            <img
                                src={visibilityIcon}
                                alt=""
                                className='showPassword'
                                onClick={()=>setShowPassword(prev=>!prev)}
                            />
                        </div>
                        <Link
                            to='/forgot-password'
                            className='forgotPasswordLink'
                        >
                            Forgot Password
                        </Link>
                        <div className="signInBar">
                            <p className="signInText">
                                Sign In
                            </p>
                            <button className="signInButton">
                                <ArrowRightIcon
                                    fill=''
                                    width='34px'
                                    height='34px'
                                />
                            </button>
                        </div>
                    </form>

                    <OAuth/>

                    <Link to='/sign-up' className='registerLink'>
                        Sign Up Instead
                    </Link>
                </main>
            </div>
        </>
    )
}

export default SignIn
