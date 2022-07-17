import React from "react";

const FooterNav = () => {
    return (
        <>
            <ul className="nav justify-content-center border-bottom mx-5">
                <li className="nav-item">
                    <a href="/"
                        className="nav-link px-3 py-0 my-3 text-white border-end border-white">ABOUT US</a>
                </li>
                <li className="nav-item">
                    <a href="/"
                        className="nav-link px-3 py-0 my-3 text-white border-end border-white">POLICY</a>
                </li>
                <li className="nav-item">
                    <a href="/"
                        className="nav-link px-3 py-0 my-3 text-white border-end border-white">FAQs</a>
                </li>
                <li className="nav-item">
                    <a href="/"
                        className="nav-link px-3 py-0 my-3 text-white border-end border-white">CONTACT</a>
                </li>
                <li className="nav-item">
                    <a href="/"
                        className="nav-link px-3 py-0 my-3 text-white">JOIN US</a>
                </li>
            </ul>
        </>
    )
}

export default FooterNav;