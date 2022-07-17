import React, { useContext } from "react";
import { Container, Row, Col, Badge, Card, Button, Form, InputGroup, ListGroup } from "react-bootstrap";
import { Formik } from 'formik';
import { Link, useNavigate } from "react-router-dom";
import { ArrowReturnLeft } from "react-bootstrap-icons";
import * as Yup from 'yup';
import { Store } from "../store";
import Axios from 'axios';
import '../style/Checkout.css';

const schema = Yup.object().shape({
    name: Yup.string().required('Your name is missing.'),
    phone: Yup.string().matches(/^\d{8}$/, 'Invalid Phone Number').required('Phone number is missing.'),
    address: Yup.string()
        .when('payment', {
            is: (payment) => payment !== 'Cash',
            then: Yup.string().required('Shipping address is missing.')

        }),
    cardNumber: Yup.string()
        .when('payment', {
            is: (payment) => payment === 'Credit Card',
            then: Yup.string().matches(/^\d{4} \d{4} \d{4} \d{4}$/, 'Invalid card number').required('Card number is missing.')

        }),
    cardHolder: Yup.string()
        .when('payment', {
            is: (payment) => payment === 'Credit Card',
            then: Yup.string().required('Card holder\'s name is missing.')

        }),
    expiryDate: Yup.date()
        .when('payment', {
            is: (payment) => payment === 'Credit Card',
            then: Yup.date().required('Expiry date is missing.')

        }),
    cvv: Yup.string()
        .when('payment', {
            is: (payment) => payment === 'Credit Card',
            then: Yup.string().length(3, 'Invalid CVV').required('CVV number is missing.')

        }),
    notes: Yup.string().max(150, "Maximum 100 characters allowed.")
});

const initialize = {
    name: '',
    phone: '',
    address: '',
    payment: 'Cash',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    notes: '',
}

