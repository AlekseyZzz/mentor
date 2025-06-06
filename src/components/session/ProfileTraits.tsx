import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { MentalGameTrait } from '../../lib/api/mentalGameTraits';

interface ProfileTraitsProps {
  profileType: 'a' | 'b' | 'c' | 'd';
  profileName: string;
}

const ProfileTraits: React.FC<ProfileTraitsProps> = ({ profileType, profileName }) => {
  const [newTrait, setNewTrait] = useState('');
  const [localTraits, setLocalTraits] = useState<string[]>([]);

  const handleAddTrait = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrait.trim()) return;

    // Add to local state
    setLocalTraits(prev => [...prev, newTrait.trim()]);
    
    // Clear input
    setNewTrait('');
  };

  const handleRemoveTrait = (indexToRemove: number) => {
    setLocalTraits(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
      <h4 className="text-sm font-medium text-gray-900 mb-2">
        🧠 Define your traits for {profileName}
      </h4>
      <p className="text-xs text-gray-600 mb-4">
        What does this game state feel like for you?
      </p>

      <form onSubmit={handleAddTrait} className="mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newTrait}
            onChange={(e) => setNewTrait(e.target.value)}
            placeholder="e.g., calm breath, verbal tilt, laser focus"
            className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={handleAddTrait}
            disabled={!newTrait.trim()}
            className={`px-3 py-2 bg-blue-600 text-white rounded-md text-sm flex items-center ${
              !newTrait.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            <Plus size={16} className="mr-1" />
            Add
          </button>
        </div>
      </form>

      {/* Display traits */}
      {localTraits.length > 0 && (
        <div className="space-y-2">
          {localTraits.map((trait, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-blue-50 rounded-md group"
            >
              <span className="text-sm text-blue-700">{trait}</span>
              <button
                onClick={() => handleRemoveTrait(index)}
                className="text-blue-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileTraits;