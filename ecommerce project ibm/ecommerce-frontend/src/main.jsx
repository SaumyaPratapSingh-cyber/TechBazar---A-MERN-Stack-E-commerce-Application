    // src/main.jsx
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from './App.jsx';
    import './output.css'; // Importing the generated Tailwind CSS

    ReactDOM.createRoot(document.getElementById('root')).render(
      <App /> // Removed React.StrictMode tags
    );
    