import React, { useState } from "react";
import { Formik } from 'formik';
import { Form, FloatingLabel, InputGroup, Button } from "react-bootstrap";
import { XCircleFill } from "react-bootstrap-icons";
import * as Yup from 'yup';
import { Link, useNavigate } from "react-router-dom";
import Axios from 'axios';
import PasswordVisible from "../component/PasswordVisible";
import '../style/Register.css'

const schema = Yup.object().shape({
    username: Yup.string()
        .max(20, 'Maximum 20 character')
        .min(6, 'Minimun 6 characters.')
        .matches(/^[\w+-]{6,20}$/, 'Only letters, numbers hyphen (-) & underscore ( _ ) is allowed.')
        .required('Please enter username'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required!'),
    confirmEmail: Yup.string()
        .oneOf([Yup.ref('email'), null], 'Email must be match')
        .required('Please confirm email.'),
    password: Yup.string()
        .max(20, 'Maximum 20 character')
        .min(6, 'Minimum 6 characters.')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Password must be match')
        .required('Please confirm password.')
});

const initialize = {
    username: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: ''
}


const Register = () => {
    const [showPassword, setShowPassword] = useState({
        passwordBtn: false,
        confirmPwBtn: false
    });

    const togglePassword = (id) => {
        setShowPassword(prevState => ({ ...prevState, [id]: !prevState[id] }))
    };

    const navigate = useNavigate();

    return (
        <div id='reg-form-container' className="p-5 container justify-content-center">
            <Formik
                initialValues={initialize}
                validationSchema={schema}
                onSubmit={async (values) => {
                    try {
                        const { data } = await Axios.post('/api/users/register', values);
                        navigate('/');
                    } catch (err) {
                        alert(JSON.stringify(err, null, 2));
                    }
                }}
            >
                {
                    ({ values, errors, touched, handleSubmit, handleChange, handleBlur }) => (
                        <Form onSubmit={handleSubmit}>
                            <h1 className='fs-2 fw-bold mb-4 text-center py-2'>Register</h1>

                            <FloatingLabel
                                controlId="input-user"
                                label="Username"
                                className="mb-2"
                            >
                                <Form.Control
                                    type="text"
                                    placeholder="Username"
                                    name='username'
                                    value={values.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.username && !!errors.username} />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    <XCircleFill className="me-2" />{errors.username}
                                </Form.Control.Feedback>

                            </FloatingLabel>

                            <FloatingLabel
                                controlId="input-email"
                                label="Email"
                                className="mb-2"
                            >
                                <Form.Control
                                    type="email"
                                    placeholder="Email"
                                    name='email'
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.email && !!errors.email} />

                                <Form.Control.Feedback type="invalid" tooltip>
                                    <XCircleFill className="me-2" />{errors.email}
                                </Form.Control.Feedback>

                            </FloatingLabel>

                            <FloatingLabel
                                controlId="input-confirm-email"
                                label="Confirm Email"
                                className="mb-2"
                            >
                                <Form.Control
                                    autoComplete='off'
                                    type="email"
                                    placeholder="Confirm Email"
                                    name='confirmEmail'
                                    value={values.confirmEmail}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.confirmEmail && !!errors.confirmEmail} />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    <XCircleFill className="me-2" />{errors.confirmEmail}
                                </Form.Control.Feedback>

                            </FloatingLabel>

                            <InputGroup className='mb-2'>
                                <FloatingLabel controlId="input-password" label="Password" className="col-12">
                                    <Form.Control
                                        type={showPassword.passwordBtn ? "text" : "password"}
                                        placeholder="Password"
                                        name='password'
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={touched.password && !!errors.password}
                                    />
                                    <Form.Control.Feedback type="invalid" tooltip>
                                        <XCircleFill className="me-2" />{errors.password}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                                <PasswordVisible
                                    id='toggle-pw-btn-1'
                                    name='passwordBtn'
                                    onToggle={togglePassword}
                                    showPassword={showPassword.passwordBtn}
                                />

                            </InputGroup>

                            <InputGroup className='mb-2'>
                                <FloatingLabel controlId="input-confirm-pw" label="Confirm Password" className="col-12">
                                    <Form.Control
                                        type={showPassword.confirmPwBtn ? "text" : "password"}
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

                                </FloatingLabel>
                                <PasswordVisible
                                    id='toggle-pw-btn-2'
                                    name='confirmPwBtn'
                                    onToggle={togglePassword}
                                    showPassword={showPassword.confirmPwBtn}
                                />
                            </InputGroup>

                            <div className='d-flex justify-content-between mt-4'>
                                <Link to='/user/login'>
                                    <Button variant="btn btn-link ps-0">Login</Button>
                                </Link>
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </div>

                        </Form>
                    )
                }


            </Formik>
        </div>
    )
};

export default Register;