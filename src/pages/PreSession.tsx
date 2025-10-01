import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Brain, Coffee, Battery, Moon, Activity, Target, CreditCard as Edit2, X, Dumbbell, AlertCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import TrainingCard from '../components/training/TrainingCard';
import AGameReadinessCheck from '../components/session/AGameReadinessCheck';
import { usePreSession } from '../hooks/usePreSession';
import { PreSessionProtocol } from '../lib/api/preSession';

const PreSession: React.FC = () => {
  const [globalGoal, setGlobalGoal] = useState('');
  const [globalGoalReason, setGlobalGoalReason] = useState('');
  const [skipGoal, setSkipGoal] = useState(false);
  const [primaryFocus, setPrimaryFocus] = useState('');
  const [lastSessionFocus] = useState('Leaking too many river calls OOP in 3BP');
  const [mentalState, setMentalState] = useState(3);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [emotionalState, setEmotionalState] = useState('');
  const [aGameFeeling, setAGameFeeling] = useState('');
  const [mentalAnchor, setMentalAnchor] = useState('');
  const [tiltTriggers, setTiltTriggers] = useState('');
  const [tiltPlan, setTiltPlan] = useState('');
  const [gameType, setGameType] = useState('cash');
  const [stakes, setStakes] = useState('');
  const [sessionLength, setSessionLength] = useState('');

  const [meditationTime, setMeditationTime] = useState<'3' | '5' | '10' | 'none'>('none');
  const [isReadyForAGame, setIsReadyForAGame] = useState(false);
  const [showMeditationSuggestion, setShowMeditationSuggestion] = useState(false);
  const [isPhysicallyReady, setIsPhysicallyReady] = useState(false);

  const [readinessSleep, setReadinessSleep] = useState(0);
  const [readinessEnergy, setReadinessEnergy] = useState(0);
  const [readinessClarity, setReadinessClarity] = useState(0);
  const [readinessEmotions, setReadinessEmotions] = useState(0);
  const [readinessPhysicalPrep, setReadinessPhysicalPrep] = useState({
    water: false,
    food: false,
    stretch: false,
    caffeine: false,
  });
  const [skipReadinessCheck, setSkipReadinessCheck] = useState(false);

  const navigate = useNavigate();
  const { submit, loading, error } = usePreSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const physicalPrepScore =
        (readinessPhysicalPrep.water ? 2.5 : 0) +
        (readinessPhysicalPrep.food ? 2.5 : 0) +
        (readinessPhysicalPrep.stretch ? 2.5 : 0) +
        (readinessPhysicalPrep.caffeine ? 2.5 : 0);

      let aGameScore = null;
      let readinessZone = null;

      if (!skipReadinessCheck && readinessSleep > 0 && readinessEnergy > 0 && readinessClarity > 0 && readinessEmotions > 0) {
        aGameScore = Math.round(
          ((readinessSleep + readinessEnergy + readinessClarity + readinessEmotions + physicalPrepScore) / 5) * 10
        );

        if (aGameScore >= 70) {
          readinessZone = 'GO';
        } else if (aGameScore >= 50) {
          readinessZone = 'CAUTION';
        } else {
          readinessZone = 'STOP';
        }
      }

      const protocolData: PreSessionProtocol = {
        long_term_goal: globalGoal,
        goal_meaning: globalGoalReason,
        primary_focus_area: lastSessionFocus,
        session_focus: primaryFocus,
        meditation_duration: meditationTime === 'none' ? null : parseInt(meditationTime),
        mental_state_score: mentalState,
        energy_level_score: parseInt(energyLevel),
        sleep_quality: sleepQuality,
        emotional_state: emotionalState,
        a_game_description: aGameFeeling,
        mental_anchor: mentalAnchor,
        tilt_triggers: tiltTriggers,
        tilt_response: tiltPlan,
        game_type: gameType,
        stakes_or_buyin: stakes,
        planned_duration: sessionLength,
        sleep_quality_score: readinessSleep,
        energy_level_readiness: readinessEnergy,
        mental_clarity: readinessClarity,
        emotional_stability: readinessEmotions,
        physical_prep_water: readinessPhysicalPrep.water,
        physical_prep_food: readinessPhysicalPrep.food,
        physical_prep_stretch: readinessPhysicalPrep.stretch,
        physical_prep_caffeine: readinessPhysicalPrep.caffeine,
        a_game_score: aGameScore,
        readiness_zone: readinessZone,
        skip_readiness_check: skipReadinessCheck
      };

      await submit(protocolData);
      navigate('/');
    } catch (err) {
      console.error('Failed to submit pre-session protocol:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error.message}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="mb-6 bg-blue-50 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            🔍 Before you begin: Make sure you have water nearby, use the bathroom if needed, and remove any potential distractions from your environment.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Pre-Session Protocol</h2>
          <p className="text-gray-600">
            Set your intentions and assess your current state before playing. This helps establish the right mindset and provides valuable context for post-session analysis.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-800 mb-4">Global Goal Check-In</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  What is your current long-term goal in poker?
                </label>
                <input
                  type="text"
                  value={globalGoal}
                  onChange={(e) => setGlobalGoal(e.target.value)}
                  disabled={skipGoal}
                  className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                    skipGoal 
                      ? 'bg-gray-100 border-gray-300 text-gray-500' 
                      : 'border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200'
                  }`}
                  placeholder="e.g., Build a consistent $5K/month grind, Reach NL500 and stay there"
                  required={!skipGoal}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Why is this important to you?
                </label>
                <textarea
                  value={globalGoalReason}
                  onChange={(e) => setGlobalGoalReason(e.target.value)}
                  disabled={skipGoal}
                  className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                    skipGoal 
                      ? 'bg-gray-100 border-gray-300 text-gray-500' 
                      : 'border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200'
                  }`}
                  rows={2}
                  placeholder="What does this goal mean for your life, and why does it matter?"
                  required={!skipGoal}
                />
              </div>

              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={skipGoal}
                    onChange={(e) => setSkipGoal(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-blue-700">
                    I'm unsure right now / I want to skip this step today
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Today's Primary Focus</h3>
            
            <div className="mb-4">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Edit2 size={16} className="mr-2 text-blue-600" />
                Last session's focus area:
              </div>
              <div className="bg-white p-3 rounded-md border border-gray-200">
                {lastSessionFocus}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What will you focus on today?
              </label>
              <textarea
                value={primaryFocus}
                onChange={(e) => setPrimaryFocus(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2 border"
                rows={2}
                placeholder="What specific aspect of your game will you work on?"
              />
            </div>

            <div className="mt-4">
              <Link
                to="/training"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Dumbbell size={16} className="mr-2" />
                Train this Spot
              </Link>
            </div>
          </div>

          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Clock size={20} className="mr-2 text-blue-600" />
              Pre-Game Meditation
            </h3>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Did you complete a pre-game meditation or visualization?
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setMeditationTime('3')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    meditationTime === '3'
                      ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Yes - 3 minutes
                </button>
                <button
                  type="button"
                  onClick={() => setMeditationTime('5')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    meditationTime === '5'
                      ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Yes - 5 minutes
                </button>
                <button
                  type="button"
                  onClick={() => setMeditationTime('10')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    meditationTime === '10'
                      ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Yes - 10 minutes
                </button>
                <button
                  type="button"
                  onClick={() => setMeditationTime('none')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    meditationTime === 'none'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Not today
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Brain size={16} className="mr-2 text-blue-600" />
                Mental State
              </label>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Distracted</span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={mentalState}
                  onChange={(e) => setMentalState(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-sm text-gray-500 ml-2">Focused</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Battery size={16} className="mr-2 text-blue-600" />
                Energy Level
              </label>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Low</span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-sm text-gray-500 ml-2">High</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Moon size={16} className="mr-2 text-blue-600" />
                Sleep Quality
              </label>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Poor</span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-sm text-gray-500 ml-2">Excellent</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Brain size={16} className="mr-2 text-blue-600" />
                Emotional State
              </label>
              <input
                type="text"
                value={emotionalState}
                onChange={(e) => setEmotionalState(e.target.value)}
                placeholder="Describe in 1-2 words"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2 border"
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Brain size={20} className="mr-2 text-blue-600" />
              A-Game Activation
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How does your A-Game feel like?
                </label>
                <textarea
                  value={aGameFeeling}
                  onChange={(e) => setAGameFeeling(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2 border"
                  rows={2}
                  placeholder="Describe the feeling when you're playing your best"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mental Anchor Phrase
                </label>
                <textarea
                  value={mentalAnchor}
                  onChange={(e) => setMentalAnchor(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2 border"
                  rows={2}
                  placeholder="e.g., Calm is my edge, One hand at a time"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <AlertCircle size={20} className="mr-2 text-blue-600" />
              Tilt Anticipation & Reset Plan
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What situations might tilt or distract you today?
                </label>
                <textarea
                  value={tiltTriggers}
                  onChange={(e) => setTiltTriggers(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2 border"
                  rows={2}
                  placeholder="List potential triggers or challenging situations"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What will you do if it happens?
                </label>
                <textarea
                  value={tiltPlan}
                  onChange={(e) => setTiltPlan(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2 border"
                  rows={2}
                  placeholder="e.g., Breathe. Pause. Don't react."
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Activity size={20} className="mr-2 text-blue-600" />
              Session Logistics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Game Type
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input 
                      type="radio" 
                      name="gameType" 
                      value="cash" 
                      checked={gameType === 'cash'} 
                      onChange={() => setGameType('cash')}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Cash Game</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input 
                      type="radio" 
                      name="gameType" 
                      value="tournament" 
                      checked={gameType === 'tournament'} 
                      onChange={() => setGameType('tournament')}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Tournament</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stakes / Buy-in
                </label>
                <input
                  type="text"
                  value={stakes}
                  onChange={(e) => setStakes(e.target.value)}
                  placeholder="e.g., $1/$2 or $200 MTT"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Planned Session Length
                </label>
                <input
                  type="text"
                  value={sessionLength}
                  onChange={(e) => setSessionLength(e.target.value)}
                  placeholder="e.g., 3 hours"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2 border"
                />
              </div>
            </div>
          </div>

          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Brain size={20} className="mr-2 text-blue-600" />
              A-Game Readiness Check
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={isReadyForAGame}
                  onChange={(e) => {
                    setIsReadyForAGame(e.target.checked);
                    setShowMeditationSuggestion(!e.target.checked);
                  }}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">
                  Yes, I'm ready to play my A-Game
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={isPhysicallyReady}
                  onChange={(e) => setIsPhysicallyReady(e.target.checked)}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">
                  I've had some water, finished bathroom stuff, and removed distractions.
                </span>
              </label>

              {showMeditationSuggestion && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    Take a moment to re-read your global goal and reconnect with your purpose.
                    If something is holding you back, consider another quick round of meditation or breathing.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMeditationTime('5');
                      setShowMeditationSuggestion(false);
                    }}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Repeat Meditation
                  </button>
                </div>
              )}
            </div>
          </div>

          <AGameReadinessCheck
            sleepQuality={readinessSleep}
            energyLevel={readinessEnergy}
            mentalClarity={readinessClarity}
            emotionalStability={readinessEmotions}
            physicalPrep={readinessPhysicalPrep}
            skipCheck={skipReadinessCheck}
            onSleepQualityChange={setReadinessSleep}
            onEnergyLevelChange={setReadinessEnergy}
            onMentalClarityChange={setReadinessClarity}
            onEmotionalStabilityChange={setReadinessEmotions}
            onPhysicalPrepChange={setReadinessPhysicalPrep}
            onSkipCheckChange={setSkipReadinessCheck}
          />

          <div className="flex justify-between">
            <Link
              to="/"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Saving...' : 'Start Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PreSession;