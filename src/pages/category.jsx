import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {db} from '../firebase.config'
import {collection,getDocs,query,where,orderBy,limit,startAfter} from 'firebase/firestore'
import {toast} from "react-toastify";
import Listing from "./listing";

const Category = () => {
    const [listings,setListings] = useState(null)
    const [loading,setLoading] = useState(false)
    const params = useParams()

    useEffect(()=>{
        const fetchListings = async () => {
            setLoading(true)
            const q = query(
                collection(db,'m_listings'),
                where('type','==',params.categoryName),
                orderBy('timestamp','desc'),
                limit(10)
            )
            const querySnap = await getDocs(q)
            const listings = []
            querySnap.forEach(doc=>{
                listings.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })
            setListings(listings)
            setLoading(false)
        }

        fetchListings()
    },[params.categoryName])

    return (
        <div className='category'>
            <header>
                <h1>{params.categoryName}</h1>
            </header>
            <main>
                {loading ? (
                    <h2>Loading...</h2>
                ) : listings && listings.length > 0 ? (
                    <ul className='categoryListings'>
                        {listings.map(listing=>(
                            <Listing
                                key={listing.id}
                                id={listing.id}
                                listing={listing.data}
                            />
                        ))}
                    </ul>
                ) : (
                    <h2>No listings</h2>
                )}
            </main>
        </div>
    )
}

export default Category