// src/components/quotes/QuoteResults.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Plane, Ship, Package, DollarSign, Clock } from 'lucide-react';

const QuoteResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quoteData, service } = location.state || {};

  // Mock results - replace with actual API response
  const mockResults = {
    air: [
      { carrier: 'Delta Cargo', service: 'Express', transit: '2-3 days', price: 2850 },
      { carrier: 'United Cargo', service: 'Standard', transit: '4-5 days', price: 2350 },
      { carrier: 'American Airlines', service: 'Express', transit: '2-3 days', price: 2950 },
      { carrier: 'Lufthansa Cargo', service: 'Standard', transit: '5-6 days', price: 2200 }
    ],
    ocean: [
      { carrier: 'Maersk', service: 'FCL', transit: '25-30 days', price: 850 },
      { carrier: 'MSC', service: 'LCL', transit: '30-35 days', price: 650 },
      { carrier: 'CMA CGM', service: 'FCL', transit: '28-32 days', price: 900 }
    ],
    project: [
      { carrier: 'DHL Project', service: 'Heavy Lift', transit: 'Custom', price: 12500 },
      { carrier: 'Kuehne+Nagel', service: 'Special', transit: 'Custom', price: 11800 }
    ]
  };

  const results = mockResults[service] || [];
  const ServiceIcon = service === 'air' ? Plane : service === 'ocean' ? Ship : Package;

  const handleSelectQuote = (quote) => {
    // Send selected quote to parent
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'QUOTE_SELECTED',
        service,
        quote,
        originalRequest: quoteData,
        timestamp: new Date().toISOString()
      }, '*');
    }
    
    alert(`Quote selected: ${quote.carrier} - $${quote.price}`);
  };

  if (!quoteData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No quote data available</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Start New Quote
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Quote Form
      </button>

      {/* Quote Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ServiceIcon className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Quote Results</h2>
              <p className="text-gray-600">{service.charAt(0).toUpperCase() + service.slice(1)} Freight</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Quote ID</p>
            <p className="font-mono text-lg">Q-{Date.now().toString().slice(-8)}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pb-4 border-b">
          <div>
            <p className="text-sm text-gray-500">From</p>
            <p className="font-medium">{quoteData.origin.airport || quoteData.origin.city}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">To</p>
            <p className="font-medium">{quoteData.destination.airport || quoteData.destination.city}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Incoterm</p>
            <p className="font-medium">{quoteData.incoterm}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-500">Commodity</p>
            <p className="font-medium">{quoteData.commodity}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Weight</p>
            <p className="font-medium">
              {quoteData.cargo.pieces.reduce((sum, p) => sum + (parseFloat(p.weight) || 0) * (parseInt(p.quantity) || 0), 0)} 
              {' '}{quoteData.cargo.pieces[0]?.weightUnit || 'lbs'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Service Type</p>
            <p className="font-medium">{quoteData.serviceType || 'Standard'}</p>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <h3 className="text-lg font-semibold mb-4">Available Rates ({results.length})</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((quote, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{quote.carrier}</h4>
                <p className="text-sm text-gray-600">{quote.service}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  ${quote.price.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">USD</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                {quote.transit}
              </div>
              <div className="flex items-center text-sm text-green-600">
                <Check className="h-4 w-4 mr-1" />
                Available
              </div>
            </div>

            <button
              onClick={() => handleSelectQuote(quote)}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Select This Quote
            </button>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> All rates are subject to availability and final confirmation. 
          Additional charges may apply for special handling, customs clearance, and destination services 
          based on your selected Incoterm ({quoteData.incoterm}).
        </p>
      </div>
    </div>
  );
};

export default QuoteResults;

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

export { QuoteResults as default, OceanQuoteForm };
