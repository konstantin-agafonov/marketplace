import {Link} from "react-router-dom";

const Listing = ({listing,id,onDelete}) => {
    return (
        <li className='categoryListing'>
            <Link
                to={`/category/${listing.type}/${id}`}
                className='categoryListingLink'
            >
                <img
                    src={listing.imageUrls[0]}
                    alt={listing.name}
                    className='categoryListingImg'
                />
            </Link>
            <div className='categoryListingDetails'>
                <p className='categoryListingLocation'>
                    {listing.location}
                </p>
                <p className='categoryListingName'>
                    {listing.name}
                </p>
                <p className='categoryListingPrice'>
                    {listing.offer ? listing.discountedPrice : listing.regularPrice}
                </p>
            </div>
            {onDelete && (
                <p onClick={()=>onDelete}>!Delete!</p>
            )}
        </li>
    )
}

export default Listing