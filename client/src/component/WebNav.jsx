import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import { Navbar, Button, Badge, Container } from 'react-bootstrap';
import { List, Cart3, Shop } from 'react-bootstrap-icons';

import SearchBar from "./Navbar/SearchBar";
import Sidebar from "./Navbar/Sidebar";
import AccountBtn from "./Navbar/AccountBtn";
import { Store } from "../store";

import '../style/WebNav.css';



const WebNav = () => {
    const { state } = useContext(Store);
    const { cart } = state;

    const isTabletDevice = useMediaQuery({
        query: "(max-width: 600px)",
    });

    const isMobileDevice = useMediaQuery({
        query: "(max-width: 400px)",
    });

    const [show, setShow] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (searchTerm !== '') {
            navigate(`/product/search/${searchTerm}`);
            setSearchTerm('');
        } else {
            alert('Please enter keywords');
        }

    }

    return (
        <Navbar bg="danger" variant="dark" expand="lg" className="px-2 sticky-top" id='navbar'>
            <Container fluid>
                <Button variant="outline-light border border-3 nav-btn" onClick={handleShow}>
                    <List color="white" size={24} className='align-bottom' />
                    <strong id='menu-text' className="px-1">Menu</strong>
                </Button>

                <Sidebar show={show} onHide={handleClose} />
                {isMobileDevice ?
                    <Link to='/'>
                        <Button variant="outline-light border border-3 nav-btn me-auto" className="mx-2">
                            <Shop color="white" size={24} className='align-bottom' />
                        </Button>
                    </Link> :
                    <Link to='/'
                        className={isTabletDevice ?
                            "me-auto mx-3 fw-bold navbar-brand" :
                            "mx-3 fw-bold navbar-brand"}>
                        E-Shop
                    </Link>
                }


                {!isTabletDevice &&
                    <SearchBar onSubmit={handleSubmit} keyword={searchTerm} onChange={handleChange} />}


                <Link to="/cart">
                    <Button variant="outline-light border border-3 nav-btn" className="mx-2 pe-0">
                        <Cart3 color="white" size={24} className='align-bottom' />
                        <Badge pill className="bg-warning counter">
                            <span className="text-black">{cart.cartItems.length}</span>
                        </Badge>
                        <span id='cart-text' className="pe-3 fw-bold">Cart</span>
                    </Button>
                </Link>

                <AccountBtn />

                {isTabletDevice &&
                    <div className="w-100 mt-2">
                        <SearchBar onSubmit={handleSubmit} keyword={searchTerm} onChange={handleChange} />
                    </div>}



            </Container>
        </Navbar>

    )
}

export default WebNav;