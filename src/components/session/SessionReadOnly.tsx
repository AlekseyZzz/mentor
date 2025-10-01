import React, { useState } from 'react';
import { Brain, Heart, CheckCircle, X, AlertCircle, Image, ChevronDown, ChevronUp, ZoomIn, CreditCard as Edit2, Trash2 } from 'lucide-react';
import MentalTraitsDisplay from './MentalTraitsDisplay';

interface SessionReadOnlyProps {
  session: any;
  onEdit?: () => void;
  onDelete?: () => void;
}

const SessionReadOnly: React.FC<SessionReadOnlyProps> = ({ session, onEdit, onDelete }) => {
  const [expandedHands, setExpandedHands] = useState<number[]>([0]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggleHand = (index: number) => {
    setExpandedHands(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit2 size={18} />
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 size={18} />
            Delete
          </button>
        )}
      </div>
      {/* Session Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Duration</h4>
          <p className="text-lg font-semibold">{session.minutes_played} min</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Tables</h4>
          <p className="text-lg font-semibold">{session.tables_played || 1}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Mental State</h4>
          <p className="text-lg font-semibold capitalize">{session.game_level_self_rating || session.dominant_profile}-Game</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Energy Level</h4>
          <p className="text-lg font-semibold capitalize">{session.energy_level}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Pre-Session</h4>
          <p className="text-lg font-semibold flex items-center">
            {session.pre_session_done ? (
              <CheckCircle className="text-green-600 mr-1" size={20} />
            ) : (
              <X className="text-red-600 mr-1" size={20} />
            )}
            {session.pre_session_done ? 'Yes' : 'No'}
          </p>
        </div>
      </div>

      {/* Pre-Session Details */}
      {!session.pre_session_done && (session.skip_reason || session.pre_session_feeling) && (
        <div className="bg-amber-50 rounded-lg border border-amber-200 p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <AlertCircle className="mr-2 text-amber-600" size={20} />
            Pre-Session Skipped
          </h3>

          <div className="space-y-3">
            {session.skip_reason && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Reason for Skipping</h4>
                <p className="text-gray-600">{session.skip_reason}</p>
              </div>
            )}
            {session.pre_session_feeling && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">How You Felt</h4>
                <p className="text-gray-600">{session.pre_session_feeling}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mental Game Quality */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Brain className="mr-2 text-blue-600" size={20} />
          Mental Game Quality
        </h3>

        <div className="space-y-4">
          {/* Game Level */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Game Level</h4>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              session.game_level_self_rating === 'a' ? 'bg-green-100 text-green-800' :
              session.game_level_self_rating === 'b' ? 'bg-yellow-100 text-yellow-800' :
              session.game_level_self_rating === 'c' ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            }`}>
              {session.game_level_self_rating?.toUpperCase()}-Game
            </div>
          </div>

          {/* Mental Game Traits */}
          {session.game_level_self_rating && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Mental Game Traits</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <MentalTraitsDisplay profileType={session.game_level_self_rating} />
              </div>
            </div>
          )}

          {/* Non-A-Game Reasons */}
          {session.non_a_game_reasons && session.non_a_game_reasons.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Reasons for Not Playing A-Game</h4>
              <div className="flex flex-wrap gap-2">
                {session.non_a_game_reasons.map((reason: string, index: number) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {reason}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rescue Attempt */}
          {session.rescue_attempted !== null && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">A-Game Rescue Attempt</h4>
              <div className={`p-4 rounded-lg ${
                session.rescue_attempted ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <p className={`flex items-center ${
                  session.rescue_attempted ? 'text-green-800' : 'text-red-800'
                }`}>
                  {session.rescue_attempted ? (
                    <>
                      <CheckCircle size={16} className="mr-2" />
                      Rescue attempted with strategy: {session.rescue_strategy}
                    </>
                  ) : (
                    <>
                      <X size={16} className="mr-2" />
                      No rescue attempt made
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* C-Game Moment */}
          {session.c_game_moment_note && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">C-Game Moment Analysis</h4>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-orange-800">{session.c_game_moment_note}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Emotional Review */}
      {session.had_strong_emotions && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Heart className="mr-2 text-blue-600" size={20} />
            Emotional Review
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Emotion</h4>
                <p className="text-gray-600">{session.emotion}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Trigger</h4>
                <p className="text-gray-600">{session.emotion_trigger}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Thoughts</h4>
              <p className="text-gray-600">{session.emotion_thoughts}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Valid Reaction</h4>
                <p className="text-gray-600">{session.valid_reaction}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Exaggerated Response</h4>
                <p className="text-gray-600">{session.exaggerated_reaction}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Future Response Plan</h4>
              <p className="text-gray-600">{session.future_response}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mental Game Notes */}
      {session.mental_game_notes && session.mental_game_notes.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Brain className="mr-2 text-blue-600" size={20} />
            Notable Mental Game Moments
          </h3>

          <div className="space-y-3">
            {session.mental_game_notes.map((note: any, index: number) => (
              <div key={note.id} className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">{note.note_text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hand Analysis */}
      {session.hand_analysis && session.hand_analysis.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Image className="mr-2 text-blue-600" size={20} />
            Hand Analysis
          </h3>

          <div className="space-y-4">
            {session.hand_analysis.map((hand: any, index: number) => (
              <div key={hand.id} className="border border-gray-200 rounded-lg">
                <div
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleHand(index)}
                >
                  <h4 className="font-medium text-gray-700">Hand #{index + 1}</h4>
                  {expandedHands.includes(index) ? (
                    <ChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </div>

                {expandedHands.includes(index) && (
                  <div className="p-4 border-t border-gray-200">
                    {hand.screenshot_url && (
                      <div className="mb-4 relative group">
                        <img
                          src={hand.screenshot_url}
                          alt={`Hand ${index + 1} screenshot`}
                          className="rounded-lg max-h-64 object-contain bg-gray-50 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(hand.screenshot_url);
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <ZoomIn size={16} />
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-600">Description</h5>
                    <p className="text-gray-700 whitespace-pre-wrap">{hand.hand_description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-600">Initial Thought</h5>
                      <p className="text-gray-700 whitespace-pre-wrap">{hand.initial_thought}</p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-600">Adaptive Thought</h5>
                      <p className="text-gray-700 whitespace-pre-wrap">{hand.adaptive_thought}</p>
                    </div>
                  </div>

                  {(hand.arguments_for_initial || hand.arguments_against_initial) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hand.arguments_for_initial && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-600">Arguments For Initial Thought</h5>
                          <p className="text-gray-700 whitespace-pre-wrap">{hand.arguments_for_initial}</p>
                        </div>
                      )}
                      {hand.arguments_against_initial && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-600">Arguments Against Initial Thought</h5>
                          <p className="text-gray-700 whitespace-pre-wrap">{hand.arguments_against_initial}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hand.spot_type && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-600">Spot Type</h5>
                        <p className="text-gray-700">{hand.spot_type}</p>
                      </div>
                    )}
                    {hand.position_dynamic && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-600">Position Dynamic</h5>
                        <p className="text-gray-700">{hand.position_dynamic}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {hand.tags && hand.tags.map((tag: string, tagIndex: number) => (
                      <span key={tagIndex} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                    {hand.priority_level && (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        hand.priority_level === 'high' ? 'bg-red-100 text-red-800' :
                        hand.priority_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {hand.priority_level} priority
                      </span>
                    )}
                  </div>

                  {hand.theory_attachments && hand.theory_attachments.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">Theory Attachments</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {hand.theory_attachments.map((url: string, urlIndex: number) => (
                          <div key={urlIndex} className="relative group">
                            <img
                              src={url}
                              alt={`Theory attachment ${urlIndex + 1}`}
                              className="rounded-lg h-32 w-full object-cover bg-gray-50 border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => setSelectedImage(url)}
                            />
                            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              <ZoomIn size={14} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Checklist */}
      {session.reset_checklist && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <CheckCircle className="mr-2 text-blue-600" size={20} />
            Post-Session Reset
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={session.reset_checklist.breathingDone}
                readOnly
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">
                Deep breathing and mental closure
              </span>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={session.reset_checklist.visualizationDone}
                readOnly
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">
                Next session visualization
              </span>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={session.reset_checklist.selfWorthReminder}
                readOnly
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">
                Self-worth reminder
              </span>
            </div>

            {session.reset_message && (
              <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 italic">"{session.reset_message}"</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} />
            </button>
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Delete Session</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this session? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionReadOnly;