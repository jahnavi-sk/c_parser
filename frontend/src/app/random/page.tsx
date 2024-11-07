"use client";
import { useEffect, useState } from 'react';

const TestGetRequest = () => {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/test', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          setMessage(result.message);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        console.log("Error: ", err);
        setError("Connection error. Please try again.");
      }
    };

    fetchTestData();
  }, []);

  return (
    <div>
      <h1>Test GET Request</h1>
      {message ? <p>{message}</p> : <p>{error || "Loading..."}</p>}
    </div>
  );
};

export default TestGetRequest;
