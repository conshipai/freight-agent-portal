// src/components/common/IncotermSelector.jsx
import React, { useState } from 'react';
import { Info, Globe } from 'lucide-react';

const IncotermSelector = ({ selected, onChange }) => {
  const [showDetails, setShowDetails] = useState(false);

  const incoterms = [
    {
      code: 'EXW',
      name: 'Ex Works',
      description: 'Seller makes goods available at their premises. Buyer handles all transport.',
      sellerResponsibility: 'Minimal',
      buyerResponsibility: 'Maximum',
      riskTransfer: 'At seller premises',
      suitable: 'When buyer has logistics expertise'
    },
    {
      code: 'FCA',
      name: 'Free Carrier',
      description: 'Seller delivers to carrier nominated by buyer at named place.',
      sellerResponsibility: 'Export clearance',
      buyerResponsibility: 'Main transport',
      riskTransfer: 'When goods handed to carrier',
      suitable: 'All transport modes'
    },
    {
      code: 'CPT',
      name: 'Carriage Paid To',
      description: 'Seller pays for carriage to destination, risk transfers at origin.',
      sellerResponsibility: 'Transport to destination',
      buyerResponsibility: 'Risk from origin',
      riskTransfer: 'When goods handed to carrier',
      suitable: 'All transport modes'
    },
    {
      code: 'CIP',
      name: 'Carriage and Insurance Paid To',
      description: 'Like CPT but seller also provides insurance.',
      sellerResponsibility: 'Transport + Insurance',
      buyerResponsibility: 'Risk from origin',
      riskTransfer: 'When goods handed to carrier',
      suitable: 'All transport modes'
    },
    {
      code: 'DAP',
      name: 'Delivered at Place',
      description: 'Seller delivers to destination, buyer clears import.',
      sellerResponsibility: 'All transport to destination',
      buyerResponsibility: 'Import clearance',
      riskTransfer: 'At destination',
      suitable: 'Door delivery needed'
    },
    {
      code: 'DPU',
      name: 'Delivered at Place Unloaded',
      description: 'Seller delivers and unloads at destination.',
      sellerResponsibility: 'Transport + Unloading',
      buyerResponsibility: 'Import clearance',
      riskTransfer: 'After unloading',
      suitable: 'When unloading needed'
    },
    {
      code: 'DDP',
      name: 'Delivered Duty Paid',
      description: 'Seller handles everything including import duties.',
      sellerResponsibility: 'Maximum',
      buyerResponsibility: 'Minimal',
      riskTransfer: 'At final destination',
      suitable: 'Turnkey delivery'
    },
    {
      code: 'FOB',
      name: 'Free on Board',
      description: 'Seller loads goods on vessel, buyer handles ocean freight.',
      sellerResponsibility: 'Loading on vessel',
      buyerResponsibility: 'Ocean freight onwards',
      riskTransfer: 'When goods on board',
      suitable: 'Ocean freight only'
    },
    {
      code: 'CFR',
      name: 'Cost and Freight',
      description: 'Seller pays ocean freight, risk transfers at origin port.',
      sellerResponsibility: 'Ocean freight',
      buyerResponsibility: 'Risk from loading',
      riskTransfer: 'When goods on board',
      suitable: 'Ocean freight only'
    },
    {
      code: 'CIF',
      name: 'Cost, Insurance and Freight',
      description: 'Like CFR but seller also provides marine insurance.',
      sellerResponsibility: 'Freight + Insurance',
      buyerResponsibility: 'Risk from loading',
      riskTransfer: 'When goods on board',
      suitable: 'Ocean freight only'
    }
  ];

  const selectedIncoterm = incoterms.find(term => term.code === selected);

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Globe className="h-5 w-5 mr-2 text-gray-600" />
          Incoterms 2020
        </h3>
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <Info className="h-4 w-4 mr-1" />
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
        {incoterms.map((term) => (
          <button
            key={term.code}
            type="button"
            onClick={() => onChange(term.code)}
            className={`p-2 text-sm font-medium rounded-md border transition-colors ${
              selected === term.code
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
            }`}
            title={term.name}
          >
            {term.code}
          </button>
        ))}
      </div>

      {selectedIncoterm && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900">
                {selectedIncoterm.code} - {selectedIncoterm.name}
              </h4>
              <p className="text-sm text-blue-800 mt-1">
                {selectedIncoterm.description}
              </p>
              
              {showDetails && (
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex">
                    <span className="font-medium text-blue-900 w-32">Risk Transfer:</span>
                    <span className="text-blue-800">{selectedIncoterm.riskTransfer}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-blue-900 w-32">Best For:</span>
                    <span className="text-blue-800">{selectedIncoterm.suitable}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-blue-900 w-32">Seller Duties:</span>
                    <span className="text-blue-800">{selectedIncoterm.sellerResponsibility}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium text-blue-900 w-32">Buyer Duties:</span>
                    <span className="text-blue-800">{selectedIncoterm.buyerResponsibility}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
        <p className="text-xs text-amber-800">
          <strong>Important:</strong> Choose the Incoterm that matches your sales contract. 
          This affects pricing, risk transfer, and responsibilities. For air freight from the US, 
          FCA and CPT are commonly used.
        </p>
      </div>
    </div>
  );
};

export default IncotermSelector;
