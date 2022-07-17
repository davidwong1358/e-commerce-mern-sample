import React, { useState, useEffect, useContext } from "react";
import { Container, Col, Row, Button, Form, InputGroup } from 'react-bootstrap';
import { EyeFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { Store } from "../store";
import Axios from 'axios';
import '../style/Order.css'

const statusColor = (status) => {
    switch (status) {
        case 'Pending': return 'text-warning';
        case 'Delivering': return 'text-info';
        case 'Completed': return 'text-success';
        case 'Cancelled': return 'text-danger';
        default: return 'text-black';
    }
}

const ManageOrder = () => {
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;

    const [orderList, setOrderList] = useState({});
    const [startDate, setStartDate] = useState('1990-01-01');
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const [user, setUser] = useState('');
    const [status, setStatus] = useState('Any');

    const [sort, setSort] = useState('asc-time');

    const fetchLink = userInfo.isAdmin ?
                '/api/orders' :
                `/api/orders/user/${userInfo._id}`;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await Axios.get(fetchLink, {
                    params: {
                        user: userInfo.isAdmin ? user : userInfo.username,
                        startDate: startDate,
                        endDate: endDate,
                        sort: sort,
                        status: status,
                        id: userInfo._id
                    },
                    headers: { token: `Bearer ${userInfo.accessToken}` },
                });
                setOrderList(result.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchProducts();
    }, [])

    const handleUser = (event) => {
        setUser(event.target.value);

    }

    const handleStatus = (event) => {
        setStatus(event.target.value);
    }

    const handleStartDate = (event) => {
        setStartDate(event.target.value);
    }

    const handleEndDate = (event) => {
        setEndDate(event.target.value);
    }

    const handleSort = (event) => {
        setSort(event.target.value);
    }

    const handleSearchList = async (event) => {
        event.preventDefault();
        try {
            const result = await Axios.get(fetchLink, {
                params: {
                    user: userInfo.isAdmin ? user : userInfo.username,
                    startDate: startDate,
                    endDate: endDate,
                    sort: sort,
                    status: status,
                    id: userInfo._id
                },
                headers: { token: `Bearer ${userInfo.accessToken}` },
            });
            setOrderList(result.data);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Container id='manage-order-container' className="mt-4">
            <h1 className="text-center mb-3">Manage Order</h1>
            {userInfo.isAdmin &&
                <Row className="mx-1 mb-3">
                    <Form.Group as={Col} className="px-1">
                        <InputGroup>
                            <InputGroup.Text>User</InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Search User"
                                value={user}
                                onChange={handleUser} />
                        </InputGroup>
                    </Form.Group>
                </Row>
            }

            <Row className="mx-1 mb-3">
                <Form.Group as={Col} xs='12' sm md className="px-1">
                    <InputGroup>
                        <InputGroup.Text>Start</InputGroup.Text>
                        <Form.Control
                            type="date"
                            placeholder="Start"
                            value={startDate}
                            onChange={handleStartDate} />
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} xs='12' sm md className="px-1 mt-3 mt-sm-0">
                    <InputGroup>
                        <InputGroup.Text>End</InputGroup.Text>
                        <Form.Control
                            type="date"
                            placeholder="End"
                            value={endDate}
                            onChange={handleEndDate} />
                    </InputGroup>
                </Form.Group>

                <Form.Group as={Col} sm='12' md className="px-1 mt-3 mt-md-0">
                    <InputGroup>
                        <InputGroup.Text>Status</InputGroup.Text>
                        <Form.Select aria-label="Search Term" value={status} onChange={handleStatus}>
                            <option value="Any">Any</option>
                            <option value="Pending">Pending</option>
                            <option value="Delivering">Delivering</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </Form.Select>
                    </InputGroup>
                </Form.Group>
            </Row>

            <Row className="mx-1 mb-3">
                <Form.Group as={Col} sm='9' className="px-1">
                    <InputGroup>
                        <InputGroup.Text>Sorting</InputGroup.Text>
                        <Form.Select aria-label="Search Term" value={sort} onChange={handleSort}>
                            <option value="asc-time">Earliest Order First</option>
                            <option value="desc-time">Latest Order First</option>
                            <option value="desc-price">Greatest Order Total First</option>
                            <option value="asc-price">Smallest Order Total First</option>
                        </Form.Select>
                    </InputGroup>
                </Form.Group>
                <Col sm >
                <Button className="w-100 mt-3 mt-sm-0" onClick={handleSearchList}>Search</Button>
                </Col>
                
            </Row>

            {orderList.length > 0 &&
                orderList.map((info, index) => (
                    <Row className="border mb-3 mx-1 py-2" key={index}>
                        <div className="d-flex justify-content-between mb-2 flex-wrap">
                            <u>{`id: ${info._id}`}</u>
                            <div>{new Date(info.createdAt).toLocaleString('en-GB', { hour12: false })}</div>
                        </div>
                        <Row>
                            <Col>{info.userInfo.username}</Col>
                            <Col className="text-center">${info.total}</Col>
                            <Col className="text-end text-sm-center ">
                                <div className={statusColor(info.status)}>{info.status}</div>
                            </Col>
                            <Col xs={12} sm>
                                <Link to={`/order/${info._id}`} >
                                    <Button size='sm' variant='secondary' className="float-end view-order-btn">
                                        <EyeFill color="white" size={16} className='align-middle' />
                                        <span className="px-1 fw-bold">View</span>
                                    </Button>
                                </Link>
                            </Col>
                        </Row>
                    </Row>
                ))
            }

        </Container >
    )
}

export default ManageOrder;