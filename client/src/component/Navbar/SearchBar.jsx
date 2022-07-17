import React from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';


const SearchBar = (props) => {
    return (
        <Form className="d-flex ms-auto me-auto col-lg-4" onSubmit={props.onSubmit}>
            <FormControl
                type="search"
                placeholder="Search Product"
                className="me-2 search-bar-input"
                aria-label="Search"
                value={props.keyword}
                onChange={props.onChange}
            />
            <Button variant="outline-light border border-3 nav-btn"
                type="submit"
                >
                <Search color="white" size={24} />
            </Button>
        </Form>
    )
};

export default SearchBar;