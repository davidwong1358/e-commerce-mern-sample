import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Axios from 'axios';
import '../style/ProductList.css';

const ProductList = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await Axios.get(`/api/products/?category=${category[0].toUpperCase() + category.slice(1)}`);
                setProducts(result.data);
            } catch (err) {
                navigate('/error');
            }
        }
        fetchProducts();
    }, [category])

    return (
        <div id="prod-container" className="m-4 mx-auto">
            {products.map((prod, idx) => (
                    <Link to={`/product/item/${prod._id}`} key={prod._id}>
                        <div className="border product-box" >
                            <img src={prod.coverImg} alt={prod.title}
                                className="product-img d-block mx-auto"
                                loading="lazy" />
                            <p className="fw-bold text-center p-1">{prod.title}</p>
                        </div>
                    </Link>
                ))}
        </div>
    )

}

export default ProductList;