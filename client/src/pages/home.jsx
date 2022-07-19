import React, { useState } from "react";
import Carousel from 'react-bootstrap/Carousel';
import { Link } from "react-router-dom";
import '../style/Home.css';

const Slider = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
        <img
          className="d-block w-100 slider-banner"
          src="https://img.freepik.com/free-photo/sack-rice-with-rice-wooden-spoon-rice-plant_1150-34315.jpg?w=2000"
          alt="First slide"
        />
        <Carousel.Caption>
         <Link to='/product/category/rice'><h1 className='bg-dark text-white w-100'>Rice</h1></Link>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100 slider-banner" src="https://d3h1lg3ksw6i6b.cloudfront.net/media/image/2017/05/15/df62557018e746d888fc27b1e1a81cc9_Singapore+noodles+banner.jpg"
          alt="Second slide"
        />
        <Carousel.Caption>
        <Link to='/product/category/noodles'><h1 className='bg-dark text-white w-100'>Noodles</h1></Link>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100 slider-banner"
          src="https://kmpoil.com/wp-content/uploads/2018/03/2018-03-28-3.jpg"
          alt="Third slide"
        />
        <Carousel.Caption>
        <Link to='/product/category/oil'><h1 className='bg-dark text-white w-100'>Oil</h1></Link>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100 slider-banner"
          src="https://img.freepik.com/free-photo/concept-spicy-sauce-with-adjika-top-view_185193-80303.jpg?w=2000"
          alt="Fourth slide"
        />
        <Carousel.Caption>
        <Link to='/product/category/sauce'><h1 className='bg-dark text-white w-100'>Sauce</h1></Link>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100 slider-banner"
          src="https://www.pho24.com.vn/wp-content/uploads/2018/02/Spice-Header-2.jpg"
          alt="Fifth slide"
        />
        <Carousel.Caption>
        <Link to='/product/category/spice'><h1 className='bg-dark text-white w-100'>Spice</h1></Link>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

const Home = () => {
  return (
    <>
        <Slider />
        <div className="d-flex flex-column flex-fill justify-content-center welcome-box">
        <h1 className="text-center">Welcome</h1>
        </div>
    </>
  );

};

export default Home;