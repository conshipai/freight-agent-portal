// src/components/common/CargoDetails.jsx
import React from 'react';
import { Package, Plus, X, AlertCircle } from 'lucide-react';

const CargoDetails = ({ cargo, onChange, error }) => {
  const addPiece = () => {
    const newPiece = {
      quantity: 1,
      weight: '',
      length: '',
      width: '',
      height: '',
      weightUnit: cargo.pieces[0]?.weightUnit || 'lbs',
      dimensionUnit: cargo.pieces[0]?.dimensionUnit || 'in'
    };
    
    onChange({
      ...cargo,
      pieces: [...cargo.pieces, newPiece]
    });
  };

  const removePiece = (index) => {
    if (cargo.pieces.length > 1) {
      onChange({
        ...cargo,
        pieces: cargo.pieces.filter((_, i) => i !== index)
      });
    }
  };

  const updatePiece = (index, field, value) => {
    const updatedPieces = cargo.pieces.map((piece, i) => {
      if (i === index) {
        return { ...piece, [field]: value };
      }
      return piece;
    });
    
    onChange({
      ...cargo,
      pieces: updatedPieces
    });
  };

  const updateAllUnits = (unitType, value) => {
    const updatedPieces = cargo.pieces.map(piece => ({
      ...piece,
      [unitType]: value
    }));
    
    onChange({
      ...cargo,
      pieces: updatedPieces
    });
  };

  // Calculate totals
  const totalPieces = cargo.pieces.reduce((sum, piece) => sum + (parseInt(piece.quantity) || 0), 0);
  const totalWeight = cargo.pieces.reduce((sum, piece) => {
    const qty = parseInt(piece.quantity) || 0;
    const weight = parseFloat(piece.weight) || 0;
    return sum + (qty * weight);
  }, 0);

  const totalVolume = cargo.pieces.reduce((sum, piece) => {
    const qty = parseInt(piece.quantity) || 0;
    const l = parseFloat(piece.length) || 0;
    const w = parseFloat(piece.width) || 0;
    const h = parseFloat(piece.height) || 0;
    return sum + (qty * l * w * h);
  }, 0);

  const weightUnit = cargo.pieces[0]?.weightUnit || 'lbs';
  const dimUnit = cargo.pieces[0]?.dimensionUnit || 'in';

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Package className="h-5 w-5 mr-2 text-gray-600" />
          Cargo Details
        </h3>
        <button
          type="button"
          onClick={addPiece}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Piece
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Unit Selection */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight Unit
          </label>
          <select
            value={weightUnit}
            onChange={(e) => updateAllUnits('weightUnit', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="lbs">Pounds (lbs)</option>
            <option value="kg">Kilograms (kg)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dimension Unit
          </label>
          <select
            value={dimUnit}
            onChange={(e) => updateAllUnits('dimensionUnit', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="in">Inches (in)</option>
            <option value="cm">Centimeters (cm)</option>
          </select>
        </div>
      </div>

      {/* Cargo Pieces */}
      <div className="space-y-4">
        {cargo.pieces.map((piece, index) => (
          <div key={index} className="bg-gray-50 rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">
                Piece {index + 1}
              </h4>
              {cargo.pieces.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePiece(index)}
                  className="text-red-600 hover:text-red-800"
                  title="Remove piece"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={piece.quantity}
                  onChange={(e) => updatePiece(index, 'quantity', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Weight ({weightUnit})
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={piece.weight}
                  onChange={(e) => updatePiece(index, 'weight', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Length ({dimUnit})
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={piece.length}
                  onChange={(e) => updatePiece(index, 'length', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Width ({dimUnit})
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={piece.width}
                  onChange={(e) => updatePiece(index, 'width', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Height ({dimUnit})
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={piece.height}
                  onChange={(e) => updatePiece(index, 'height', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="text-gray-600">Total Pieces</p>
            <p className="text-lg font-semibold text-gray-900">{totalPieces}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Total Weight</p>
            <p className="text-lg font-semibold text-gray-900">
              {totalWeight.toFixed(2)} {weightUnit}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Total Volume</p>
            <p className="text-lg font-semibold text-gray-900">
              {totalVolume.toFixed(2)} {dimUnit}³
            </p>
          </div>
        </div>
      </div>

      {/* Chargeable Weight Info */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> Airlines calculate charges based on chargeable weight, 
          which is the greater of actual weight or volumetric weight (dimensional weight). 
          Volumetric weight = (L × W × H) ÷ Dimensional Factor.
        </p>
      </div>
    </div>
  );
};

export default CargoDetails;
