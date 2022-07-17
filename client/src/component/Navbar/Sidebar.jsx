import React from "react";
import { Offcanvas, ListGroup } from "react-bootstrap";
import '../../style/Sidebar.css';

const Sidebar = (props) => {
    const categories = [
        "Rice", "Noodles", "Oil", "Sauce", "Spice"
    ]
    return (
        <Offcanvas show={props.show} onHide={props.onHide} scroll='true' enforceFocus='true'>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Category</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <ListGroup variant="flush">
                    {categories.map((cat, index) => (
                        <ListGroup.Item className='px-2' key={index} action href={`/product/category/${cat.toLowerCase()}`}>
                            {cat}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Offcanvas.Body>
        </Offcanvas>
    )
};


export default Sidebar;

