import React, { useContext } from "react";
import { Container, Col, Row, Card, Button, Alert } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from "../store";
import '../style/Cart.css'

const Cart = () => {
    const noImagePath = '/img/no_image.svg';

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        userInfo, cart: { cartItems }
    } = state;
    const navigate = useNavigate();

    const handleRemoveItem = (idx) => {
        ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: idx });
    };

    const handleQuantityUpdate = (idx, quantity) => {
        if (quantity >= 1 && quantity <= 99) {
            ctxDispatch({
                type: 'CART_UPDATE_ITEM',
                payload: { key: idx, newQuantity: quantity }
            })
        }
    }
    const handleCheckout = () => {
        if (userInfo === null) {
            alert("Please login first!");
        }
        navigate('/user/login?redirect=/checkout');
    }

    const total = cartItems.reduce((prevVal, currValue) => (
        prevVal +
        currValue.quantity *
        (currValue.sku.price * (100 - currValue.sku.discount) / 100)
    ), 0)

    return (
        <Container id='cart-container' className="mt-3 mb-5 px-4">
            <div className="py-4 text-center">
                <h1>Cart</h1>
            </div>
            <Row className="g-5">
                <Col md={9} >
                    {
                        cartItems.length > 0 &&
                        <Row className="mb-2" id='prod-header'>
                            <div className="col-md-5 fw-bold">Product</div>
                            <div className="col-md-2 fw-bold text-center">Unit Price</div>
                            <div className="col-md-2 fw-bold text-center">Quantity</div>
                            <div className="col-md-2 fw-bold text-center">Sub-Total</div>
                            <div className="col-md-1 fw-bold text-center"></div>
                        </Row>
                    }

                    {
                        cartItems.length === 0 &&
                        <Alert variant='info'>
                            Your cart is empty. {' '}
                            <Link to='/'>Go Shopping</Link>
                        </Alert>
                    }

                    {
                        cartItems.map((item, idx) => (
                            <Row className="border py-3 mb-3" key={idx}>
                                <Col lg={5}>
                                    <Row>
                                        <Col sm={5} className="text-center">
                                            <img src={item.sku.img !== '' ? item.sku.img : noImagePath}
                                                alt={item.sku.itemName}
                                                className="cart-prod-img" />
                                        </Col>

                                        <Col sm={7}>
                                            <h5 className="fw-bold">
                                                {item.title}
                                            </h5>
                                            <h6 className="text-secondary">
                                                {item.sku.itemName}
                                            </h6>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col sm lg={2} className='text-center py-2'>
                                    <Row>
                                        <Col xs={6} className='desc-mobile'>
                                            <strong>Unit Price</strong>
                                        </Col>
                                        <Col xs={6} sm={12}>
                                            {item.sku.discount > 0 ?
                                                <del>{`$${item.sku.price}`}</del> :
                                                `$${item.sku.price}`} <br />
                                            {item.sku.discount > 0 ?
                                                `$${item.sku.price * (100 - item.sku.discount) / 100}` :
                                                <div></div>
                                            }
                                        </Col>
                                    </Row>
                                </Col>

                                <Col sm lg={2} className='text-center py-2'>
                                    <Row>
                                        <Col xs={6} className='desc-mobile'>
                                            <strong>Quantity</strong>
                                        </Col>
                                        <Col xs={6} sm={12}>
                                            <Button variant="primary" size="sm"
                                                onClick={() => handleQuantityUpdate(idx, item.quantity - 1)}>
                                                -
                                            </Button>
                                            <div className="d-inline-block mx-2 text-center num-box">{item.quantity}</div>
                                            <Button variant="primary" size="sm"
                                                onClick={() => handleQuantityUpdate(idx, item.quantity + 1)}>
                                                +
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col sm lg={2} className='text-center py-2'>
                                    <Row>
                                        <Col xs={6} className='desc-mobile'>
                                            <strong>Amount</strong>
                                        </Col>
                                        <Col xs={6} sm={12}>
                                            ${item.sku.price * (100 - item.sku.discount) / 100 * item.quantity}
                                        </Col>
                                    </Row>
                                </Col>

                                <Col lg={1} className='text-center py-2'>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="delete-btn"
                                        onClick={() => handleRemoveItem(idx)}
                                    >
                                        <Trash size={16} />
                                    </Button>
                                </Col>
                            </Row>
                        ))
                    }
                </Col>

                <Col md={3}>
                    <Row className="mb-3">
                        <Card className="p-2">
                            <h2>Items:</h2>
                            <h3>{cartItems.length}</h3>
                            <h2>Total Price:</h2>
                            <h3>{total}</h3>
                        </Card>
                    </Row>

                    <Row>
                        <Card className="p-2">
                            <Button variant="primary" type="submit" className="w-100"
                                disabled={cartItems.length === 0}
                                onClick={handleCheckout}>Checkout</Button>
                        </Card>
                    </Row>
                </Col>

            </Row>
        </Container>
    )
}

export default Cart;