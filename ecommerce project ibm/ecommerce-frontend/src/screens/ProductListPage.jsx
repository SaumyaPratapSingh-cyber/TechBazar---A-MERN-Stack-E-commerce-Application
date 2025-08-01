// src/screens/ProductListPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';
import { useAuth } from '../context/AuthContext';

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);
  const { user, logout } = useAuth();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || '',
  });

  useEffect(() => {
    isMounted.current = true;
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams(searchParams.toString());
        for(let key of Array.from(params.keys())) {
            if(params.get(key) === '') {
                params.delete(key);
            }
        }
        const response = await fetch(`http://localhost:5000/api/products?${params.toString()}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        
        let sortedProducts = [...data];
        if (filters.sort === 'price-asc') {
          sortedProducts.sort((a, b) => a.price - b.price);
        } else if (filters.sort === 'price-desc') {
          sortedProducts.sort((a, b) => b.price - a.price);
        }

        setTimeout(() => {
          if (isMounted.current) {
            setProducts(sortedProducts);
            setLoading(false);
          }
        }, 500);
        
      } catch (err) {
        if (isMounted.current) {
          console.error("Failed to fetch products:", err);
          setError(err.message);
          setLoading(false);
        }
      }
    };
    fetchProducts();
    return () => { isMounted.current = false; };
  }, [searchParams]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const handleApplyFilters = () => {
    const params = {};
    if (filters.keyword) params.keyword = filters.keyword;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.category) params.category = filters.category;
    if (filters.sort) params.sort = filters.sort;
    setSearchParams(params);
  };
  
  const handleResetFilters = () => {
    setFilters({ keyword: '', minPrice: '', maxPrice: '', category: '', sort: '' });
    setSearchParams({});
  };

  const handleLogout = () => { logout(); };
  const categories = Array.from(new Set(products.map(p => p.category)));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex justify-center items-center flex-col">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <div className="mt-4 text-xl text-gray-700">Loading products...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex justify-center items-center flex-col">
        <div className="text-center text-2xl text-red-600 font-bold mb-4">Error: {error}</div>
      </div>
    );
  }
  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex justify-center items-center flex-col">
        <div className="text-center text-2xl text-gray-700 font-bold mb-4">No products found matching your criteria.</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
      {/* Header with Cart Link and Auth */}
      <header className="flex justify-between items-center mb-8 p-4 bg-white rounded-lg shadow-lg">
        <Link to="/" className="text-3xl font-extrabold text-gray-900 hover:text-indigo-600 transition-colors">TechBazar</Link>
        <nav className="flex items-center space-x-6">
          {user ? (
            <>
              {user.isAdmin && (<Link to="/admin/dashboard" className="text-purple-600 hover:text-purple-800 font-bold transition-colors">Admin</Link>)}
              <Link to="/myorders" className="text-gray-700 hover:text-indigo-600 font-medium hidden md:block">My Orders</Link>
              <Link to="/myprofile" className="text-gray-700 hover:text-indigo-600 font-medium hidden md:block">My Profile</Link>
              <span className="text-gray-700 font-medium hidden md:block">Hello, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="text-red-600 hover:text-red-800 font-bold transition-colors">Logout</button>
            </>
          ) : (
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors">Login</Link>
          )}
          <Link to="/cart" className="relative text-gray-700 hover:text-indigo-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </Link>
        </nav>
      </header>
      <HeroCarousel />
      <h2 className="text-5xl font-extrabold text-center text-gray-900 mb-12 drop-shadow-lg">
        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Tech Products</span> for <span className="text-indigo-700">Techie!!</span>
      </h2>
      
      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-grow flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search for products..."
            name="keyword"
            value={filters.keyword}
            onChange={handleFilterChange}
            className="flex-grow border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleApplyFilters();
            }}
          />
        </div>
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* Category Filter */}
          <div>
            <label className="sr-only">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          {/* Price Filter */}
          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium hidden md:block">Price:</label>
            <input
              type="number"
              placeholder="Min"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="w-20 border border-gray-300 rounded-md py-2 px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="Max"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="w-20 border border-gray-300 rounded-md py-2 px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {/* Sort By */}
          <div>
            <label className="sr-only">Sort By</label>
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <button onClick={handleApplyFilters} className="bg-indigo-600 text-white rounded-md py-2 px-4 hover:bg-indigo-700 transition-colors">
            Apply
          </button>
          <button onClick={handleResetFilters} className="bg-gray-200 text-gray-700 rounded-md py-2 px-4 hover:bg-gray-300 transition-colors">
            Reset
          </button>
        </div>
      </div>
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center text-xl text-gray-700 mt-12">No products found matching your criteria.</div>
      )}
    </div>
  );
}

export default ProductListPage;
