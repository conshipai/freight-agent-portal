
// ===================================================
// src/components/quotes/OceanQuoteForm.jsx
// ===================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ship, Anchor, AlertCircle } from 'lucide-react';
import IncotermSelector from '../common/IncotermSelector';
import CargoDetails from '../common/CargoDetails';

const OceanQuoteForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    origin: {
      port: '',
      country: 'US'
    },
    destination: {
      port: '',
      country: ''
    },
    containerType: 'FCL', // FCL or LCL
    containerSize: '20ft', // 20ft, 40ft, 40ft HC
    cargo: {
      pieces: [{
        quantity: 1,
        weight: '',
        length: '',
        width: '',
        height: '',
        weightUnit: 'lbs',
        dimensionUnit: 'in'
      }]
    },
    incoterm: 'FOB',
    commodity: '',
    specialInstructions: ''
  });

  const usPorts = [
    { code: 'USLAX', name: 'Los Angeles, CA' },
    { code: 'USLGB', name: 'Long Beach, CA' },
    { code: 'USNYC', name: 'New York/Newark, NJ' },
    { code: 'USSAV', name: 'Savannah, GA' },
    { code: 'USHOU', name: 'Houston, TX' },
    { code: 'USMIA', name: 'Miami, FL' },
    { code: 'USSEA', name: 'Seattle, WA' },
    { code: 'USOAK', name: 'Oakland, CA' }
  ];

  const intlPorts = [
    { code: 'CNSHA', name: 'Shanghai, China' },
    { code: 'SGSIN', name: 'Singapore' },
    { code: 'NLRTM', name: 'Rotterdam, Netherlands' },
    { code: 'DEHAM', name: 'Hamburg, Germany' },
    { code: 'GBFXT', name: 'Felixstowe, UK' },
    { code: 'AEJEA', name: 'Jebel Ali, UAE' },
    { code: 'HKHKG', name: 'Hong Kong' },
    { code: 'JPYOK', name: 'Yokohama, Japan' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    
    // Send to parent window
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'QUOTE_SUBMITTED',
        service: 'ocean',
        data: formData,
        timestamp: new Date().toISOString()
      }, '*');
    }
    
    setTimeout(() => {
      navigate('/results', { state: { quoteData: formData, service: 'ocean' } });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Services
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <Ship className="h-8 w-8 text-cyan-600 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Ocean Freight Quote</h2>
            <p className="text-gray-600">Get ocean freight rates from US ports</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Port Selection */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Anchor className="h-5 w-5 mr-2 text-gray-600" />
              Port Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origin Port (US) *
                </label>
                <select
                  value={formData.origin.port}
                  onChange={(e) => setFormData({...formData, origin: {...formData.origin, port: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Port</option>
                  {usPorts.map(port => (
                    <option key={port.code} value={port.code}>
                      {port.code} - {port.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination Port *
                </label>
                <select
                  value={formData.destination.port}
                  onChange={(e) => setFormData({...formData, destination: {...formData.destination, port: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Port</option>
                  {intlPorts.map(port => (
                    <option key={port.code} value={port.code}>
                      {port.code} - {port.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Container Type */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Container Type</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipment Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="FCL"
                      checked={formData.containerType === 'FCL'}
                      onChange={(e) => setFormData({...formData, containerType: e.target.value})}
                      className="mr-2"
                    />
                    <span>FCL (Full Container)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="LCL"
                      checked={formData.containerType === 'LCL'}
                      onChange={(e) => setFormData({...formData, containerType: e.target.value})}
                      className="mr-2"
                    />
                    <span>LCL (Less than Container)</span>
                  </label>
                </div>
              </div>

              {formData.containerType === 'FCL' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Container Size
                  </label>
                  <select
                    value={formData.containerSize}
                    onChange={(e) => setFormData({...formData, containerSize: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="20ft">20ft Standard</option>
                    <option value="40ft">40ft Standard</option>
                    <option value="40ftHC">40ft High Cube</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Cargo Details */}
          <CargoDetails 
            cargo={formData.cargo}
            onChange={(cargo) => setFormData({...formData, cargo})}
          />

          {/* Incoterms - Ocean specific defaults */}
          <IncotermSelector
            selected={formData.incoterm}
            onChange={(incoterm) => setFormData({...formData, incoterm})}
          />

          {/* Commodity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Commodity Description *
            </label>
            <input
              type="text"
              value={formData.commodity}
              onChange={(e) => setFormData({...formData, commodity: e.target.value})}
              placeholder="e.g., Electronics, Textiles, Machinery"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Get Ocean Quote'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OceanQuoteForm;
