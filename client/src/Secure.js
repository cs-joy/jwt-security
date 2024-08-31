// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const API_URL = 'http://localhost:8080/api/v1';
const ENCRYPTION_KEY = '74574562342';

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

function App() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [token, setToken] = useState('');
  const [secureData, setSecureData] = useState('');
  const [adminData, setAdminData] = useState('');
  const [message, setMessage] = useState('');
  const [encryptedEndpoint, setEncryptedEndpoint] = useState('');
  const [encryptedAdminEndpoint, setEncryptedAdminEndpoint] = useState('');

  useEffect(() => {
    const endpoint = '/demo-controller';
    const encrypted = encrypt(endpoint);
    setEncryptedEndpoint(encrypted);

    const adminEndpoint = '/admin';
    const encryptedAdmin = encrypt(adminEndpoint);
    setEncryptedAdminEndpoint(encryptedAdmin);
  }, []);

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
      const decryptedEndpoint = decrypt(encryptedEndpoint);
      const response = await axios.get(`${API_URL}${decryptedEndpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSecureData(response.data);
    } catch (error) {
      setMessage('Failed to fetch secure data: ' + error.response?.data);
    }
  };

  const fetchAdminData = async () => {
    try {
      const decryptedEndpoint = decrypt(encryptedAdminEndpoint);
      const response = await axios.get(`${API_URL}${decryptedEndpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdminData(response.data);
    } catch (error) {
      setMessage('Failed to fetch admin data: ' + error.response?.data);
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
        <h2>Secure Endpoint (Encrypted)</h2>
        <button onClick={fetchSecureData}>Fetch Secure Data</button>
        <p>Secure Data: {secureData}</p>
      </div>
      <div>
        <h2>Admin Endpoint (Encrypted)</h2>
        <button onClick={fetchAdminData}>Fetch Admin Data</button>
        <p>Admin Data: {adminData}</p>
      </div>
      <p>Message: {message}</p>
    </div>
  );
}

export default App;