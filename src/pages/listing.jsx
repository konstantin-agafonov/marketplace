import {Link, useNavigate, useParams} from "react-router-dom";
import {getDoc,doc} from 'firebase/firestore'
import {getAuth} from "firebase/auth";
import {db} from "../firebase.config";
import {useEffect, useState} from "react";

const Listing = () => {
    const [listing,setListing] = useState(null)
    const [loading,setLoading] = useState(false)
    const [shareLinkCopied,setShareLinkCopied] = useState(null)
    const params = useParams()
    const navigate = useNavigate()
    const auth = getAuth()

    useEffect(()=>{
        const fetchListing = async () => {
            setLoading(true)
            const docRef = doc(db,'m_listings',params.listingID)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                console.log(docSnap.data())
                setListing(docSnap.data())
                setLoading(false)
            }
        }
        fetchListing()
    },[navigate,params.listingID])

    return (
        <div className='listing'>
            <header>
                <h1>Listing</h1>
            </header>
            <main>
                {JSON.stringify(params)}
                <p className='exploreCategoryHeading'>Categories</p>
                <div className='exploreCategories'>
                    <Link to='/category/rent'>Rent</Link>
                    <Link to='/category/sale'>Sell</Link>
                </div>
            </main>
        </div>
    )
}

export default Listing