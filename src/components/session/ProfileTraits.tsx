import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import {
  MentalGameTrait,
  addMentalGameTrait,
  getMentalGameTraits,
  deleteMentalGameTrait
} from '../../lib/api/mentalGameTraits';

interface ProfileTraitsProps {
  profileType: 'a' | 'b' | 'c' | 'd';
  profileName: string;
}

const ProfileTraits: React.FC<ProfileTraitsProps> = ({ profileType, profileName }) => {
  const [newTrait, setNewTrait] = useState('');
  const [traits, setTraits] = useState<MentalGameTrait[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTraits();
  }, [profileType]);

  const loadTraits = async () => {
    try {
      const data = await getMentalGameTraits(profileType);
      setTraits(data || []);
    } catch (error) {
      console.error('Failed to load traits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrait = async () => {
    if (!newTrait.trim()) return;

    try {
      const newTraitData = await addMentalGameTrait(profileType, newTrait.trim());
      setTraits(prev => [...prev, newTraitData]);
      setNewTrait('');
    } catch (error) {
      console.error('Failed to add trait:', error);
    }
  };

  const handleRemoveTrait = async (traitId: string) => {
    try {
      await deleteMentalGameTrait(traitId);
      setTraits(prev => prev.filter(t => t.id !== traitId));
    } catch (error) {
      console.error('Failed to delete trait:', error);
    }
  };

  return (
    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
      <h4 className="text-sm font-medium text-gray-900 mb-2">
        🧠 Define your traits for {profileName}
      </h4>
      <p className="text-xs text-gray-600 mb-4">
        What does this game state feel like for you?
      </p>

      <div className="mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newTrait}
            onChange={(e) => setNewTrait(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                handleAddTrait();
              }
            }}
            placeholder="e.g., calm breath, verbal tilt, laser focus"
            className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddTrait();
            }}
            disabled={!newTrait.trim() || loading}
            className={`px-3 py-2 bg-blue-600 text-white rounded-md text-sm flex items-center ${
              !newTrait.trim() || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            <Plus size={16} className="mr-1" />
            Add
          </button>
        </div>
      </div>

      {/* Display traits */}
      {loading ? (
        <div className="text-sm text-gray-500 text-center py-2">Loading...</div>
      ) : traits.length > 0 ? (
        <div className="space-y-2">
          {traits.map((trait) => (
            <div
              key={trait.id}
              className="flex items-center justify-between p-2 bg-blue-50 rounded-md group"
            >
              <span className="text-sm text-blue-700">{trait.trait_text}</span>
              <button
                type="button"
                onClick={() => handleRemoveTrait(trait.id)}
                className="text-blue-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ProfileTraits;