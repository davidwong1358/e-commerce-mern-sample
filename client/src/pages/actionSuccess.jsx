import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { CheckCircleFill } from "react-bootstrap-icons";


const ActionSuccess = () => {
  const [redirectNow, setRedirectNow] = useState(false);
  setTimeout(() => setRedirectNow(true), 2000);
  return redirectNow ? (
    <Navigate to="/" />
  ) : (
    <div className="m-auto row justify-content-center">
        <CheckCircleFill size={96} className='text-success mb-3 animate__animated animate__flipInX animate__fast'/>
        <h1 className='text-center'>Success!</h1>
        <Link to='/' className="px-3 text-center">Redirect to home after 2 seconds. Click here if not response</Link>
    </div>
  );
}

export default ActionSuccess;