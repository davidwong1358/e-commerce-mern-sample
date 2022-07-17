import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row } from 'react-bootstrap';
import ProductForm from '../component/ProductForm';
import { Store } from '../store';
import Axios from 'axios';

const EditProduct = () => {
    const { pid } = useParams();
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;

    const [product, setProduct] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await Axios.get(`/api/products/find/${pid}`);
                if (result === null) {
                    navigate('/error');
                } else {
                    setProduct(result.data);
                    console.log(result);
                }
            } catch (err) {
                navigate('/error');
            }
        };
        fetchData();
    }, [pid]);

    let initialize = {
        code: product.code,
        title: product.title,
        description: product.description,
        coverImg: product.coverImg,
        category: product.category,
        sku: product.sku
    }

    const handleUpdate = async (values) => {
        try {
            const { data } = await Axios.put(`/api/products/${pid}`, values,
                {
                    headers: { token: `Bearer ${userInfo.accessToken}` },
                });
            alert('Update Success');
        } catch (err) {
            alert(JSON.stringify(err, null, 2));
            console.log(err);
        }
    }

    return (
        <Container id='edit-prod-form' className='mb-5'>
            <div className="py-4 text-center">
                <h1>Edit Product</h1>
            </div>
            {product.hasOwnProperty('code') &&
                <Row className='g-5'>
                    <ProductForm initialize={initialize} formFor='Edit' onSubmit={handleUpdate}/>
                </Row>
            }
        </Container>
    )

}

export default EditProduct;