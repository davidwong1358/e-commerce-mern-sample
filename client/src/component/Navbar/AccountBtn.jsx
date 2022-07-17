import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';
import { Store } from "../../store";

const AccountBtn = () => {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;
    const handleLogout = () => {
        ctxDispatch({ type: 'USER_SIGNOUT' });
        localStorage.removeItem('userInfo');
        localStorage.removeItem('cart');
        navigate('/success');
    }
    return (
        <Dropdown align='end'>
            <Dropdown.Toggle variant="outline-light border border-3 nav-btn" id="account-submenu">
                <Person color="white" size={24} className='align-bottom' />
                <span id='acc-text' className="px-1 fw-bold">Account</span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {userInfo !== null ?
                    <Dropdown.Item className="text-primary">Hi, {userInfo.username}</Dropdown.Item> :
                    <Dropdown.Item href="/user/login" className="dropdown-item text-primary">Login</Dropdown.Item>}

                <Dropdown.Divider />
                {userInfo === null &&
                    <Dropdown.Item href="/user/register" className="dropdown-item text-danger">Register</Dropdown.Item>
                }
                {userInfo !== null &&
                    <Dropdown.Item href="/user/modify-password" className="dropdown-item">Modify Password</Dropdown.Item>
                }
                {userInfo !== null && !userInfo.isAdmin &&
                    <Dropdown.Item href="/order" className="dropdown-item">My Order</Dropdown.Item>
                }


                {userInfo !== null && userInfo.isAdmin === true &&
                    <>
                        <Dropdown.Item href="/product/manage" className="dropdown-item">Manage Product</Dropdown.Item>
                        <Dropdown.Item href="/order" className="dropdown-item">Manage Order</Dropdown.Item>
                    </>
                }

                {userInfo !== null && <Dropdown.Divider />}

                {userInfo !== null &&
                    <Dropdown.Item onClick={() => handleLogout()} className="dropdown-item text-danger">Logout</Dropdown.Item>
                }
            </Dropdown.Menu>
        </Dropdown >
    )
}

export default AccountBtn;

