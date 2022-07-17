import React from 'react';
import { Github } from 'react-bootstrap-icons'
import '../style/Footer.css';
import FooterNav from './Footer/FooterNav';
import { useMediaQuery } from 'react-responsive';
import MobileFooterNav from './Footer/MobileFooterNav';

const Footer = () => {
    const githubLink = 'https://github.com/davidwong1358';

    const isMobileDevice = useMediaQuery({
        query: "(max-width: 600px)",
    });

    return (
        <>
            <footer className='bg-danger'>
                {isMobileDevice ? <MobileFooterNav /> : <FooterNav />}
                <div className='text-center text-white py-2'>
                    &copy; 2022 Copyright: David Wong
                    <a href={githubLink} target='_blank' rel="noopener noreferrer">
                        <Github size={24} color="white" className='align-bottom mx-2' />
                    </a>
                </div>
            </footer>
        </>
    )
}

export default Footer;