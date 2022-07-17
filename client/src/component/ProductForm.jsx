import React from "react";
import { Row, Col, Button, Form } from 'react-bootstrap';
import { Trash, PlusLg, XCircleFill } from "react-bootstrap-icons";
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';

const schema = Yup.object().shape({
    code: Yup.string().required('Product code is missing.'),
    title: Yup.string().required('Product title is missing.'),
    sku: Yup.array().of(
        Yup.object().shape({
            itemName: Yup.string().required('Item name is missing.'),
            price: Yup.number()
                .min(0, 'Number must be 0 or positive.')
                .required('Price is missing'),
            inStock: Yup.number()
                .min(0, 'Number must be 0 or positive.')
                .required('Stock number is missing.'),
            discount: Yup.number()
                .min(0, 'Number must be 0 or positive.')
                .max(100, 'Number must below or at 100.')
                .required('Discount value is missing')
        })
    ).min(1, 'At least 1 item is required.')
})

const ProductForm = (props) => {
    return (
        <Formik
            initialValues={props.initialize}
            validationSchema={schema}
            onSubmit={(values) => {
                props.onSubmit(values);
            }
            }
        >
            {
                ({ values, errors, touched, handleSubmit, handleChange, handleBlur }) => (
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3 mb-3">
                            <Form.Group as={Col} md="2" className="position-relative">
                                <Form.Label>Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Code"
                                    name="code"
                                    value={values.code}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.code && !!errors.code}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    <XCircleFill className="me-2" />{errors.code}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} md='2'>
                                <Form.Label>Category</Form.Label>
                                <Form.Select
                                    aria-label="Search Term"
                                    name='category'
                                    value={values.category}
                                    onChange={handleChange}>
                                    <option value="Rice">Rice</option>
                                    <option value="Noodles">Noodles</option>
                                    <option value="Oil">Oil</option>
                                    <option value="Sauce">Sauce</option>
                                    <option value="Spice">Spice</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group as={Col} md="8" className="position-relative">
                                <Form.Label>Product Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Product Title"
                                    name="title"
                                    value={values.title}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.title && !!errors.title}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    <XCircleFill className="me-2" />{errors.title}
                                </Form.Control.Feedback>
                            </Form.Group>


                        </Row>

                        <Form.Group className='mb-3'>
                            <Form.Label>Cover Image URL</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Cover Image URL"
                                name="coverImg"
                                value={values.coverImg}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Product Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="description"
                                value={values.description}
                                onChange={handleChange}
                                maxLength="500" />
                            <Form.Text className="text-secondary">
                                {`Remaining Characters: ${500 - values.description.length}`}
                            </Form.Text>
                        </Form.Group>
                        <hr />
                        <div className='my-3'>
                            <FieldArray
                                name="sku"
                                render={
                                    ({ remove, push }) => (
                                        <div>
                                            <div className='d-flex justify-content-between'>
                                                <h2>Items (Max 5 items)</h2>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => values.sku.length < 5 ?
                                                        push({
                                                            itemName: '',
                                                            price: 0,
                                                            unit: '',
                                                            inStock: 0,
                                                            img: '',
                                                            discount: 0,
                                                        }) :
                                                        null}
                                                >
                                                    <PlusLg color="white" size={16} className='align-middle' />
                                                    <span className="px-1 fw-bold">Create</span>
                                                </Button>
                                            </div>
                                            {
                                                values.sku.length > 0 &&
                                                values.sku.map((item, index) => (
                                                    <div className='mt-3 mb-4 p-3 border rounded' key={index}>
                                                        <div className='d-flex justify-content-between'>
                                                            <h6 className='fw-bold'>Item {index + 1}</h6>
                                                            <Button size='sm' variant='danger'
                                                                onClick={() =>
                                                                    values.sku.length > 1 ?
                                                                        remove(index) :
                                                                        null}>
                                                                <Trash color="white" size={16} className='align-middle' />
                                                                <span className="px-1 fw-bold">Delete</span>
                                                            </Button>
                                                        </div>

                                                        <Form.Group className="mb-3 position-relative">
                                                            <Form.Label>Item Title</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name={`sku[${index}].itemName`}
                                                                value={values.sku[index].itemName}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                isInvalid={
                                                                    errors.sku &&
                                                                    errors.sku[index] &&
                                                                    errors.sku[index].itemName &&
                                                                    touched.sku &&
                                                                    touched.sku[index].itemName
                                                                }
                                                            />
                                                            {
                                                                errors.sku &&
                                                                errors.sku[index] &&
                                                                errors.sku[index].itemName &&
                                                                touched.sku &&
                                                                touched.sku[index].itemName &&
                                                                (<Form.Control.Feedback type="invalid" tooltip>
                                                                    <XCircleFill className="me-2" />{errors.sku[index].itemName}
                                                                </Form.Control.Feedback>)
                                                            }


                                                        </Form.Group>

                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Image URL</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name={`sku[${index}].img`}
                                                                value={values.sku[index].img}
                                                                onChange={handleChange}
                                                            />
                                                        </Form.Group>

                                                        <Row>
                                                            <Form.Group as={Col} xs='6' md="3" className="mb-3 position-relative" >
                                                                <Form.Label>Price</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    min='0'
                                                                    step="0.1"
                                                                    name={`sku[${index}].price`}
                                                                    value={values.sku[index].price}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    isInvalid={
                                                                        errors.sku &&
                                                                        errors.sku[index] &&
                                                                        errors.sku[index].price &&
                                                                        touched.sku &&
                                                                        touched.sku[index].price
                                                                    }
                                                                />
                                                                {
                                                                    errors.sku &&
                                                                    errors.sku[index] &&
                                                                    errors.sku[index].price &&
                                                                    touched.sku &&
                                                                    touched.sku[index].price &&
                                                                    (<Form.Control.Feedback type="invalid" tooltip>
                                                                        <XCircleFill className="me-2" />{errors.sku[index].price}
                                                                    </Form.Control.Feedback>)
                                                                }
                                                            </Form.Group>

                                                            <Form.Group as={Col} xs='6' md="3" className="mb-3">
                                                                <Form.Label>Unit</Form.Label>
                                                                <Form.Select
                                                                    aria-label="Unit"
                                                                    name={`sku[${index}].unit`}
                                                                    value={values.sku[index].unit}
                                                                    onChange={handleChange}>
                                                                    <option value="Box(es)">Box(es)</option>
                                                                    <option value="Bag(s)">Bag(s)</option>
                                                                    <option value="Bucket(s)">Bucket(s)</option>
                                                                    <option value="Piece(s)">Piece(s)</option>
                                                                    <option value="Pack(s)">Pack(s)</option>
                                                                    <option value="Bottle(s)">Bottle(s)</option>
                                                                </Form.Select>
                                                            </Form.Group>

                                                            <Form.Group as={Col} xs='6' md="3" className="mb-3 position-relative" >
                                                                <Form.Label>Discount% Off</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    min='0'
                                                                    max='100'
                                                                    name={`sku[${index}].discount`}
                                                                    value={values.sku[index].discount}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    isInvalid={
                                                                        errors.sku &&
                                                                        errors.sku[index] &&
                                                                        errors.sku[index].discount &&
                                                                        touched.sku &&
                                                                        touched.sku[index].discount
                                                                    }
                                                                />
                                                                {
                                                                    errors.sku &&
                                                                    errors.sku[index] &&
                                                                    errors.sku[index].discount &&
                                                                    touched.sku &&
                                                                    touched.sku[index].discount &&
                                                                    (<Form.Control.Feedback type="invalid" tooltip>
                                                                        <XCircleFill className="me-2" />{errors.sku[index].discount}
                                                                    </Form.Control.Feedback>)
                                                                }
                                                            </Form.Group>

                                                            <Form.Group as={Col} xs='6' md="3" className="mb-3 position-relative" >
                                                                <Form.Label>In Stock</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    min='0'
                                                                    name={`sku[${index}].inStock`}
                                                                    value={values.sku[index].inStock}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    isInvalid={
                                                                        errors.sku &&
                                                                        errors.sku[index] &&
                                                                        errors.sku[index].inStock &&
                                                                        touched.sku &&
                                                                        touched.sku[index].inStock
                                                                    }
                                                                />
                                                                {
                                                                    errors.sku &&
                                                                    errors.sku[index] &&
                                                                    errors.sku[index].inStock &&
                                                                    touched.sku &&
                                                                    touched.sku[index].inStock &&
                                                                    (<Form.Control.Feedback type="invalid" tooltip>
                                                                        <XCircleFill className="me-2" />{errors.sku[index].inStock}
                                                                    </Form.Control.Feedback>)
                                                                }
                                                            </Form.Group>
                                                        </Row>

                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            />
                        </div>

                        <Button type='submit' className='float-end w-100'>{props.formFor} Product</Button>

                    </Form>
                )
            }

        </Formik>
    )
}

export default ProductForm;