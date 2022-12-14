import {updateProfile,getAuth} from "firebase/auth";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {doc, updateDoc} from "firebase/firestore";
import {db} from '../firebase.config'
import {toast} from "react-toastify";


const Profile = () => {
    const auth = getAuth()
    const [formData,setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    })
    const [changeDetails,setChangeDetails] = useState(false)

    const {name,email} = formData

    const navigate = useNavigate()

    const onLogout = () => {
        auth.signOut().then(()=>{
            navigate('/sign-in')
        })
    }

    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, {
                    displayName: name,
                })
                const userRef = doc(db,'users',auth.currentUser.uid)
                await updateDoc(userRef,{
                    name
                })
            }
        } catch (error) {
            toast.error('!Could not update user!')
        }
    }

    const onChange = e => {
        setFormData(prev=>({
            ...prev,
            [e.target.id]: e.target.value,
        }))
    }

    return (
        <div className='profile'>
            <header className="profileHeader">
                <p className="pageHeader">My profile</p>
                <h1>{formData.name}</h1>
                <button
                    type='button'
                    className='logOut'
                    onClick={onLogout}
                >
                    Logout
                </button>
            </header>
            <main>
                <div className="profileDetailsHeader">
                    <p className="profileDetailsText">
                        Personal Details
                    </p>
                    <p
                        className="changePersonalDetails"
                        onClick={()=>{
                            changeDetails && onSubmit()
                            setChangeDetails(prev=>!prev)
                        }}
                    >
                        {changeDetails ? 'done' : 'change'}
                    </p>
                </div>
                <div className="profileCard">
                    <form>
                        <input
                            type="text"
                            id='name'
                            className={!changeDetails ? 'profileName' : 'profileNameActive'}
                            disabled={!changeDetails}
                            value={name}
                            onChange={onChange}
                        />
                        <input
                            type="text"
                            id='email'
                            className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
                            disabled={!changeDetails}
                            value={email}
                            onChange={onChange}
                        />
                    </form>
                </div>
                <Link
                    to='/create-listing'
                    className='createListing'
                >
                    Create Listing
                </Link>
            </main>
        </div>
    )
}

export default Profile
