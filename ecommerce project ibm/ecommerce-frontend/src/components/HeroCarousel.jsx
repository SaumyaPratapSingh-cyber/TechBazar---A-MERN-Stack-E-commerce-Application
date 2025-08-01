// src/components/HeroCarousel.jsx
import React, { useState, useEffect } from 'react';

function HeroCarousel() {
  const images = [
    'https://img.freepik.com/premium-psd/gadget-promotion-banner-template-design_70055-891.jpg', 
    'https://tse2.mm.bing.net/th/id/OIP.1hWrxbi4NuU-9VsqQ0yVzAHaE7?rs=1&pid=ImgDetMain&o=7&rm=3', 
    'https://img.freepik.com/premium-vector/flash-sale-banner-promotion_131000-379.jpg', 
    'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/7bad8c93546277.5f48a570f12f8.jpg'
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [images.length]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-xl mb-12" style={{ height: '400px' }}>
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)`, height: '100%' }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0 relative" style={{ height: '100%' }}>
            <img src={image} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"> {/* Increased opacity */}
              <p className="text-white text-4xl md:text-6xl font-extrabold text-center drop-shadow-lg leading-tight">
                {/* Dynamic text based on image index, with better styling */}
                {index === 0 && <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">Awesome Tech Deals</span>}
                {index === 1 && <span className="bg-gradient-to-r from-green-400 to-blue-400 text-transparent bg-clip-text">New Arrivals Daily</span>}
                {index === 2 && <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text">Flash Sales Now</span>}
                {index === 3 && <span className="bg-gradient-to-r from-teal-400 to-cyan-400 text-transparent bg-clip-text">Smart Gadgets</span>}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 w-3 rounded-full ${
              currentIndex === index ? 'bg-indigo-600' : 'bg-gray-400' // Adjusted dot color
            } transition-colors duration-300 shadow-md`}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default HeroCarousel;
