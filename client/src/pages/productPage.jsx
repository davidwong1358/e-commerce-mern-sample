import React, { useReducer, useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from 'axios';
import { Container, Spinner } from "react-bootstrap";
import '../style/Product.css';
import { Store } from "../store";


const initialCount = { count: 1 };

const reducer = (state, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return state.count < 99 ? { count: state.count + 1 } : { count: 99 };
        case "DECREMENT":
            return state.count > 1 ? { count: state.count - 1 } : { count: 1 };
        case "RESET":
            return { count: 1 };
        default:
            throw new Error();
    }
}

const ProductPage = () => {
    const noImagePath = '/img/no_image.svg';

    const { pid } = useParams();
    const [product, setProduct] = useState({});
    const [item, setItem] = useState({});
    const [quantity, dispatch] = useReducer(reducer, initialCount);
    const { state, dispatch: ctxDispatch } = useContext(Store);

    const navigate = useNavigate();

    const switchProduct = (idx) => {
        setItem(product.sku[idx]);
        dispatch({ type: 'RESET' });
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await Axios.get(`/api/products/find/${pid}`);
                if (result === null) {
                    navigate('/error');
                } else {
                    setProduct(result.data);
                    setItem(result.data.sku[0]);
                }
            } catch (err) {
                navigate('/error');
            }
        };
        fetchData();
    }, [pid]);

    const handleAddCart = () => {
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: {
                _id: product._id,
                code: product.code,
                title: product.title,
                sku: item,
                quantity: quantity.count
            }
        })
    }
    return product !== {} && !product.hasOwnProperty('sku') ?
        (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        ) :
        (
            <Container id="product-container" className="mt-3 px-3">
                <div className="row">
                <div id='product-img' className="col-md-4 p-3">
                    <img src={item.img !== '' ? item.img : noImagePath}
                        alt={item.itemName} className="d-block mx-auto product-box-img" />
                </div>
                <div id='product-info' className="col-md p-3">
                    <h2>{product.title}</h2>
                    <h4 className="text-secondary">{item.itemName}</h4>
                    <div id="price-container" className="px-2 mt-2 w-100 bg-warning">
                        {item.discount > 0 ?
                            <h3><del className="me-2">${item.price}</del>
                                ${item.price * (100 - item.discount) / 100}</h3> :
                            <h3>${item.price}</h3>
                        }
                    </div>
                    <p className="px-2 bg-dark text-white">In-stock: {item.inStock > 0? item.inStock: 'Out of Stock'}</p>
                    {product.description !== '' && <p className="desc-text py-1">{product.description}</p>}

                    {product.hasOwnProperty('sku') && <div id="item-container" className="my-4">
                        {product.sku.map((item, index) => (
                            <button className="mx-3 item-btn p-0 btn btn-outline-danger"
                                key={item._id}
                                onClick={() => switchProduct(index)}>
                                <img src={item.img !== '' ? item.img : noImagePath}
                                    alt={item.itemName} className="item-img" />
                            </button>
                        ))}
                    </div>}

                    <div id="num-container">
                        <button className="btn btn-outline-primary btn-sm"
                            onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>

                        <div id="num-counter" className="d-inline-block mx-2 text-center">{quantity.count}</div>

                        <button className="btn btn-outline-primary btn-sm"
                            onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>

                        <span className="mx-2">{item.unit || 'Pieces'}</span>
                    </div>
                    <button className="btn btn-outline-primary my-2"
                        onClick={handleAddCart}
                        disabled={item.inStock < quantity.count}>Add to Cart</button>

                </div>
                </div>
            </Container>
        )
}

export default ProductPage;