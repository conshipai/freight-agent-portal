// src/components/quotes/AirQuoteForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane, Package, MapPin, Globe, AlertCircle } from 'lucide-react';
import IncotermSelector from '../common/IncotermSelector';
import CargoDetails from '../common/CargoDetails';

const AirQuoteForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    // Route Information
    origin: {
      country: 'US',
      city: '',
      airport: '',
      zipCode: ''
    },
    destination: {
      country: '',
      city: '',
      airport: ''
    },
    
    // Cargo Information
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
    
    // Service Options
    serviceType: 'standard', // standard, express
    incoterm: 'EXW',
    insurance: false,
    dangerousGoods: false,
    
    // Additional Information
    commodity: '',
    declaredValue: '',
    specialInstructions: ''
  });

  // Common US airports for dropdown
  const usAirports = [
    { code: 'LAX', name: 'Los Angeles', city: 'Los Angeles, CA' },
    { code: 'JFK', name: 'New York JFK', city: 'New York, NY' },
    { code: 'ORD', name: "Chicago O'Hare", city: 'Chicago, IL' },
    { code: 'DFW', name: 'Dallas Fort Worth', city: 'Dallas, TX' },
    { code: 'ATL', name: 'Atlanta', city: 'Atlanta, GA' },
    { code: 'MIA', name: 'Miami', city: 'Miami, FL' },
    { code: 'SFO', name: 'San Francisco', city: 'San Francisco, CA' },
    { code: 'SEA', name: 'Seattle-Tacoma', city: 'Seattle, WA' },
    { code: 'BOS', name: 'Boston Logan', city: 'Boston, MA' },
    { code: 'IAH', name: 'Houston', city: 'Houston, TX' }
  ];

  // International airports
  const intlAirports = [
    { code: 'LHR', name: 'London Heathrow', country: 'UK' },
    { code: 'CDG', name: 'Paris Charles de Gaulle', country: 'France' },
    { code: 'FRA', name: 'Frankfurt', country: 'Germany' },
    { code: 'AMS', name: 'Amsterdam', country: 'Netherlands' },
    { code: 'DXB', name: 'Dubai', country: 'UAE' },
    { code: 'HKG', name: 'Hong Kong', country: 'Hong Kong' },
    { code: 'NRT', name: 'Tokyo Narita', country: 'Japan' },
    { code: 'SIN', name: 'Singapore', country: 'Singapore' },
    { code: 'SYD', name: 'Sydney', country: 'Australia' },
    { code: 'YYZ', name: 'Toronto', country: 'Canada' }
  ];

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleCargoChange = (cargoData) => {
    setFormData(prev => ({
      ...prev,
      cargo: cargoData
    }));
  };

  const handleIncotermChange = (incoterm) => {
    setFormData(prev => ({
      ...prev,
      incoterm: incoterm
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.origin.airport) {
      newErrors.originAirport = 'Origin airport is required';
    }
    if (!formData.destination.airport) {
      newErrors.destAirport = 'Destination airport is required';
    }
    if (!formData.commodity) {
      newErrors.commodity = 'Commodity description is required';
    }
    
    // Validate cargo
    const hasValidCargo = formData.cargo.pieces.some(
      piece => piece.weight > 0 && piece.quantity > 0
    );
    if (!hasValidCargo) {
      newErrors.cargo = 'Please enter valid cargo details';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Send message to parent window
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'QUOTE_SUBMITTED',
        service: 'air',
        data: formData,
        timestamp: new Date().toISOString()
      }, '*');
    }
    
    // Simulate API call
    setTimeout(() => {
      // Navigate to results with form data
      navigate('/results', { state: { quoteData: formData, service: 'air' } });
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
          <Plane className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Air Freight Quote</h2>
            <p className="text-gray-600">Get instant air freight rates from the US</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Origin Section */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-gray-600" />
              Origin (United States)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Airport *
                </label>
                <select
                  value={formData.origin.airport}
                  onChange={(e) => handleInputChange('origin', 'airport', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.originAirport ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Airport</option>
                  {usAirports.map(airport => (
                    <option key={airport.code} value={airport.code}>
                      {airport.code} - {airport.name} ({airport.city})
                    </option>
                  ))}
                </select>
                {errors.originAirport && (
                  <p className="mt-1 text-sm text-red-600">{errors.originAirport}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code (Optional)
                </label>
                <input
                  type="text"
                  value={formData.origin.zipCode}
                  onChange={(e) => handleInputChange('origin', 'zipCode', e.target.value)}
                  placeholder="e.g., 90001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Destination Section */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-gray-600" />
              Destination (International)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Airport *
                </label>
                <select
                  value={formData.destination.airport}
                  onChange={(e) => handleInputChange('destination', 'airport', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.destAirport ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Airport</option>
                  {intlAirports.map(airport => (
                    <option key={airport.code} value={airport.code}>
                      {airport.code} - {airport.name} ({airport.country})
                    </option>
                  ))}
                </select>
                {errors.destAirport && (
                  <p className="mt-1 text-sm text-red-600">{errors.destAirport}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.destination.city}
                  onChange={(e) => handleInputChange('destination', 'city', e.target.value)}
                  placeholder="Destination city"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Cargo Details */}
          <CargoDetails 
            cargo={formData.cargo}
            onChange={handleCargoChange}
            error={errors.cargo}
          />

          {/* Incoterms */}
          <IncotermSelector
            selected={formData.incoterm}
            onChange={handleIncotermChange}
          />

          {/* Service Options */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Service Options</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="standard"
                      checked={formData.serviceType === 'standard'}
                      onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                      className="mr-2"
                    />
                    <span>Standard (5-7 days)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="express"
                      checked={formData.serviceType === 'express'}
                      onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                      className="mr-2"
                    />
                    <span>Express (2-3 days)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commodity Description *
                </label>
                <input
                  type="text"
                  value={formData.commodity}
                  onChange={(e) => setFormData({...formData, commodity: e.target.value})}
                  placeholder="e.g., Electronics, Textiles, Machinery"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.commodity ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.commodity && (
                  <p className="mt-1 text-sm text-red-600">{errors.commodity}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.insurance}
                    onChange={(e) => setFormData({...formData, insurance: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm">Add cargo insurance</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.dangerousGoods}
                    onChange={(e) => setFormData({...formData, dangerousGoods: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm">Dangerous goods</span>
                </label>
              </div>

              {formData.insurance && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Declared Value (USD)
                  </label>
                  <input
                    type="number"
                    value={formData.declaredValue}
                    onChange={(e) => setFormData({...formData, declaredValue: e.target.value})}
                    placeholder="Enter value"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Instructions (Optional)
            </label>
            <textarea
              value={formData.specialInstructions}
              onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})}
              rows="3"
              placeholder="Any special handling requirements or notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
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
              className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating Quote...
                </>
              ) : (
                'Get Quote'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AirQuoteForm;
