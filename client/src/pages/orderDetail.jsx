import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Col, Row, Button, Form, InputGroup, Badge, ListGroup } from 'react-bootstrap';
import { ArrowReturnLeft } from "react-bootstrap-icons";
import { Formik } from 'formik';
import { Store } from '../store';
import Axios from 'axios';
import '../style/Order.css';

const OrderDetail = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState({});
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const result = await Axios.get(`/api/orders/find/${orderId}`, {
                    params: { "id": userInfo._id },
                    headers: { token: `Bearer ${userInfo.accessToken}` },

                });
                setOrder(result.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchOrder();
    }, [orderId])

    const orderData = {
        id: order._id,
        userInfo: order.userInfo,
        name: order.name,
        phone: order.phone,
        address: order.address,
        payment: order.payment,
        cardNumber: order.cardNumber,
        cardHolder: order.cardHolder,
        expiryDate: order.expiryDate,
        cvv: order.cvv,
        notes: order.notes,
        total: order.total,
        status: order.status,
        message: order.message || ''
    }

    const handleUpdate = async (values, init, products) => {
        try {
            const result = await Axios.put(`/api/orders/${orderId}`, values,
                {
                    headers: { token: `Bearer ${userInfo.accessToken}` },
                }
            );
            
            if (orderData.status !== 'Cancelled' && values.status === 'Cancelled') {
                const addProduct = await Axios.put('/api/products', order.products, {
                    params: {
                        operation: 'add',
                        id: userInfo._id
                    },
                    headers: { token: `Bearer ${userInfo.accessToken}` }
                })
            } else if (orderData.status === 'Cancelled' && values.status !== 'Cancelled') {
                const reduceProduct = await Axios.put('/api/products', order.products, {
                    params: {
                        operation: 'reduce',
                        id: userInfo._id
                    },
                    headers: { token: `Bearer ${userInfo.accessToken}` }
                })
            }
            alert('Update Success');
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    return order._id !== undefined && (
        <Container id='order-detail-container' className="my-4 px-4">
            <div className='row justify-content-center'>
                <h1 className="text-center">Order Details</h1>
                <Link to='/order' className="text-center mb-3"><ArrowReturnLeft className="me-2" />Back to Order Page</Link>
            </div>

            {order.products !== undefined && <ProductList products={order.products} total={order.total} />}

            <hr className='my-4' />

            <OrderForm orderInfo={orderData} date={order.createdAt} isAdmin={userInfo.isAdmin} onSubmit={handleUpdate} product={order.products} />

        </Container>
    )
}

const ProductList = ({ products, total }) => {
    return (
        <Row>
            <h4 className="mb-2">
                <span className="text-danger  me-3">Your cart</span>
                <Badge pill bg="danger ">{products.length}</Badge>
            </h4>
            <div className=' d-none d-md-block pe-4'>
                <Row className="mb-2">
                    <div className="col-md fw-bold">Product</div>
                    <div className="col-md-2 fw-bold text-center">Unit Price</div>
                    <div className="col-md-2 fw-bold text-center">Quantity</div>
                    <div className="col-md-2 fw-bold text-center">Sub-Total</div>
                </Row>

            </div>

            <ListGroup className="mb-3">
                {
                    products.map((item, key) => (
                        <ListGroup.Item className="lh-sm" key={key}>
                            <Row>
                                <Col sm={12} md>
                                    <Row >
                                        <Col xs={3} className="text-start">
                                            <strong>{item.code}</strong>
                                        </Col>

                                        <Col xs className="text-start">
                                            <strong>
                                                {item.title}
                                            </strong>
                                            <div className="text-secondary">
                                                {item.sku.itemName}
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col sm md={2} className='text-center py-2'>
                                    <Row>
                                        <Col xs={6} className='d-block d-sm-none'>
                                            <strong>Unit Price</strong>
                                        </Col>
                                        <Col xs={6} sm={12}>
                                            {item.sku.discount > 0 ?
                                                <del className='text-secondary'>{`$${item.sku.price}`}</del> :
                                                `$${item.sku.price}`} <br />
                                            {item.sku.discount > 0 ?
                                                `$${item.sku.price * (100 - item.sku.discount) / 100}` :
                                                <div></div>
                                            }
                                        </Col>
                                    </Row>
                                </Col>

                                <Col sm md={2} className='text-center py-2'>
                                    <Row>
                                        <Col xs={6} className='d-block d-sm-none'>
                                            <strong>Quantity</strong>
                                        </Col>
                                        <Col xs={6} sm={12}>
                                            <div className="d-inline-block mx-2 text-center num-box">{item.quantity}</div>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col sm md={2} className='text-center py-2'>
                                    <Row>
                                        <Col xs={6} className='d-block d-sm-none'>
                                            <strong>Amount</strong>
                                        </Col>
                                        <Col xs={6} sm={12}>
                                            ${item.sku.price * (100 - item.sku.discount) / 100 * item.quantity}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))
                }

                <ListGroup.Item>
                    <Row>
                        <Col xs>
                            <span>Total (HKD)</span>
                        </Col>

                        <Col xs={6} sm={4} md={2} className="text-center">
                            <strong>${total}</strong>
                        </Col>
                    </Row>


                </ListGroup.Item>
            </ListGroup>

        </Row>
    )
}

const OrderForm = ({ orderInfo, date, isAdmin, onSubmit }) => {
    return (
        <Formik
            initialValues={orderInfo}
            onSubmit={(values) => {
                onSubmit(values);
            }}
        >
            {
                ({ values, handleSubmit, handleChange }) => (
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} md className='mb-3 mb-md-0'>
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    name="userInfo.user"
                                    value={values.userInfo.username} readOnly
                                />
                            </Form.Group>

                            <Form.Group as={Col} md >
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    name="userInfo.email"
                                    value={values.userInfo.email} readOnly
                                />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} md="7" className='mb-3 mb-md-0'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    name="name"
                                    value={values.name} readOnly
                                />
                            </Form.Group>

                            <Form.Group as={Col} md="5">
                                <Form.Label>Phone Number</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text id="telCode">+852</InputGroup.Text>
                                    <Form.Control
                                        name="phone"
                                        maxLength="8"
                                        value={values.phone} readOnly
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Row>

                        <Form.Group>
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                name="address"
                                value={values.address} readOnly
                            />
                        </Form.Group>

                        <hr className='my-4' />

                        <Form.Group controlId="payment" className='mb-3'>
                            <InputGroup>
                                <InputGroup.Text id="payment">Payment</InputGroup.Text>
                                <Form.Control
                                    name="payment"
                                    value={values.payment} readOnly
                                />
                            </InputGroup>
                        </Form.Group>

                        {
                            values.payment === 'Credit Card' &&
                            <Row className="g-3 mb-3">
                                <Form.Group controlId="card-no">
                                    <Form.Label>Credit Card Number</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="cardNumber"
                                        value={values.cardNumber} readOnly
                                    />
                                </Form.Group>

                                <Form.Group controlId="card-name">
                                    <Form.Label>Card Holder Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="cardHolder"
                                        value={values.cardHolder} readOnly
                                    />
                                </Form.Group>

                                <Form.Group as={Col} md="6" controlId="expiry-date">
                                    <Form.Label>Expiry Date (YYYY-MM)</Form.Label>
                                    <Form.Control
                                        type="month"
                                        name="expiryDate"
                                        value={new Date().toISOString().slice(0, 7)} readOnly
                                    />
                                </Form.Group>

                                <Form.Group as={Col} md="6" controlId="cvv">
                                    <Form.Label>CVV</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        inputMode="numeric"
                                        name="cvv"
                                        value={values.cvv} readOnly
                                    />
                                </Form.Group>
                            </Row>
                        }

                        <hr className='my-4' />

                        {
                            values.notes.length > 0 &&
                            <>
                                <Form.Group>
                                    <Form.Label>Notes</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="notes"
                                        value={values.notes} readOnly
                                        maxLength="150" />
                                </Form.Group>

                                <hr className='my-4' />
                            </>

                        }
                        {(values.message.length > 0 || isAdmin) &&
                            <Form.Group className="mb-3" controlId="checkout-notes">
                                <Form.Label>Owner's Message (Max. 150 words)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="message"
                                    value={values.message}
                                    onChange={handleChange} readOnly={!isAdmin}
                                    maxLength="150" />
                            </Form.Group>}

                        <Row>
                            <Col md={7} className='mb-3 mb-md-0'>
                                <InputGroup>
                                    <InputGroup.Text>Submitted at</InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="createdAt"
                                        value={new Date(date)} readOnly
                                    />
                                </InputGroup>
                            </Col>

                            <Form.Group as={Col} md className='mb-3'>
                                <InputGroup>
                                    <InputGroup.Text>Status</InputGroup.Text>
                                    <Form.Select
                                        name="status"
                                        value={values.status}
                                        disabled={!isAdmin}
                                        onChange={handleChange}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Delivering">Delivering</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </Form.Select>
                                </InputGroup>
                            </Form.Group>

                        </Row>

                        {isAdmin && <Button type='submit' className='w-100 my-3'>Submit</Button>}


                    </Form>
                )
            }


        </Formik>
    )
}

export default OrderDetail;