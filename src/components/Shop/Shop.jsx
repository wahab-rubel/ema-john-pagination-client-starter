import React, { useEffect, useState } from "react";
import {
  addToDb,
  deleteShoppingCart,
  getShoppingCart,
} from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";
import { Link, useLoaderData } from "react-router-dom";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // const [cart, setCart] = useState([]);
  const cart = useLoaderData();
  const [count, setCount] = useState(0)
  // const { count = 0 } = useLoaderData();
  // const count = 76;
  const numberOfPages = count > 0 ? Math.ceil(count / itemsPerPage) : 7; 

  const pages = numberOfPages > 0 ? [...Array(numberOfPages).keys()] : []; 


  useEffect(() =>{
    fetch('http://localhost:5001/productCount')
    .then(res => res.json())
    .then(data => setCount(data.count))
  })

  useEffect(() => {
    fetch(`http://localhost:5001/products?page=${currentPage}&size=${itemsPerPage}`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [currentPage]);

  // useEffect(() => {
  //   const storedCart = getShoppingCart();
  //   const savedCart = [];
  //   for (const id in storedCart) {
  //     const addedProduct = products.find((product) => product._id === id);
  //     if (addedProduct) {
  //       const quantity = storedCart[id];
  //       addedProduct.quantity = quantity;
  //       savedCart.push(addedProduct);
  //     }
  //   }
  //   setCart(savedCart);
  // }, [products]);

  const handleAddToCart = (product) => {
    let newCart = [];
    const exists = cart.find((pd) => pd._id === product._id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity += 1;
      const remaining = cart.filter((pd) => pd._id !== product._id);
      newCart = [...remaining, exists];
    }

    setCart(newCart);
    addToDb(product._id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };

  const handleItemPerPage = (e) => {
    const val = parseInt(e.target.value);
    setItemsPerPage(val);
    setCurrentPage(0);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const paginatedProducts = products.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="shop-container">
      <div className="products-container">
        {paginatedProducts.map((product) => (
          <Product
            key={product._id}
            product={product}
            handleAddToCart={handleAddToCart}
          />
        ))}
      </div>
      <div className="cart-container">
        <Cart cart={cart} handleClearCart={handleClearCart}>
          <Link className="proceed-link" to="/orders">
            <button className="btn-proceed">Review Order</button>
          </Link>
        </Cart>
      </div>
      <div className="pagination">
        <p>Current Page: {currentPage}</p>
        <button onClick={handlePrevPage}>Prev</button>
        {pages.map((page) => (
          <button
            className={currentPage === page ? "selected" : ""}
            onClick={() => setCurrentPage(page)}
            key={page}
          >
            {page + 1}
          </button>
        ))}
        <button onClick={handleNextPage}>Next</button>
        <select value={itemsPerPage} onChange={handleItemPerPage}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
};

export default Shop;
