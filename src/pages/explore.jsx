import {Link} from "react-router-dom";

const Explore = () => {
    return (
        <div className='explore'>
            <header>
                <h1>Explore</h1>
            </header>
            <main>
                <p className='exploreCategoryHeading'>Categories</p>
                <div className='exploreCategories'>
                    <Link to='/category/rent'>Rent</Link>
                    <Link to='/category/sale'>Sell</Link>
                </div>
            </main>
        </div>
    )
}

export default Explore