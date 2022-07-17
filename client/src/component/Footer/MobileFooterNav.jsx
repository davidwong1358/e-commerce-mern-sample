import React from "react";
import { Accordion, ListGroup } from "react-bootstrap";
import '../../style/MobileFooter.css'

const MobileFooterNav = () => {
    return (
        <Accordion flush>
            <Accordion.Item eventKey="0">
                <Accordion.Header id='collapse-footer'>
                    More about E-Shop
                </Accordion.Header>
                <Accordion.Body>
                    <ListGroup variant="flush" className="border-0">
                        <a href="/"
                            className="list-group-item list-group-item-action">
                            ABOUT US
                        </a>
                        <a href="/"
                            className="list-group-item list-group-item-action">
                            POLICY
                        </a>
                        <a href="/"
                            className="list-group-item list-group-item-action">
                            FAQs
                        </a>
                        <a href="/"
                            className="list-group-item list-group-item-action">
                            CONTACT
                        </a>
                        <a href="/"
                            className="list-group-item list-group-item-action">
                            JOIN US
                        </a>
                    </ListGroup>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default MobileFooterNav;