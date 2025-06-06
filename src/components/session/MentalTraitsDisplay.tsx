import React from 'react';
import { useMentalGameTraits } from '../../hooks/useMentalGameTraits';
import { Brain, Loader } from 'lucide-react';

interface MentalTraitsDisplayProps {
  profileType: 'a' | 'b' | 'c' | 'd';
}

const MentalTraitsDisplay: React.FC<MentalTraitsDisplayProps> = ({ profileType }) => {
  const { traits, loading, error } = useMentalGameTraits(profileType);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader className="animate-spin text-blue-600\" size={20} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-sm py-2">
        Failed to load mental game traits
      </div>
    );
  }

  if (!traits.length) {
    return (
      <div className="text-gray-500 text-sm py-2 italic">
        No traits defined for this profile
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {traits.map((trait, index) => (
        <div
          key={trait.id}
          className="flex items-start"
        >
          <span className="text-gray-500 mr-2">{index + 1}.</span>
          <span className="text-gray-700">{trait.trait_text}</span>
        </div>
      ))}
    </div>
  );
};

export default MentalTraitsDisplay;