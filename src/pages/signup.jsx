import {ReactComponent as ArrowRightIcon} from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

const SignUp = () => {
    const [showPassword,setShowPassword] = useState(false)
    const [formData,setFormData] = useState({
        name: '',
        email: '',
        password: '',
    })
    const {name,email,password} = formData

    const navigate = useNavigate()

    const onChange = e => {
        setFormData(prev=>({
            ...prev,
            [e.target.id]: e.target.value,
        }))
    }

    return (
        <>
            <div className='pageContainer'>
                <header>
                    <p className="pageHeader">Welcome new user!</p>
                </header>
                <main>
                    <form>
                        <input
                            type="text"
                            className='nameInput'
                            value={name}
                            onChange={onChange}
                            id='name'
                        />
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
                        <div className="signUpBar">
                            <p className="signUpText">
                                Sign Up
                            </p>
                            <button className="signUpButton">
                                <ArrowRightIcon
                                    fill=''
                                    width='34px'
                                    height='34px'
                                />
                            </button>
                        </div>
                    </form>

                    <Link to='/sign-in' className='registerLink'>
                        Sign In Instead
                    </Link>
                </main>
            </div>
        </>
    )
}

export default SignUp
