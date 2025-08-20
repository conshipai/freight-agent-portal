// src/components/QuoteSelection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Ship, Package, ArrowRight } from 'lucide-react';

const QuoteSelection = () => {
  const navigate = useNavigate();

  const quoteTypes = [
    {
      id: 'air',
      title: 'Air Freight',
      icon: Plane,
      description: 'Fast international air shipping',
      features: [
        'Express & Standard service',
        'Door-to-door delivery',
        '2-7 days transit time',
        'Real-time tracking'
      ],
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'ocean',
      title: 'Ocean Freight',
      icon: Ship,
      description: 'Cost-effective sea shipping',
      features: [
        'FCL & LCL options',
        'Port-to-port service',
        '20-45 days transit',
        'Best value rates'
      ],
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      buttonColor: 'bg-cyan-600 hover:bg-cyan-700'
    },
    {
      id: 'project',
      title: 'Project Cargo',
      icon: Package,
      description: 'Oversized and special shipments',
      features: [
        'Heavy lift cargo',
        'Out-of-gauge items',
        'Custom solutions',
        'Specialized handling'
      ],
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      buttonColor: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  const handleQuoteSelect = (quoteType) => {
    // Send message to parent if in iframe
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'QUOTE_TYPE_SELECTED',
        quoteType: quoteType,
        timestamp: new Date().toISOString()
      }, '*');
    }
    
    navigate(`/quote/${quoteType}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Select Service Type</h2>
        <p className="mt-2 text-gray-600">
          Choose your shipping method to get instant freight quotes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quoteTypes.map((type) => {
          const Icon = type.icon;
          return (
            <div
              key={type.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className={`${type.bgColor} p-6`}>
                <Icon className={`h-12 w-12 ${type.iconColor}`} />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {type.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {type.description}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {type.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleQuoteSelect(type.id)}
                  className={`w-full ${type.buttonColor} text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center`}
                >
                  Get Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> All quotes are subject to space availability and final confirmation. 
          Rates valid for 15 days from generation.
        </p>
      </div>
    </div>
  );
};

export default QuoteSelection;
