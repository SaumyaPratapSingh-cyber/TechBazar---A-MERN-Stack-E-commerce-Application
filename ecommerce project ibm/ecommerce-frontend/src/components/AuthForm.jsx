    // src/components/AuthForm.jsx
    import React, { useState } from 'react';
    import { useAuth } from '../context/AuthContext'; // Import useAuth hook
    import { useNavigate } from 'react-router-dom'; // Import useNavigate

    function AuthForm() {
      const [isLogin, setIsLogin] = useState(true);
      const [name, setName] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [message, setMessage] = useState('');
      const [loading, setLoading] = useState(false);

      const { login } = useAuth(); // Get the login function from context
      const navigate = useNavigate(); // Get navigate function

      const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        const url = isLogin ? 'http://localhost:5000/api/users/login' : 'http://localhost:5000/api/users';
        const method = 'POST';
        const body = isLogin ? { email, password } : { name, email, password };

        try {
          const response = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });

          const data = await response.json();

          if (response.ok) {
            setMessage(isLogin ? 'Login successful!' : 'Registration successful!');
            console.log('Auth successful:', data);
            login({ _id: data._id, name: data.name, email: data.email, isAdmin: data.isAdmin }, data.token); // Save user and token to context
            
            // Clear form fields
            setName('');
            setEmail('');
            setPassword('');

            // Redirect to homepage after successful auth
            navigate('/'); 

          } else {
            setMessage(data.message || 'An error occurred.');
            console.error('Auth error:', data);
          }
        } catch (error) {
          setMessage('Network error or server unavailable.');
          console.error('Fetch error:', error);
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            {isLogin ? 'Login' : 'Register'}
          </h2>
          {message && (
            <div className={`p-3 mb-4 rounded-md text-center ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline w-full transition duration-200 ease-in-out"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
            </button>
          </form>
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 hover:text-blue-700 text-sm font-bold focus:outline-none"
            >
              {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      );
    }

    export default AuthForm;
    