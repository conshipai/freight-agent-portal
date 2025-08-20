// src/components/quotes/ProjectQuoteForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import IncotermSelector from '../common/IncotermSelector';

const ProjectQuoteForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    origin: { location: '', country: 'US' },
    destination: { location: '', country: '' },
    cargoType: 'heavy-machinery',
    weight: '',
    dimensions: '',
    incoterm: 'EXW',
    specialRequirements: '',
    commodity: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/results', { state: { quoteData: formData, service: 'project' } });
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate('/')} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Services
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <Package className="h-8 w-8 text-orange-600 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Project Cargo Quote</h2>
            <p className="text-gray-600">Oversized and special cargo solutions</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Origin Location"
              value={formData.origin.location}
              onChange={(e) => setFormData({...formData, origin: {...formData.origin, location: e.target.value}})}
              className="px-3 py-2 border rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Destination"
              value={formData.destination.location}
              onChange={(e) => setFormData({...formData, destination: {...formData.destination, location: e.target.value}})}
              className="px-3 py-2 border rounded-md"
              required
            />
          </div>

          <select
            value={formData.cargoType}
            onChange={(e) => setFormData({...formData, cargoType: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="heavy-machinery">Heavy Machinery</option>
            <option value="construction">Construction Equipment</option>
            <option value="energy">Energy Equipment</option>
            <option value="aerospace">Aerospace</option>
          </select>

          <input
            type="text"
            placeholder="Weight (tons)"
            value={formData.weight}
            onChange={(e) => setFormData({...formData, weight: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
            required
          />

          <textarea
            placeholder="Dimensions and special requirements"
            value={formData.specialRequirements}
            onChange={(e) => setFormData({...formData, specialRequirements: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
            rows="4"
          />

          <IncotermSelector
            selected={formData.incoterm}
            onChange={(incoterm) => setFormData({...formData, incoterm})}
          />

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => navigate('/')} className="px-6 py-2 border rounded-md">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
              {loading ? 'Processing...' : 'Get Project Quote'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectQuoteForm;
