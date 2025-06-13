import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { listingsAPI } from '../utils/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const APITest = () => {
  const [directResult, setDirectResult] = useState(null);
  const [apiResult, setApiResult] = useState(null);
  const [directError, setDirectError] = useState(null);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    // Test direct axios call
    const testDirectAPI = async () => {
      try {
        console.log('Testing direct axios call...');
        const response = await axios.get(`${API_BASE_URL}/listings`);
        console.log('Direct axios response:', response);
        setDirectResult(`SUCCESS: ${response.data.listings?.length} listings found`);
      } catch (err) {
        console.error('Direct axios error:', err);
        setDirectError(err.message);
      }
    };

    // Test API utility function
    const testAPIUtil = async () => {
      try {
        console.log('Testing API utility function...');
        const response = await listingsAPI.getListings();
        console.log('API utility response:', response);
        setApiResult(`SUCCESS: ${response.data.listings?.length} listings found`);
      } catch (err) {
        console.error('API utility error:', err);
        setApiError(err.message);
      }
    };

    testDirectAPI();
    testAPIUtil();
  }, []);

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px', border: '1px solid #ccc' }}>
      <h3>API Debug Information</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <h4>Direct Axios Call:</h4>
        {directError && <div style={{ color: 'red' }}>Error: {directError}</div>}
        {directResult && <div style={{ color: 'green' }}>{directResult}</div>}
      </div>
      
      <div>
        <h4>API Utility Call:</h4>
        {apiError && <div style={{ color: 'red' }}>Error: {apiError}</div>}
        {apiResult && <div style={{ color: 'green' }}>{apiResult}</div>}
      </div>
    </div>
  );
};

export default APITest;
