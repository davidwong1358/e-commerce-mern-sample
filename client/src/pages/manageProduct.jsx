import React, { useState, useEffect, useContext } from "react";
import { Container, Col, Row, Button, Form } from 'react-bootstrap';
import { PencilSquare, Trash, PlusLg } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import Axios from 'axios';
import { Store } from "../store";
import '../style/ManageProduct.css'

const ManageProduct = () => {
    const [productList, setProductList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('code');
    const [keyword, setKeyword] = useState('');
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;

    const term = searchTerm === 'title' ? 'search' : searchTerm;
    let fetchLink = `/api/products/?${term}=${keyword}`;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await Axios.get(fetchLink);
                setProductList(result.data);
            } catch (err) {
            }
        }
        fetchProducts();
    }, [])

    const handleTerm = (event) => {
        setSearchTerm(event.target.value);
        if (event.target.value === 'category') {
            setKeyword('Any');
        } else {
            setKeyword('');
        }
    }

    const handleKeyword = (event) => {
        setKeyword(event.target.value);
    }

    const handleSearchList = async (event) => {
        event.preventDefault();
        try {
            const result = await Axios.get(fetchLink);
            setProductList(result.data);
        } catch (err) {
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure to delete?')) {
            try {
                const result = await Axios.delete(`/api/products/${id}`,
                    {
                        headers: { token: `Bearer ${userInfo.accessToken}` },
                    }
                );
                const newData = await Axios.get(fetchLink);
                setProductList(newData.data);
            } catch (err) {
            }
        }
    }
    return (
        <Container id='manage-prod-container' className="mt-4">
            <h1 className="text-center mb-3">Manage Product</h1>
            <Row className="mx-1 mb-3">
                <Col md='9'>
                    <Form className="d-flex flex-wrap" onSubmit={handleSearchList}>
                        <Form.Group as={Col} xs='2' id='search-term' className="me-2">
                            <Form.Select aria-label="Search Term" value={searchTerm} onChange={handleTerm}>
                                <option value="code">Code</option>
                                <option value="title">Title</option>
                                <option value="category">Category</option>
                            </Form.Select>
                        </Form.Group>

                        {searchTerm !== 'category' ?
                            <Form.Group as={Col} className="me-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Search Keyword"
                                    value={keyword}
                                    onChange={handleKeyword} />
                            </Form.Group> :
                            <Form.Group as={Col} className="me-2">
                                <Form.Select
                                    aria-label="category"
                                    name='category'
                                    value={keyword}
                                    onChange={handleKeyword}>
                                    <option value="Any">Any</option>
                                    <option value="Rice">Rice</option>
                                    <option value="Noodles">Noodles</option>
                                    <option value="Oil">Oil</option>
                                    <option value="Sauce">Sauce</option>
                                    <option value="Spice">Spice</option>
                                </Form.Select>
                            </Form.Group>
                        }

                        <Col xs='12' sm='2'>
                            <Button
                                className="term-search-btn float-end float-md-start mt-2 mt-sm-0"
                                type='submit'>Search</Button>
                        </Col>
                    </Form>
                </Col>
                <Col xs={{ order: 'first' }} md={{ order: 'last', span: 3 }}>
                    <Link to='/product/create' className="float-end mb-2 mb-md-2">
                        <Button variant='primary' >
                            <PlusLg color="white" size={16} className='align-middle' />
                            <span className="px-1 fw-bold">Create</span>
                        </Button>
                    </Link>
                </Col>
            </Row>

            {productList !== [] && productList.map((item, idx) => (
                <Row className="border mb-3 mx-1 py-2" key={item._id}>
                    <div ><u>{`id: ${item._id || idx}`}</u></div>
                    <Row>
                        <Col xs={2} sm={1} className="my-1">
                            <strong>{item.code}</strong>
                        </Col>
                        <Col xs className="my-1 px-4">
                            <Link to={`/product/item/${item._id}`}><strong>{item.title}</strong></Link>

                        </Col>

                        <Col xs={3} sm={2} className="my-1">
                            <strong>{item.category}</strong>
                        </Col>

                        <Col sm={5} md={3} className="d-flex justify-content-around px-0">
                            <Link to={`/product/edit/${item._id}`}>
                                <Button size='sm' variant="secondary">
                                    <PencilSquare color="white" size={16} className='align-middle' />
                                    <span className="px-1 fw-bold">Edit</span>
                                </Button>
                            </Link>

                            <div>
                                <Button size='sm' variant='danger' onClick={() => handleDelete(item._id)}>
                                    <Trash color="white" size={16} className='align-middle' />
                                    <span className="px-1 fw-bold">Delete</span>
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Row>

            ))}
        </Container>
    )


}

export default ManageProduct;