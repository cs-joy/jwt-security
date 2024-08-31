import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1'; // Adjust this to match your Spring Boot backend URL

function App() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [secureData, setSecureData] = useState('');
  const [message, setMessage] = useState('');

  const [role, setRole] = useState('USER')
  const [adminData, setAdminData] = useState('')

  const register = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        firstname,
        lastname,
        email,
        password,
        role
      });
      setToken(response.data.token);
      setMessage('Registration successful');
    } catch (error) {
      setMessage('Registration failed: ' + error.response?.data);
    }
  };

  const authenticate = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/authenticate`, { email, password });
      setToken(response.data.token);
      setMessage('Authentication successful');
    } catch (error) {
      setMessage('Authentication failed: ' + error.response?.data);
    }
  };

  const fetchSecureData = async () => {
    try {
      const response = await axios.get(`${API_URL}/demo-controller`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSecureData(response.data);
    } catch (error) {
      setMessage('Failed to fetch secure data: ' + error.response?.data);
    }
  };

  const fetchAdminData = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdminData(response.data);
      setMessage('Admin data fetched successfully');
    } catch (error) {
      console.error('Error fetching admin data:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setMessage(`Failed to fetch admin data: ${error.response.status} ${error.response.data}`);
      } else if (error.request) {
        // The request was made but no response was received
        setMessage('Failed to fetch admin data: No response received from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        setMessage('Failed to fetch admin data: ' + error.message);
      }
    }
  };


  return (
    <div>
      <h1>Spring Boot API Frontend</h1>
      <div>
        <h2>Register</h2>
        <input 
          type="text" 
          placeholder="First Name" 
          value={firstname} 
          onChange={(e) => setFirstname(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Last Name" 
          value={lastname} 
          onChange={(e) => setLastname(e.target.value)} 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button onClick={register}>Register</button>
      </div>
      <div>
        <h2>Authenticate</h2>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button onClick={authenticate}>Authenticate</button>
      </div>
      <div>
        <h2>Secure Endpoint</h2>
        <button onClick={fetchSecureData}>Fetch Secure Data</button>
        <p>Secure Data: {secureData}</p>
      </div>
      <div>
        <h2>Admin Endpoint</h2>
        <button onClick={fetchAdminData}>Fetch Admin Data</button>
        <p>Admin Data: {adminData}</p>
      </div>
      <p>Message: {message}</p>
    </div>
  );
}

export default App;