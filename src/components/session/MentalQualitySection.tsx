import React from 'react';
import ProfileTraits from './ProfileTraits';

interface MentalQualitySectionProps {
  gameLevel: string;
  onGameLevelChange: (level: string) => void;
  nonAGameReasons: string[];
  onNonAGameReasonsChange: (reasons: string[]) => void;
  otherReason: string;
  onOtherReasonChange: (reason: string) => void;
  rescueAttempted: boolean;
  onRescueAttemptedChange: (attempted: boolean) => void;
  rescueStrategy: string;
  onRescueStrategyChange: (strategy: string) => void;
  cGameMomentNote: string;
  onCGameMomentNoteChange: (note: string) => void;
}

const mentalProfiles = [
  { id: 'a', label: 'A-Game', emoji: '💚', description: 'Focused, confident, present, strong decision-making' },
  { id: 'b', label: 'B-Game', emoji: '💛', description: 'Decent focus, some mistakes or autopilot moments' },
  { id: 'c', label: 'C-Game', emoji: '🟠', description: 'Emotionally reactive, distracted, unsure' },
  { id: 'd', label: 'D-Game', emoji: '🔴', description: 'Tilt, frustration, mentally checked out' }
];

const MentalQualitySection: React.FC<MentalQualitySectionProps> = ({
  gameLevel,
  onGameLevelChange,
  nonAGameReasons,
  onNonAGameReasonsChange,
  otherReason,
  onOtherReasonChange,
  rescueAttempted,
  onRescueAttemptedChange,
  rescueStrategy,
  onRescueStrategyChange,
  cGameMomentNote,
  onCGameMomentNoteChange
}) => {
  const safeReasons = Array.isArray(nonAGameReasons) ? nonAGameReasons : [];

  const handleReasonChange = (reason: string) => {
    if (safeReasons.includes(reason)) {
      onNonAGameReasonsChange(safeReasons.filter(r => r !== reason));
    } else {
      onNonAGameReasonsChange([...safeReasons, reason]);
    }
  };

  return (
    <div className="mb-6 bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Mental Game Quality</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {mentalProfiles.map(profile => (
          <button
            type="button"
            key={profile.id}
            onClick={() => onGameLevelChange(profile.id)}
            className={`relative flex flex-col items-center p-4 rounded-lg transition-colors ${
              gameLevel === profile.id
                ? 'bg-blue-100 ring-2 ring-blue-500'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <span className="text-2xl mb-2">{profile.emoji}</span>
            <span className="font-medium text-sm">{profile.label}</span>
            <span className="text-xs text-gray-500 text-center mt-1">
              {profile.description}
            </span>
          </button>
        ))}
      </div>

      {gameLevel && (
        <ProfileTraits
          profileType={gameLevel as 'a' | 'b' | 'c' | 'd'}
          profileName={mentalProfiles.find(p => p.id === gameLevel)?.label || ''}
        />
      )}

      {gameLevel !== 'a' && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What prevented you from playing your A-Game?
            </label>
            <div className="space-y-2">
              {[
                'Lack of focus',
                'Physical fatigue',
                'Mental fatigue',
                'External distractions',
                'Emotional state',
                'Technical issues'
              ].map(reason => (
                <label key={reason} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={safeReasons.includes(reason)}
                    onChange={() => handleReasonChange(reason)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{reason}</span>
                </label>
              ))}
              <div>
                <input
                  type="text"
                  value={otherReason}
                  onChange={(e) => onOtherReasonChange(e.target.value)}
                  placeholder="Other reason..."
                  className="mt-2 w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Did you try to reset and get back to A-Game?
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => onRescueAttemptedChange(true)}
                className={`px-4 py-2 rounded-md ${
                  rescueAttempted
                    ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => onRescueAttemptedChange(false)}
                className={`px-4 py-2 rounded-md ${
                  rescueAttempted === false
                    ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                No
              </button>
            </div>
          </div>

          {rescueAttempted && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What strategy did you use to try to reset?
              </label>
              <textarea
                value={rescueStrategy}
                onChange={(e) => onRescueStrategyChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="e.g., Took a break, did breathing exercises, reviewed my goals..."
              />
            </div>
          )}

          {gameLevel === 'c' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe a C-Game moment and what you learned
              </label>
              <textarea
                value={cGameMomentNote}
                onChange={(e) => onCGameMomentNoteChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="What happened? How did it affect your play? What can you do differently next time?"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MentalQualitySection;