const CheckoutPage = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart: { cartItems }, userInfo } = state;
    const navigate = useNavigate();

    const total = cartItems.reduce((prevVal, currValue) => (
        prevVal +
        currValue.quantity *
        (currValue.sku.price * (100 - currValue.sku.discount) / 100)
    ), 0);

    const handleSubmit = async (values) => {
        const obj = {
            ...values,
            "products": cartItems,
            "userInfo": {
                username: userInfo.username,
                email: userInfo.email,
                _id: userInfo._id
            },
            "total": total
        };
        try {
            const { data } = await Axios.post('/api/orders', obj,
                {
                    headers: { token: `Bearer ${userInfo.accessToken}` },
                });
            ctxDispatch({ type: 'CART_CLEAR' });
            localStorage.removeItem('cartItems');

            const result = await Axios.put('/api/products', cartItems, {
                params: {
                    operation: 'reduce',
                    id: userInfo._id
                },
                headers: { token: `Bearer ${userInfo.accessToken}` }
            })
            navigate('/success');
        } catch (err) {
            alert(JSON.stringify(err, null, 2));
            console.log(JSON.stringify(err, null, 2));
        }
    }

    return (
        <>
            <Container id='checkout-container' className="mt-3 mb-5">
                <div className="py-4 text-center">
                    <h1>Checkout</h1>
                </div>

                <Row className="g-5">
                    <Col md={{ span: 4, order: "last" }}>
                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-danger">Your cart</span>
                            <Badge pill bg="danger">{cartItems.length}</Badge>
                        </h4>

                        <ListGroup className="mb-3">
                            {
                                cartItems.map((item, key) => (
                                    <ListGroup.Item className="d-flex justify-content-between lh-sm" key={key}>
                                        <div>
                                            <h6 className="my-0">{item.title}</h6>
                                            <small className="text-muted">{`${item.sku.itemName} (${item.quantity})`}</small>
                                        </div>
                                        <span className="text-muted">{`$${item.sku.price * (100 - item.sku.discount) / 100 * item.quantity}`}</span>
                                    </ListGroup.Item>
                                ))
                            }
                            <ListGroup.Item className="d-flex justify-content-between">
                                <span>Total (HKD)</span>
                                <strong>${total}</strong>

                            </ListGroup.Item>
                        </ListGroup>
                        <Link to='/cart' className="float-end"><ArrowReturnLeft className="me-2" />Back to cart</Link>
                    </Col>

                    <Col md={8}>
                        <Formik
                            initialValues={initialize}
                            validationSchema={schema}
                            onSubmit={(values) => handleSubmit(values)}
                        >
                            {
                                ({ values, errors, touched, handleSubmit, handleChange, handleBlur, resetForm, setFieldValue }) => (
                                    <>
                                        <h4 className="mb-3">Billing address</h4>
                                        <Form id='checkout-form' noValidate onSubmit={handleSubmit}>
                                            <Row className="g-3">
                                                <Form.Group as={Col} md="7" controlId="name">
                                                    <Form.Label>Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="name"
                                                        value={values.name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.name && !!errors.name}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.name}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group as={Col} md="5" controlId="phone">
                                                    <Form.Label>Phone Number</Form.Label>
                                                    <InputGroup>
                                                        <InputGroup.Text id="telCode">+852</InputGroup.Text>
                                                        <Form.Control
                                                            type="tel"
                                                            name="phone"
                                                            inputMode="tel"
                                                            maxLength="8"
                                                            aria-describedby="telCode"
                                                            value={values.phone.replace(/[^0-9]/g, '')}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            isInvalid={touched.phone && !!errors.phone}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.phone}
                                                        </Form.Control.Feedback>
                                                    </InputGroup>
                                                </Form.Group>

                                                <Form.Group as={Col} md="12" controlId="address">
                                                    <Form.Label>Address</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="address"
                                                        value={values.address}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        isInvalid={touched.address && !!errors.address}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.address}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                            </Row>

                                            <hr className="my-4" />
                                            <h4 className="mb-3">Payment</h4>

                                            <div role="group" aria-labelledby="payment-group" className="my-3">
                                                <Form.Check
                                                    type="radio"
                                                    name="payment"
                                                    id="cash"
                                                    label="Cash"
                                                    value='Cash'
                                                    defaultChecked
                                                    onChange={handleChange}
                                                    onClick={() => {
                                                        setFieldValue('cardNumber', '');
                                                        setFieldValue('cardHolder', '');
                                                        setFieldValue('expiryDate', '');
                                                        setFieldValue('cvv', '');
                                                    }}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    name="payment"
                                                    id="credit-card"
                                                    label="Credit Card"
                                                    value='Credit Card'
                                                    onChange={handleChange}

                                                />
                                                <Form.Check
                                                    type="radio"
                                                    name="payment"
                                                    id="bank-transfer"
                                                    label="Bank Transfer"
                                                    value="Bank Transfer"
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className={values.payment !== 'Credit Card' ? "mb-3" : "mb-3 d-none"}>
                                                <strong>Cash: </strong>Pickup at store only
                                                <br />
                                                <strong>Pickup Location: </strong> Unit 1, 1/F, ABC Building, Hong Kong, N.T.
                                                <br /><br />
                                                <strong>Bank Transfer: </strong> Please transfer to the account
                                                <br />
                                                <strong>Bank Acc.: </strong> 000-000-0-000000-0 (E-shop Company)
                                                <br /> <br />
                                                Once the transfer completed, please send the capture of transaction record to
                                                <br />
                                                <strong>Whatsapp: </strong>+852 0000 0000
                                                <br />
                                                Delivery will be arranged after the payment is confirmed.
                                            </div>

                                            <div className={values.payment === 'Credit Card' ? "mb-3" : "mb-3 d-none"}>
                                                <Row className="g-3">
                                                    <Form.Group controlId="card-no">
                                                        <Form.Label>Credit Card Number</Form.Label>
                                                        <Form.Control
                                                            type="tel"
                                                            name="cardNumber"
                                                            inputMode="numeric"
                                                            placeholder="0000 0000 0000 0000"
                                                            maxLength="19"
                                                            value={values.cardNumber
                                                                .replace(/[^0-9]/g, '')
                                                                .replace(/\s/g, "")
                                                                .replace(/(\d{4})/g, "$1 ")
                                                                .trim()}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            isInvalid={touched.cardNumber && !!errors.cardNumber}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.cardNumber}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>

                                                    <Form.Group controlId="card-name">
                                                        <Form.Label>Card Holder Name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="cardHolder"
                                                            value={values.cardHolder}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            isInvalid={touched.cardHolder && !!errors.cardHolder}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.cardHolder}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>

                                                    <Form.Group as={Col} md="6" controlId="expiry-date">
                                                        <Form.Label>Expiry Date (YYYY-MM)</Form.Label>
                                                        <Form.Control
                                                            type="month"
                                                            name="expiryDate"
                                                            placeholder="YYYY/MM"
                                                            max="2099-12"
                                                            pattern="[0-9]{4}-[0-9]{2}"
                                                            value={values.expiryDate}
                                                            maxLength="5"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            isInvalid={touched.expiryDate && !!errors.expiryDate}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.expiryDate}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>

                                                    <Form.Group as={Col} md="6" controlId="cvv">
                                                        <Form.Label>CVV</Form.Label>
                                                        <Form.Control
                                                            type="tel"
                                                            inputMode="numeric"
                                                            name="cvv"
                                                            placeholder="CVV"
                                                            pattern="\d{3}"
                                                            maxLength="3"
                                                            value={values.cvv
                                                                .replace(/[^0-9]/g, '')
                                                                .replace(/\s/g, "")}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            isInvalid={touched.cvv && !!errors.cvv}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.cvv}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Row>

                                            </div>

                                            <Form.Group className="mb-3" controlId="checkout-notes">
                                                <Form.Label>Notes</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    name="notes"
                                                    value={values.notes}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.notes}
                                                    maxLength="150" />
                                                <Form.Text className="text-secondary">
                                                    {`Remaining Characters: ${150 - values.notes.length}`}
                                                </Form.Text>
                                            </Form.Group>

                                            <Card className="p-2">
                                                <Button variant="primary" type="submit">Submit Order</Button>
                                            </Card>
                                        </Form>
                                    </>
                                )
                            }

                        </Formik>
                    </Col>
                </Row>

            </Container>
        </>
    )
}

export default CheckoutPage;