import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {toast} from "react-toastify";
import {getStorage,ref,uploadBytesResumable,getDownloadURL} from 'firebase/storage'
import {v4} from 'uuid'
import {addDoc,collection,serverTimestamp} from "firebase/firestore";
import {db} from "../firebase.config";

const CreateListing = () => {
    const [formData,setFormData] = useState({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0,
    })

    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        address,
        offer,
        regularPrice,
        discountedPrice,
        images,
        latitude,
        longitude,
    } = formData

    const [loading,setLoading] = useState(false)

    const auth = getAuth()
    const navigate = useNavigate()
    const isMounted = useRef(true)

    useEffect(()=>{
        if (isMounted) {
            onAuthStateChanged(auth,user=>{
                if (user) {
                    setFormData(prev=>({
                        ...prev,
                        userRef: user.uid,
                    }))
                } else {
                    navigate('/sign-in')
                }
            })
        }

        return () => {
            isMounted.current = false
        }
    },[isMounted])

    const onSubmit = e => {
        e.preventDefault()
        setLoading(true)
        if (discountedPrice >= regularPrice) {
            setLoading(false)
            toast.error('Discounted proce needs to be less then regular price')
            return
        }
        if (images.length > 6) {
            setLoading(false)
            toast.error('Max 6 images')
            return
        }
        const geolocation = {}
        geolocation.lat = latitude
        geolocation.lng = longitude
        const location = address

        const storeImage = image => {
            return new Promise((resolve,reject)=>{
                const storage = getStorage()
                const fileName = `${auth.currentUser.uid}-${v4()}-${image.name}`
                const storageRef = ref(storage,'images/' + fileName)
                const uploadTask = uploadBytesResumable(storageRef, image)
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        reject(error)
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            console.log('File available at', downloadURL)
                            resolve(downloadURL)
                        });
                    }
                )
            })
        }

        const loadImages = async () => {
            const urls = await Promise.all(
                [...images].map(image=>storeImage(image))
            ).catch(error=>{
                toast.error(error)
                setLoading(false)
                return
            })
            return urls
        }

        loadImages().then(imgUrls=>{
            console.log(imgUrls)
            const formDataCopy = {
                ...formData,
                imgUrls,
                geolocation,
                location,
                timestamp: serverTimestamp(),
            }
            delete formDataCopy.images
            delete formDataCopy.address
            !formDataCopy.offer && delete formDataCopy.discountedPrice
            addDoc(collection(db,'m_listings'),formDataCopy).then(docRef=>{
                toast.success('Listing saved!')
                setLoading(false)
                navigate(`/category/${formDataCopy.type}/${docRef.id}`)
            })
        })
    }

    const onMutate = e => {
        let boolean = null

        if (e.target.value === 'true') {
            boolean = true
        }
        if (e.target.value === 'false') {
            boolean = false
        }

        // Files
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files,
            }))
        }

        // Text/Booleans/Numbers
        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }))
        }
    }

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
            <div className='profile'>
                <header>
                    <p className='pageHeader'>Create Listing</p>
                </header>
                <main>
                    <form
                        className=''
                        onSubmit={onSubmit}
                    >
                        <label
                            htmlFor="type"
                            className='formLabel'
                        >Sell / Rent</label>
                        <button
                            type='button'
                            className={type === 'sale' ? 'formButtonActive' : 'formButton'}
                            id='type'
                            value='sale'
                            onClick={onMutate}
                        >Sell</button>
                        <button
                            type='button'
                            className={type === 'rent' ? 'formButtonActive' : 'formButton'}
                            id='type'
                            value='rent'
                            onClick={onMutate}
                        >Rent</button>

                        <label className='formLabel'>Name</label>
                        <input
                            className='formInputName'
                            type='text'
                            id='name'
                            value={name}
                            onChange={onMutate}
                            maxLength='32'
                            minLength='10'
                            required
                        />

                        <div className='formRooms flex'>
                            <div>
                                <label className='formLabel'>Bedrooms</label>
                                <input
                                    className='formInputSmall'
                                    type='number'
                                    id='bedrooms'
                                    value={bedrooms}
                                    onChange={onMutate}
                                    min='1'
                                    max='50'
                                    required
                                />
                            </div>
                            <div>
                                <label className='formLabel'>Bathrooms</label>
                                <input
                                    className='formInputSmall'
                                    type='number'
                                    id='bathrooms'
                                    value={bathrooms}
                                    onChange={onMutate}
                                    min='1'
                                    max='50'
                                    required
                                />
                            </div>
                        </div>

                        <label className='formLabel'>Parking spot</label>
                        <div className='formButtons'>
                            <button
                                className={parking ? 'formButtonActive' : 'formButton'}
                                type='button'
                                id='parking'
                                value={true}
                                onClick={onMutate}
                                min='1'
                                max='50'
                            >
                                Yes
                            </button>
                            <button
                                className={
                                    !parking && parking !== null ? 'formButtonActive' : 'formButton'
                                }
                                type='button'
                                id='parking'
                                value={false}
                                onClick={onMutate}
                            >
                                No
                            </button>
                        </div>

                        <label className='formLabel'>Furnished</label>
                        <div className='formButtons'>
                            <button
                                className={furnished ? 'formButtonActive' : 'formButton'}
                                type='button'
                                id='furnished'
                                value={true}
                                onClick={onMutate}
                            >
                                Yes
                            </button>
                            <button
                                className={
                                    !furnished && furnished !== null
                                        ? 'formButtonActive'
                                        : 'formButton'
                                }
                                type='button'
                                id='furnished'
                                value={false}
                                onClick={onMutate}
                            >
                                No
                            </button>
                        </div>

                        <label className='formLabel'>Address</label>
                        <textarea
                            className='formInputAddress'
                            type='text'
                            id='address'
                            value={address}
                            onChange={onMutate}
                            required
                        />

                            <div className='formLatLng flex'>
                                <div>
                                    <label className='formLabel'>Latitude</label>
                                    <input
                                        className='formInputSmall'
                                        type='number'
                                        id='latitude'
                                        value={latitude}
                                        onChange={onMutate}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='formLabel'>Longitude</label>
                                    <input
                                        className='formInputSmall'
                                        type='number'
                                        id='longitude'
                                        value={longitude}
                                        onChange={onMutate}
                                        required
                                    />
                                </div>
                            </div>

                        <label className='formLabel'>Offer</label>
                        <div className='formButtons'>
                            <button
                                className={offer ? 'formButtonActive' : 'formButton'}
                                type='button'
                                id='offer'
                                value={true}
                                onClick={onMutate}
                            >
                                Yes
                            </button>
                            <button
                                className={
                                    !offer && offer !== null ? 'formButtonActive' : 'formButton'
                                }
                                type='button'
                                id='offer'
                                value={false}
                                onClick={onMutate}
                            >
                                No
                            </button>
                        </div>

                        <label className='formLabel'>Regular Price</label>
                        <div className='formPriceDiv'>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='regularPrice'
                                value={regularPrice}
                                onChange={onMutate}
                                min='50'
                                max='750000000'
                                required
                            />
                            {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
                        </div>

                        {offer && (
                            <>
                                <label className='formLabel'>Discounted Price</label>
                                <input
                                    className='formInputSmall'
                                    type='number'
                                    id='discountedPrice'
                                    value={discountedPrice}
                                    onChange={onMutate}
                                    min='50'
                                    max='750000000'
                                    required={offer}
                                />
                            </>
                        )}

                        <label className='formLabel'>Images</label>
                        <p className='imagesInfo'>
                            The first image will be the cover (max 6).
                        </p>
                        <input
                            className='formInputFile'
                            type='file'
                            id='images'
                            onChange={onMutate}
                            max='6'
                            accept='.jpg,.png,.jpeg'
                            multiple
                            required
                        />
                        <button type='submit' className='primaryButton createListingButton'>
                            Create Listing
                        </button>
                    </form>
                </main>
            </div>
        )
}

export default CreateListing