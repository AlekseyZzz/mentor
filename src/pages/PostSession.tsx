// src/pages/PostSession.tsx
import React, { useState, useEffect } from 'react';
import { Info, Clock } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import HandAnalysis, { HandData } from '../components/session/HandAnalysis';
import AutoResizeTextArea from '../components/common/AutoResizeTextArea';
import MentalQualitySection from '../components/session/MentalQualitySection';
import MentalGameNotes from '../components/session/MentalGameNotes';
import { usePostSession } from '../hooks/usePostSession';
import { createHandAnalysis, updateHandAnalysis } from '../lib/api/handAnalysis';
import { createMentalGameNotes, updateMentalGameNote, deleteMentalGameNote } from '../lib/api/mentalGameNotes';
import { getPostSessionById, updatePostSession } from '../lib/api/postSession';

interface MentalGameNote {
  id: string;
  note_text: string;
}

const PostSession: React.FC = () => {
  const [searchParams] = useSearchParams();
  const editSessionId = searchParams.get('edit');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);

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
  const [handsData, setHandsData] = useState<{ [key: number]: HandData }>({});

  const [gameLevel, setGameLevel] = useState('');
  const [nonAGameReasons, setNonAGameReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState('');
  const [rescueAttempted, setRescueAttempted] = useState<boolean>(false);
  const [rescueStrategy, setRescueStrategy] = useState('');
  const [cGameMomentNote, setCGameMomentNote] = useState('');

  const navigate = useNavigate();
  const { submit, loading, error } = usePostSession();

  useEffect(() => {
    if (editSessionId) {
      loadSessionData(editSessionId);
    }
  }, [editSessionId]);

  const loadSessionData = async (sessionId: string) => {
    setIsLoadingSession(true);
    try {
      const session = await getPostSessionById(sessionId);
      setIsEditMode(true);

      setMinutesPlayed(session.minutes_played?.toString() || '');
      setTableCount(session.tables_played?.toString() || '1');
      setEnergyLevel(session.energy_level || '');
      setDidPreSession(session.pre_session_done || false);
      setSkipReason(session.skip_reason || '');
      setPreSessionFeeling(session.pre_session_feeling || '');
      setHadStrongEmotions(session.had_strong_emotions);
      setEmotion(session.emotion || '');
      setEmotionTrigger(session.emotion_trigger || '');
      setEmotionThoughts(session.emotion_thoughts || '');
      setValidReaction(session.valid_reaction || '');
      setExaggeratedReaction(session.exaggerated_reaction || '');
      setFutureResponse(session.future_response || '');
      setResetChecklist(session.reset_checklist || {
        breathingDone: false,
        visualizationDone: false,
        selfWorthReminder: false
      });
      setResetMessage(session.reset_message || '');
      setGameLevel(session.game_level_self_rating || '');
      setNonAGameReasons(session.non_a_game_reasons || []);
      setRescueAttempted(session.rescue_attempted || false);
      setRescueStrategy(session.rescue_strategy || '');
      setCGameMomentNote(session.c_game_moment_note || '');

      if (session.hand_analysis && session.hand_analysis.length > 0) {
        const handIndices = session.hand_analysis.map((_: any, idx: number) => idx);
        setHands(handIndices);
        setExpandedHands([0]);

        const handsDataObj: { [key: number]: HandData } = {};
        session.hand_analysis.forEach((hand: any, idx: number) => {
          handsDataObj[idx] = {
            id: hand.id,
            screenshot_url: hand.screenshot_url,
            hand_description: hand.hand_description,
            initial_thought: hand.initial_thought,
            adaptive_thought: hand.adaptive_thought,
            arguments_for_initial: hand.arguments_for_initial || '',
            arguments_against_initial: hand.arguments_against_initial || '',
            spot_type: hand.spot_type || '',
            position_dynamic: hand.position_dynamic || '',
            tags: hand.tags || [],
            priority_level: hand.priority_level || 'low',
            theory_attachments: hand.theory_attachments || [],
            wizard_drill_script: hand.wizard_drill_script || ''
          };
        });
        setHandsData(handsDataObj);
      }

      if (session.mental_game_notes) {
        setMentalGameNotes(session.mental_game_notes.map((note: any) => ({
          id: note.id,
          note_text: note.note_text
        })));
      }
    } catch (err) {
      console.error('Failed to load session:', err);
      alert('Failed to load session data');
    } finally {
      setIsLoadingSession(false);
    }
  };

  const handleHandDataChange = (index: number, data: HandData) => {
    setHandsData(prev => ({ ...prev, [index]: data }));
  };

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
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const sessionDate = `${year}-${month}-${day}`;

    const sessionPayload = {
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
      reset_message: resetMessage,
      game_level_self_rating: gameLevel,
      non_a_game_reasons: nonAGameReasons,
      rescue_attempted: rescueAttempted,
      rescue_strategy: rescueStrategy,
      c_game_moment_note: cGameMomentNote
    };

    try {
      let sessionData;

      if (isEditMode && editSessionId) {
        sessionData = await updatePostSession(editSessionId, sessionPayload);

        const handsToSave = Object.values(handsData).filter(hand =>
          hand.hand_description || hand.initial_thought || hand.adaptive_thought
        );

        for (const hand of handsToSave) {
          if (hand.id && !hand.id.toString().startsWith('temp-')) {
            await updateHandAnalysis(hand.id, {
              screenshotUrl: hand.screenshot_url,
              description: hand.hand_description,
              initialThought: hand.initial_thought,
              adaptiveThought: hand.adaptive_thought,
              argumentsFor: hand.arguments_for_initial,
              argumentsAgainst: hand.arguments_against_initial,
              spotType: hand.spot_type,
              positionDynamic: hand.position_dynamic,
              tags: hand.tags,
              priorityLevel: hand.priority_level,
              theoryAttachments: hand.theory_attachments,
              wizardDrillScript: hand.wizard_drill_script
            });
          } else {
            await createHandAnalysis(editSessionId, [hand]);
          }
        }

        for (const note of mentalGameNotes) {
          if (note.id.startsWith('temp-')) {
            await createMentalGameNotes(editSessionId, [note.note_text]);
          } else {
            await updateMentalGameNote(note.id, note.note_text);
          }
        }
      } else {
        sessionData = await submit(sessionPayload);

        const handsToSave = Object.values(handsData).filter(hand =>
          hand.hand_description || hand.initial_thought || hand.adaptive_thought
        );

        if (handsToSave.length > 0) {
          await createHandAnalysis(sessionData.id, handsToSave);
        }

        if (mentalGameNotes.length > 0) {
          await createMentalGameNotes(sessionData.id, mentalGameNotes.map(note => note.note_text));
        }
      }

      navigate('/history');
    } catch (err) {
      console.error('Failed to submit session reflection:', err);
    }
  };

  if (isLoadingSession) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

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
          <h2 className="text-xl font-semibold mb-2">
            {isEditMode ? 'Edit Session Reflection' : 'Post-Session Reflection'}
          </h2>
          <p className="text-gray-600">
            {isEditMode
              ? 'Update your session analysis and reflections.'
              : 'Analyze your session performance, mental state, and key moments to improve future decision-making.'}
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
            nonAGameReasons={nonAGameReasons}
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
                onChange={(data) => handleHandDataChange(index, data)}
                initialData={handsData[index]}
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
              {loading ? 'Saving...' : isEditMode ? 'Update Session' : 'Complete Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostSession;
