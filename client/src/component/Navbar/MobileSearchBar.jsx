import React, { useState } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import { Search, XLg } from 'react-bootstrap-icons';
import '../../style/MobileSearchBar.css';

const MobileSearchBar = (props) => {
    const [triggered, setTriggered] = useState(false);
    const handleTrigger = () => setTriggered(!triggered);

    return (
        <>
            <div className="me-auto" />
            <Button variant="outline-light border border-3 nav-btn" onClick={handleTrigger}>
                {!triggered && <Search color="white" size={24} />}
                {triggered && <XLg color="white" size={24} />}
            </Button>

            {triggered &&
                <Form id='search-bar' 
                className="d-flex position-absolute top-100 p-2 w-100 bg-danger" 
                onSubmit={(e) => {handleTrigger(); props.onSubmit(e);}}>
                    <FormControl
                        type="search"
                        placeholder="Search Product"
                        className="me-2 search-bar-input"
                        aria-label="Search"
                        value={props.keyword}
                        onChange={props.onChange}
                    />
                    <Button type="submit" variant="outline-light border border-3" 
                    id='mobile-search-icon'>
                        <Search color="white" size={24} />
                    </Button>
                </Form>
            }
        </>
    )
};

export default MobileSearchBar;
