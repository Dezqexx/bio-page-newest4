
import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const IPAddressDisplay = () => {
  const [ipAddress, setIpAddress] = useState<string>('Loading...');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIPAddress = async () => {
      try {
        setIsLoading(true);
        // Using ipify's free API to get the visitor's IP address
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) {
          throw new Error('Failed to fetch IP address');
        }
        const data = await response.json();
        setIpAddress(data.ip);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching IP address:', err);
        setError('Failed to load IP address');
        setIsLoading(false);
      }
    };

    fetchIPAddress();
  }, []);

  return (
    <div className="absolute top-24 right-4 z-20 bg-black/40 backdrop-blur-sm border border-[#00ff00]/50 rounded-md p-2 text-[#00ff00] flex items-center gap-2">
      <Globe className="w-4 h-4" />
      {isLoading ? (
        <span>Loading IP...</span>
      ) : error ? (
        <span>{error}</span>
      ) : (
        <span>Your IP: {ipAddress}</span>
      )}
    </div>
  );
};

export default IPAddressDisplay;
