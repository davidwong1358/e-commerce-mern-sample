import React, { useState, useContext, useEffect } from "react";
import { Formik } from 'formik';
import { Form, FloatingLabel, InputGroup, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { XCircleFill } from "react-bootstrap-icons";
import * as Yup from 'yup';
import PasswordVisible from "../component/PasswordVisible";
import { Store } from "../store";
import Axios from 'axios';
import '../style/Login.css';


const schema = Yup.object().shape({
  email: Yup.string().email('Please enter proper email address').required('Please enter username or email.'),
  password: Yup.string().required('Please enter password.')
});

const initialize = {
  email: '',
  password: ''
}

const Login = () => {
  const [showPassword, setShowPassword] = useState({
    passwordBtn: false
  });

  const togglePassword = (id) => {
    setShowPassword(prevState => ({ ...prevState, [id]: !prevState[id] }))
  };

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);


  return (
    <div id='login-form' className="form-signin">
      <Formik
        initialValues={initialize}
        validationSchema={schema}

        onSubmit={async (values) => {
          try {
            const { data } = await Axios.post('/api/users/login', values);
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/success');
          } catch (err) {
            alert(err.response.data);
          }
        }}
      >
        {
          ({ values, errors, touched, handleSubmit, handleChange, handleBlur }) => (
            <Form onSubmit={handleSubmit}>
              <h1 className='fs-2 fw-bold mb-4 text-center py-2'>Login</h1>

              <FloatingLabel
                controlId="inputEmail"
                label="Email Address"
              >
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
              </FloatingLabel>

              <InputGroup>
                <FloatingLabel controlId="inputPassword" label="Password" className='col-12 '>
                  <Form.Control
                    type={showPassword.passwordBtn ? "text" : "password"}
                    placeholder="Password"
                    className='pe-5'
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
                  id='toggle-password'
                  name='passwordBtn'
                  onToggle={togglePassword}
                  showPassword={showPassword.passwordBtn}
                />
              </InputGroup>

              <div className='d-flex justify-content-between mt-4'>
                <Link to='/user/register' className="me-auto">
                  <Button variant="btn btn-link ps-0">Register</Button>
                </Link>
                <Link to='/user/modify-password'>
                  <Button variant="btn btn-link mx-2">Forgot Password</Button>
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
  );
}

export default Login;