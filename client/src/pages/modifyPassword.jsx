import React, { useState } from 'react';
import { Form, InputGroup, Button } from "react-bootstrap";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { XCircleFill } from "react-bootstrap-icons";
import PasswordVisible from "../component/PasswordVisible";
import { useNavigate } from "react-router-dom";
import Axios from 'axios';
import '../style/ModifyPassword.css'

const initialize = {
    email: '',
    password: '',
    confirmPassword: '',
};

const schema = Yup.object().shape({
    email: Yup.string().email('Please enter proper email.').required('Please enter your email.'),
    password: Yup.string()
        .max(20, 'Maximum 20 character')
        .min(6, 'Minimum 6 characters.')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Password must be match').required('Please confirm password.'),
});

const ModifyPassword = () => {

    const [showPassword, setShowPassword] = useState({
        newPwBtn: false,
        confirmNewPwBtn: false
    });

    const togglePassword = (id) => {
        setShowPassword(prevState => ({ ...prevState, [id]: !prevState[id] }))
    };

    const navigate = useNavigate();

    return (
        <div id='password-form' className='p-5 container justify-content-center'>
            <Formik
                initialValues={initialize}
                validationSchema={schema}
                onSubmit={async (values) => {
                    try {
                        const { data } = await Axios.put(`/api/users/${values.email}`,
                            { "password": values.password });
                        navigate('/');
                    } catch (err) {
                        alert(JSON.stringify(err, null, 2));
                    }
                }}
            >
                {({ values, errors, touched, handleSubmit, handleChange, handleBlur }) => (
                    <Form onSubmit={handleSubmit}>
                        <h1 className='fs-2 fw-bold mb-3 text-center py-2'>Modify Password</h1>
                        <InputGroup className='mb-3'>
                            <Form.Group controlId="user" className='col-12'>
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Email Address"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.email && !!errors.email} />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    <XCircleFill className="me-2" />{errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </InputGroup>

                        <InputGroup className='mb-3'>
                            <Form.Group controlId="new-password" label="Password" className="col-12">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control
                                    type={showPassword.newPwBtn ? "text" : "password"}
                                    placeholder="New Password"
                                    name='password'
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.password && !!errors.password}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    <XCircleFill className="me-2" />{errors.password}
                                </Form.Control.Feedback>

                            </Form.Group>
                            <PasswordVisible
                                id='toggle-new-pw-btn-1'
                                name='newPwBtn'
                                onToggle={togglePassword}
                                showPassword={showPassword.newPwBtn}
                            />
                        </InputGroup>

                        <InputGroup className='mb-3'>
                            <Form.Group className="col-12">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type={showPassword.confirmNewPwBtn ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    name='confirmPassword'
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                                />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    <XCircleFill className="me-2" />{errors.confirmPassword}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <PasswordVisible
                                id='toggle-new-pw-btn-2'
                                name='confirmNewPwBtn'
                                onToggle={togglePassword}
                                showPassword={showPassword.confirmNewPwBtn}
                            />
                        </InputGroup>

                        <Button type='submit' className='float-end mt-3 w-100'>Submit</Button>

                    </Form>
                )}

            </Formik>
        </div>
    )
}

export default ModifyPassword;