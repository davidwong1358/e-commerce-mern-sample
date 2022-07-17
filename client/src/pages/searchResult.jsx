import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Axios from 'axios';
import '../style/ProductList.css';

const SearchResult = () => {
    let { keyword } = useParams();
    const [result, setResult] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await Axios.get(`/api/products/?title=${keyword}`);
                setResult(result.data);
            } catch (err) {
                navigate('/error');
            }
        }
        fetchProducts();
    }, [keyword])

    return (
        <>
            <h1 className="mx-auto my-3">Search Result for: {keyword}</h1>
            <div id="prod-container" className="m-4 mx-auto">
                {result.map((item, idx) => (
                        <Link to={`/product/item/${item._id}`} key={item._id}>
                            <div className="border product-box" >
                                <img src={item.coverImg} alt={item.title}
                                    className="product-img d-block mx-auto"
                                    loading="lazy" />
                                <p className="fw-bold text-center p-1">{item.title}</p>
                            </div>
                        </Link>
                    ))}
            </div>
        </>
    );
}

export default SearchResult;