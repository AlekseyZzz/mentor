import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, X, Target, Shield, Activity } from 'lucide-react';
import AGameReadinessCheck from '../components/session/AGameReadinessCheck';
import { usePreSession } from '../hooks/usePreSession';
import { PreSessionProtocol } from '../lib/api/preSession';

const FOCUS_THEMES = [
  '3BP OOP: reduce river overcalls',
  'BB vs CO steal: widen defend with BDFD/BDSD',
  'Turn barreling only with equity or clean blockers',
  'Thin value river IP vs missed c-bet',
  'Reduce open-folding BTN vs 3BP from blinds',
  'Custom...'
];

const FOCUS_KPIS = [
  '≤ 1 marginal calls',
  '≤ 2 marginal calls',
  '≥ 3 collected screenshots of target spot',
  '≥ 5 collected screenshots of target spot',
  'Adherence ≥ 80% to pre-written plan',
  'Adherence ≥ 90% to pre-written plan'
];

const ANCHOR_PHRASES = [
  'Plan over emotion',
  'Slow on turn/river',
  '2-street planning before act',
  'Equity before ego',
  'Think, then click'
];

const TILT_TRIGGERS = [
  'Heat in face',
  'Revenge desire',
  'Rushing clicks',
  'Body tension',
  'Shallow breathing',
  'Anger at opponent'
];

const RESET_SCRIPTS = [
  'Stand up–90s breathing–water–return',
  'Close tables to 1–5 min pause–journal one line',
  'Hard stop (end block)',
  '3 deep breaths–shake hands–continue'
];

const OVERRIDE_REASONS = [
  'time-boxed test',
  'stake drop',
  'table select only',
  'short recreational session'
];

