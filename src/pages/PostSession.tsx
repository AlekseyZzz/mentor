// src/pages/PostSession.tsx
import React, { useState } from 'react';
import { Info, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import HandAnalysis from '../components/session/HandAnalysis';
import AutoResizeTextArea from '../components/common/AutoResizeTextArea';
import MentalQualitySection from '../components/session/MentalQualitySection';
import MentalGameNotes from '../components/session/MentalGameNotes';
import { usePostSession } from '../hooks/usePostSession';

interface MentalGameNote {
  id: string;
  note_text: string;
}

const PostSession: React.FC = () => {
  const [minutesPlayed, setMinutesPlayed] = useState('');
  const [tableCount, setTableCount] = useState('1');
  const [energyLevel, setEnergyLevel] = useState('');
  const [mentalState, setMentalState] = useState('');
  const [tiltTriggers, setTiltTriggers] = useState('');
  const [learnings, setLearnings] = useState('');
  const [expandedHands, setExpandedHands] = useState<number[]>([0]);
  const [hands, setHands] = useState([0]);
  const [didPreSession, setDidPreSession] = useState(true);
  const [skipReason, setSkipReason] = useState('');
  const [preSessionFeeling, setPreSessionFeeling] = useState('');
  const [hadStrongEmotions, setHadStrongEmotions] = useState<boolean | null>(null);
  const [emotion, setEmotion] = useState('');
  const [emotionTrigger, setEmotionTrigger] = useState('');
  const [emotionThoughts, setEmotionThoughts] = useState('');
  const [validReaction, setValidReaction] = useState('');
  const [exaggeratedReaction, setExaggeratedReaction] = useState('');
  const [futureResponse, setFutureResponse] = useState('');
  const [resetChecklist, setResetChecklist] = useState({
    breathingDone: false,
    visualizationDone: false,
    selfWorthReminder: false
  });
  const [resetMessage, setResetMessage] = useState('');
  const [mentalGameNotes, setMentalGameNotes] = useState<MentalGameNote[]>([]);
  const [noteIdCounter, setNoteIdCounter] = useState(0);

  const [gameLevel, setGameLevel] = useState('');
  const [nonAGameReasons, setNonAGameReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState('');
  const [rescueAttempted, setRescueAttempted] = useState<boolean>(false);
  const [rescueStrategy, setRescueStrategy] = useState('');
  const [cGameMomentNote, setCGameMomentNote] = useState('');

  const navigate = useNavigate();
  const { submit, loading, error } = usePostSession();

  const handleAddNote = (noteText: string) => {
    const newNote = {
      id: `temp-${noteIdCounter}`,
      note_text: noteText
    };
    setMentalGameNotes([...mentalGameNotes, newNote]);
    setNoteIdCounter(noteIdCounter + 1);
  };

  const handleRemoveNote = (id: string) => {
    setMentalGameNotes(mentalGameNotes.filter(note => note.id !== id));
  };

  const toggleHand = (index: number) => {
    setExpandedHands(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };

  const addHand = () => {
    setHands([...hands, hands.length]);
    setExpandedHands([...expandedHands, hands.length]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const minutes = Math.max(1, parseInt(minutesPlayed) || 0);
    const sessionDate = new Date().toISOString().slice(0, 10);

    try {
      await submit({
        minutes_played: minutes,
        tables_played: parseInt(tableCount),
        energy_level: energyLevel,
        session_date: sessionDate,
        mental_profiles: [],
        pre_session_done: didPreSession,
        skip_reason: !didPreSession ? skipReason : undefined,
        pre_session_feeling: !didPreSession ? preSessionFeeling : undefined,
        had_strong_emotions: hadStrongEmotions || false,
        emotion,
        emotion_trigger: emotionTrigger,
        emotion_thoughts: emotionThoughts,
        valid_reaction: validReaction,
        exaggerated_reaction: exaggeratedReaction,
        future_response: futureResponse,
        reset_checklist: resetChecklist,
        reset_message: resetMessage
      });

      navigate('/');
    } catch (err) {
      console.error('Failed to submit session reflection:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error.message}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="text-sm text-gray-600 mb-6 flex items-center bg-blue-50 p-4 rounded-lg">
          <Info className="flex-shrink-0 mr-3 text-blue-600" size={20} />
          <p>
            This reflection space is for growth — not judgment. Even one honest observation today can improve your future sessions.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Post-Session Reflection</h2>
          <p className="text-gray-600">
            Analyze your session performance, mental state, and key moments to improve future decision-making.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Session Summary */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-md font-medium mb-4 flex items-center">
              <Clock className="mr-2 text-blue-600" size={18} />
              Session Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Minutes Played
                </label>
                <input
                  type="number"
                  min={1}
                  value={minutesPlayed}
                  onChange={(e) => setMinutesPlayed(e.target.value)}
                  placeholder="180"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Tables Played
                </label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={tableCount}
                  onChange={(e) => setTableCount(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>

          {/* Mental Quality Section */}
          <MentalQualitySection
            gameLevel={gameLevel}
            onGameLevelChange={setGameLevel}
            nonAGameReasons={setNonAGameReasons}
            onNonAGameReasonsChange={setNonAGameReasons}
            otherReason={otherReason}
            onOtherReasonChange={setOtherReason}
            rescueAttempted={rescueAttempted}
            onRescueAttemptedChange={setRescueAttempted}
            rescueStrategy={rescueStrategy}
            onRescueStrategyChange={setRescueStrategy}
            cGameMomentNote={cGameMomentNote}
            onCGameMomentNoteChange={setCGameMomentNote}
          />

          {/* Mental Game Notes */}
          <MentalGameNotes
            notes={mentalGameNotes}
            onAddNote={handleAddNote}
            onRemoveNote={handleRemoveNote}
          />

          {/* Hands */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <span className="mr-2 text-blue-600">🃏</span>
                Hand Analysis
              </label>
              <button
                type="button"
                onClick={addHand}
                className="px-2 py-1 text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
              >
                <span className="mr-1">＋</span>
                Add Hand
              </button>
            </div>
            {hands.map((index) => (
              <HandAnalysis
                key={index}
                index={index}
                expanded={expandedHands.includes(index)}
                onToggle={() => toggleHand(index)}
              />
            ))}
          </div>

          {/* Submit */}
          <div className="flex justify-between mt-6">
            <Link
              to="/"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || parseInt(minutesPlayed) < 1}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 ${
                loading || parseInt(minutesPlayed) < 1 ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Saving...' : 'Complete Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostSession;
