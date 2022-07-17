import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './pages/home';

import WebNav from "./component/WebNav";
import Footer from "./component/Footer";
import ActionSuccess from "./pages/actionSuccess";
import ActionFailure from "./pages/actionFailure";

import Login from './pages/login'
import Register from './pages/register';
import ModifyPassword from "./pages/modifyPassword";

import ManageProduct from "./pages/manageProduct";
import EditProduct from "./pages/editProduct";
import CreateProduct from "./pages/createProduct";
import ProductPage from './pages/productPage';
import ProductList from "./pages/productList";
import SearchResult from "./pages/searchResult";

import Cart from "./pages/cart";
import CheckoutPage from "./pages/checkoutPage";

import ManageOrder from "./pages/manageOrder";
import OrderDetail from "./pages/orderDetail";

const App = () => {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <WebNav />
        <Routes>
          <Route exact path="/" element={<Home />} />
          
          <Route path="/user/login" element={<Login />} />
          <Route path="/user/register" element={<Register />} />
          <Route path='/user/modify-password' element={<ModifyPassword />} />

          <Route path="/product/item/:pid" element={<ProductPage />} />
          <Route path="/product/category/:category" element={<ProductList />} />
          <Route path="/product/search/:keyword" element={<SearchResult />} />
          <Route path='/product/manage' element={<ManageProduct />} />
          <Route path='/product/edit/:pid' element={<EditProduct />} />
          <Route path='/product/create' element={<CreateProduct />} />
          
          <Route path="/cart" element={<Cart />} />
          <Route path='/checkout' element={<CheckoutPage />} />
          <Route path='/success' element={<ActionSuccess />} />
          <Route path='/error' element={<ActionFailure />} />

          <Route path='/order' element={<ManageOrder />} />
          <Route path='/order/:orderId' element={<OrderDetail />} />

        </Routes>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

