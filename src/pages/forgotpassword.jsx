import {getAuth, sendPasswordResetEmail } from 'firebase/auth'
import {useState} from "react";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";

const Forgotpassword = () => {
    const [email,setEmail] = useState('')

    const onChange = e => setEmail(e.target.value)

    const onSubmit = async e => {
        e.preventDefault()
        try {
            const auth = getAuth()
            await sendPasswordResetEmail(auth,email)
            toast.success('Email was sent')
            console.log('Email was sent')
        } catch (error) {
            toast.error(error)
        }
    }

    return (
        <div className='pageContainer'>
            <header>
                <p className="pageHeader">Forgot Password</p>
            </header>
            <main>
                <form onSubmit={onSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={onChange}
                        id='email'
                        className='emailInput'
                    />
                    <Link
                        className="forgotPasswordLink"
                        to='/sign-in'
                    >
                        Sign In
                    </Link>
                    <div className="signInBar">
                        <div className="signInText">Send RESET Link</div>
                        <button
                            className='signInButton'
                        >
                            Send
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}

export default Forgotpassword