const PreSession: React.FC = () => {
  const navigate = useNavigate();
  const { submit, loading, error } = usePreSession();

  const [gameType, setGameType] = useState<'cash' | 'tournament'>('cash');
  const [stakes, setStakes] = useState('');
  const [tablesMax, setTablesMax] = useState(4);
  const [plannedMinutes, setPlannedMinutes] = useState(120);
  const [maxMinutes, setMaxMinutes] = useState<number | undefined>(undefined);
  const [blockPlayMin, setBlockPlayMin] = useState(50);
  const [blockBreakMin, setBlockBreakMin] = useState(10);
  const [customBlock, setCustomBlock] = useState(false);

  const [readinessSleep, setReadinessSleep] = useState(0);
  const [readinessEnergy, setReadinessEnergy] = useState(0);
  const [readinessClarity, setReadinessClarity] = useState(0);
  const [readinessEmotions, setReadinessEmotions] = useState(0);
  const [readinessPhysicalPrep, setReadinessPhysicalPrep] = useState({
    water: false,
    food: false,
    stretch: false,
  });
  const [caffeineIntake, setCaffeineIntake] = useState(0);
  const [skipReadinessCheck, setSkipReadinessCheck] = useState(false);

  const [stopLossBi, setStopLossBi] = useState(3);
  const [stopWinBi, setStopWinBi] = useState(0);

  const [focusTheme, setFocusTheme] = useState('');
  const [customFocusTheme, setCustomFocusTheme] = useState('');
  const [focusKpi, setFocusKpi] = useState('');
  const [collectScreenshots, setCollectScreenshots] = useState(false);

  const [selectedAnchors, setSelectedAnchors] = useState<string[]>([]);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [resetScript, setResetScript] = useState('');

  const [lastSessionQuality, setLastSessionQuality] = useState<'A' | 'B' | 'C' | ''>('');
  const [weeklyGoalOk, setWeeklyGoalOk] = useState(true);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [weeklyGoalText, setWeeklyGoalText] = useState('');

  const [showStopModal, setShowStopModal] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');

  const calculateScore = () => {
    if (skipReadinessCheck) return { score: null, zone: null };

    if (readinessSleep === 0 || readinessEnergy === 0 || readinessClarity === 0 || readinessEmotions === 0) {
      return { score: null, zone: null };
    }

    const physScore =
      (readinessPhysicalPrep.water ? 3.33 : 0) +
      (readinessPhysicalPrep.food ? 3.33 : 0) +
      (readinessPhysicalPrep.stretch ? 3.34 : 0);

    const caffeinePenaltyMap: { [key: number]: number } = { 0: 0, 1: 0, 2: -5, 3: -10 };
    const caffeinePenalty = caffeinePenaltyMap[caffeineIntake] || 0;

    const baseScore = Math.round(
      ((readinessSleep + readinessEnergy + readinessClarity + readinessEmotions + physScore) / 5) * 10
    );

    const score = Math.max(0, Math.min(100, baseScore + caffeinePenalty));

    let zone: 'GO' | 'CAUTION' | 'STOP';
    if (score >= 70) zone = 'GO';
    else if (score >= 50) zone = 'CAUTION';
    else zone = 'STOP';

    return { score, zone, physScore, caffeinePenalty };
  };

  const { score, zone, physScore, caffeinePenalty } = calculateScore();

  const isFormValid = () => {
    if (!stakes) return false;
    if (!focusTheme || (focusTheme === 'Custom...' && !customFocusTheme)) return false;
    if (!focusKpi) return false;
    if (!resetScript) return false;
    if (!skipReadinessCheck && (readinessSleep === 0 || readinessEnergy === 0 || readinessClarity === 0 || readinessEmotions === 0)) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert('Please fill in all required fields');
      return;
    }

    if (zone === 'STOP' && !showStopModal) {
      setShowStopModal(true);
      return;
    }

    try {
      const protocolData: PreSessionProtocol = {
        game_type: gameType,
        stakes_or_buyin: stakes,
        tables_max: tablesMax,
        planned_duration: `${plannedMinutes} min`,
        max_minutes: maxMinutes,
        block_play_min: blockPlayMin,
        block_break_min: blockBreakMin,

        sleep_quality_score: readinessSleep,
        energy_level_readiness: readinessEnergy,
        mental_clarity: readinessClarity,
        emotional_stability: readinessEmotions,
        physical_prep_water: readinessPhysicalPrep.water,
        physical_prep_food: readinessPhysicalPrep.food,
        physical_prep_stretch: readinessPhysicalPrep.stretch,
        caffeine_intake: caffeineIntake,
        caffeine_penalty: caffeinePenalty || 0,
        phys_score: physScore || 0,
        a_game_score: score,
        readiness_zone: zone,
        skip_readiness_check: skipReadinessCheck,

        stop_loss_bi: stopLossBi,
        stop_win_bi: stopWinBi,

        focus_theme: focusTheme === 'Custom...' ? customFocusTheme : focusTheme,
        focus_kpi: focusKpi,
        collect_screenshots: collectScreenshots,

        anchor_phrases: selectedAnchors,
        tilt_triggers: selectedTriggers,
        reset_script: resetScript,

        last_session_quality: lastSessionQuality || undefined,
        weekly_goal_ok: weeklyGoalOk,
        weekly_goal_text: weeklyGoalText || undefined,

        override_stop: zone === 'STOP',
        override_reason: zone === 'STOP' ? overrideReason : undefined
      };

      await submit(protocolData);
      navigate('/');
    } catch (err) {
      console.error('Failed to submit pre-session protocol:', err);
    }
  };

  const handleAnchorToggle = (phrase: string) => {
    setSelectedAnchors(prev => {
      if (prev.includes(phrase)) return prev.filter(p => p !== phrase);
      if (prev.length >= 2) return prev;
      return [...prev, phrase];
    });
  };

  const handleTriggerToggle = (trigger: string) => {
    setSelectedTriggers(prev => {
      if (prev.includes(trigger)) return prev.filter(t => t !== trigger);
      if (prev.length >= 2) return prev;
      return [...prev, trigger];
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error.message}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Pre-Session Protocol</h2>
          <p className="text-gray-600 mt-1">Set your readiness, guardrails, and focus in 30–60 seconds</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Session Basics */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
              <Target className="mr-2 text-blue-600" size={20} />
              Session Basics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Game Type</label>
                <div className="flex gap-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="cash"
                      checked={gameType === 'cash'}
                      onChange={(e) => setGameType(e.target.value as 'cash')}
                      className="mr-2"
                    />
                    <span>Cash</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="tournament"
                      checked={gameType === 'tournament'}
                      onChange={(e) => setGameType(e.target.value as 'tournament')}
                      className="mr-2"
                    />
                    <span>Tournament</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stakes/Buy-in <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={stakes}
                  onChange={(e) => setStakes(e.target.value)}
                  placeholder="e.g., NL50 / $0.25-0.50"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Tables</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={tablesMax}
                  onChange={(e) => setTablesMax(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Planned Duration (min)</label>
                <input
                  type="number"
                  min="15"
                  max="600"
                  value={plannedMinutes}
                  onChange={(e) => setPlannedMinutes(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Duration (min, optional)</label>
                <input
                  type="number"
                  min="15"
                  max="600"
                  value={maxMinutes || ''}
                  onChange={(e) => setMaxMinutes(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Hard stop limit"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
                {maxMinutes && maxMinutes < plannedMinutes && (
                  <p className="text-xs text-orange-600 mt-1">Max overrides planned duration</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Block/Break</label>
                {!customBlock ? (
                  <select
                    value={`${blockPlayMin}/${blockBreakMin}`}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setCustomBlock(true);
                      } else {
                        const [play, breakTime] = e.target.value.split('/').map(Number);
                        setBlockPlayMin(play);
                        setBlockBreakMin(breakTime);
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="50/10">50/10 (default)</option>
                    <option value="75/15">75/15</option>
                    <option value="custom">Custom...</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="25"
                      value={blockPlayMin}
                      onChange={(e) => setBlockPlayMin(Number(e.target.value))}
                      placeholder="Play"
                      className="w-1/2 p-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="number"
                      min="5"
                      value={blockBreakMin}
                      onChange={(e) => setBlockBreakMin(Number(e.target.value))}
                      placeholder="Break"
                      className="w-1/2 p-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* A-Game Readiness */}
          <AGameReadinessCheck
            sleepQuality={readinessSleep}
            energyLevel={readinessEnergy}
            mentalClarity={readinessClarity}
            emotionalStability={readinessEmotions}
            physicalPrep={readinessPhysicalPrep}
            caffeineIntake={caffeineIntake}
            skipCheck={skipReadinessCheck}
            onSleepQualityChange={setReadinessSleep}
            onEnergyLevelChange={setReadinessEnergy}
            onMentalClarityChange={setReadinessClarity}
            onEmotionalStabilityChange={setReadinessEmotions}
            onPhysicalPrepChange={setReadinessPhysicalPrep}
            onCaffeineIntakeChange={setCaffeineIntake}
            onSkipCheckChange={setSkipReadinessCheck}
          />

          {/* Guardrails */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
              <Shield className="mr-2 text-red-600" size={20} />
              Guardrails
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stop-Loss (buy-ins) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={stopLossBi}
                  onChange={(e) => setStopLossBi(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
                {stopLossBi === 0 && (
                  <p className="text-xs text-orange-600 mt-1">Recommended: ≥2 buy-ins</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stop-Win (buy-ins, 0 = off)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={stopWinBi}
                  onChange={(e) => setStopWinBi(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>

          {/* Focus Experiment */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
              <Activity className="mr-2 text-green-600" size={20} />
              Focus Experiment (One Per Session)
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme <span className="text-red-500">*</span>
                </label>
                <select
                  value={focusTheme}
                  onChange={(e) => setFocusTheme(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Select focus theme...</option>
                  {FOCUS_THEMES.map(theme => (
                    <option key={theme} value={theme}>{theme}</option>
                  ))}
                </select>
              </div>

              {focusTheme === 'Custom...' && (
                <div>
                  <input
                    type="text"
                    value={customFocusTheme}
                    onChange={(e) => setCustomFocusTheme(e.target.value)}
                    placeholder="Describe your focus (max 80 chars)"
                    maxLength={80}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KPI <span className="text-red-500">*</span>
                </label>
                <select
                  value={focusKpi}
                  onChange={(e) => setFocusKpi(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Select KPI...</option>
                  {FOCUS_KPIS.map(kpi => (
                    <option key={kpi} value={kpi}>{kpi}</option>
                  ))}
                </select>
              </div>

              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={collectScreenshots}
                  onChange={(e) => setCollectScreenshots(e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Collect screenshots during session</span>
              </label>
            </div>
          </div>

          {/* A-Game Activation */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">A-Game Activation</h3>
            <p className="text-sm text-gray-600 mb-3">Select up to 2 anchor phrases</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {ANCHOR_PHRASES.map(phrase => (
                <label
                  key={phrase}
                  className={`flex items-center p-2 border rounded-md cursor-pointer transition-colors ${
                    selectedAnchors.includes(phrase)
                      ? 'bg-blue-100 border-blue-300'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAnchors.includes(phrase)}
                    onChange={() => handleAnchorToggle(phrase)}
                    disabled={!selectedAnchors.includes(phrase) && selectedAnchors.length >= 2}
                    className="mr-2 h-4 w-4"
                  />
                  <span className="text-sm">{phrase}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tilt Management */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Tilt Management</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Early warning triggers (select up to 2)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {TILT_TRIGGERS.map(trigger => (
                    <label
                      key={trigger}
                      className={`flex items-center p-2 border rounded-md cursor-pointer transition-colors ${
                        selectedTriggers.includes(trigger)
                          ? 'bg-orange-100 border-orange-300'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTriggers.includes(trigger)}
                        onChange={() => handleTriggerToggle(trigger)}
                        disabled={!selectedTriggers.includes(trigger) && selectedTriggers.length >= 2}
                        className="mr-2 h-4 w-4"
                      />
                      <span className="text-sm">{trigger}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reset Script <span className="text-red-500">*</span>
                </label>
                <select
                  value={resetScript}
                  onChange={(e) => setResetScript(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Select reset procedure...</option>
                  {RESET_SCRIPTS.map(script => (
                    <option key={script} value={script}>{script}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Feedback */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Previous Session</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Session Quality</label>
                <div className="flex gap-2">
                  {(['A', 'B', 'C'] as const).map(grade => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => setLastSessionQuality(grade)}
                      className={`flex-1 py-2 px-4 rounded-md font-semibold transition-colors ${
                        lastSessionQuality === grade
                          ? grade === 'A'
                            ? 'bg-green-600 text-white'
                            : grade === 'B'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-red-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={weeklyGoalOk}
                    onChange={(e) => setWeeklyGoalOk(e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Weekly goal OK</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowGoalModal(true)}
                  className="ml-3 text-sm text-blue-600 hover:text-blue-700"
                >
                  Edit weekly goal
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-between items-center pt-4">
            <Link
              to="/"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className={`px-6 py-2 rounded-md text-sm font-medium text-white transition-colors ${
                loading || !isFormValid()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : zone === 'STOP'
                  ? 'bg-red-600 hover:bg-red-700'
                  : zone === 'CAUTION'
                  ? 'bg-yellow-600 hover:bg-yellow-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? 'Saving...' : 'Start Session'}
            </button>
          </div>
        </form>
      </div>

      {/* Weekly Goal Modal */}
      {showGoalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={() => setShowGoalModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Update Weekly Goal</h3>
            <textarea
              value={weeklyGoalText}
              onChange={(e) => setWeeklyGoalText(e.target.value)}
              placeholder="What's your focus for this week?"
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowGoalModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowGoalModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STOP Zone Modal */}
      {showStopModal && zone === 'STOP' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={() => setShowStopModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full border-4 border-red-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start mb-4">
              <AlertCircle className="text-red-600 mr-3 flex-shrink-0" size={32} />
              <div>
                <h3 className="text-xl font-bold text-red-600 mb-2">STOP Zone Warning</h3>
                <p className="text-gray-700">
                  Your A-Game Readiness Score is <strong className="text-red-600">{score}</strong>.
                  Playing in this state significantly increases risk of poor decisions and tilt.
                </p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800">
                <strong>Recommendation:</strong> Do not play. Consider theory study, hand reviews, or rest instead.
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">If you still want to proceed, select a reason:</p>
              <select
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">Select reason...</option>
                {OVERRIDE_REASONS.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowStopModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!overrideReason}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                  !overrideReason
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Override & Start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreSession;
