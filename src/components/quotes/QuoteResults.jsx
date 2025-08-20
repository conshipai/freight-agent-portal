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
