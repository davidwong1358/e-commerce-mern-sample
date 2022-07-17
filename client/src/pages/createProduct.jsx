import React, { useContext } from 'react';
import { Store } from '../store';
import { Container, Row } from 'react-bootstrap';
import '../style/ManageProduct.css'
import ProductForm from '../component/ProductForm';
import { useNavigate } from "react-router-dom";
import Axios from 'axios';


const initialize = {
    code: '',
    title: '',
    description: '',
    coverImg: '',
    category: 'Rice',
    sku: [{
        itemName: '',
        price: 0,
        unit: 'Box(es)',
        inStock: 0,
        img: '',
        discount: 0,
    }]

}

const CreateProduct = () => {
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();
    const productSubmit = async (values) => {
        try {
            const { data } = await Axios.post('/api/products', values,
                {
                    headers: { token: `Bearer ${userInfo.accessToken}` },
                });
            navigate('/product/manage');
        } catch (err) {
            alert(JSON.stringify(err, null, 2));
            console.log(err);
        }
    }
    return (
        <Container id='create-prod-form' className='mb-5'>
            <div className="py-4 text-center">
                <h1>Create Product</h1>
            </div>
            <Row className='g-5'>
                <ProductForm initialize={initialize} onSubmit={productSubmit} formFor='Create' />
            </Row>
        </Container >
    )

}

export default CreateProduct;