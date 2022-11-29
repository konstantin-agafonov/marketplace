import {useLocation, useNavigate} from "react-router-dom";
import {getAuth,GoogleAuthProvider,signInWithPopup} from "firebase/auth";
import {doc, setDoc, getDoc, serverTimestamp} from "firebase/firestore";
import {db} from "../firebase.config";
import {toast} from "react-toastify";

const OAuth = () => {
    const auth = getAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const onClick = async e => {
        try {
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth,provider)
            const user = result.user
            const docRef = doc(db,'users',user.uid)
            const docSnap = await getDoc(docRef)
            if (!docSnap.exists()) {
                await setDoc(doc(db,'users',user.uid),{
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }
            navigate('/profile')
        } catch (error) {
            toast.error(error)
        }
    }

    return (
        <div className='socialLogin'>
            <p>Sign {location.pathname === '/sign-up' ? 'UP' : 'IN'} with</p>
            <button
                onClick={onClick}
            >
                GOOGLE!
            </button>
        </div>
    )
}

export default OAuth