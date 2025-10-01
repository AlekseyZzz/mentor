import React, { useEffect, useState } from 'react';
import { Activity, AlertCircle, CheckCircle2, Coffee, Droplet, Flame, TrendingUp, X } from 'lucide-react';

interface AGameReadinessCheckProps {
  sleepQuality: number;
  energyLevel: number;
  mentalClarity: number;
  emotionalStability: number;
  physicalPrep: {
    water: boolean;
    food: boolean;
    stretch: boolean;
    caffeine: boolean;
  };
  skipCheck: boolean;
  onSleepQualityChange: (value: number) => void;
  onEnergyLevelChange: (value: number) => void;
  onMentalClarityChange: (value: number) => void;
  onEmotionalStabilityChange: (value: number) => void;
  onPhysicalPrepChange: (prep: { water: boolean; food: boolean; stretch: boolean; caffeine: boolean }) => void;
  onSkipCheckChange: (skip: boolean) => void;
}

const AGameReadinessCheck: React.FC<AGameReadinessCheckProps> = ({
  sleepQuality,
  energyLevel,
  mentalClarity,
  emotionalStability,
  physicalPrep,
  skipCheck,
  onSleepQualityChange,
  onEnergyLevelChange,
  onMentalClarityChange,
  onEmotionalStabilityChange,
  onPhysicalPrepChange,
  onSkipCheckChange,
}) => {
  const [score, setScore] = useState<number | null>(null);
  const [zone, setZone] = useState<'GO' | 'CAUTION' | 'STOP' | null>(null);

  useEffect(() => {
    if (skipCheck) {
      setScore(null);
      setZone(null);
      return;
    }

    const physicalPrepScore =
      (physicalPrep.water ? 2.5 : 0) +
      (physicalPrep.food ? 2.5 : 0) +
      (physicalPrep.stretch ? 2.5 : 0) +
      (physicalPrep.caffeine ? 2.5 : 0);

    const allFieldsFilled =
      sleepQuality > 0 &&
      energyLevel > 0 &&
      mentalClarity > 0 &&
      emotionalStability > 0;

    if (!allFieldsFilled) {
      setScore(null);
      setZone(null);
      return;
    }

    const calculatedScore = Math.round(
      ((sleepQuality + energyLevel + mentalClarity + emotionalStability + physicalPrepScore) / 5) * 10
    );

    setScore(calculatedScore);

    if (calculatedScore >= 70) {
      setZone('GO');
    } else if (calculatedScore >= 50) {
      setZone('CAUTION');
    } else {
      setZone('STOP');
    }
  }, [sleepQuality, energyLevel, mentalClarity, emotionalStability, physicalPrep, skipCheck]);

  const getZoneColor = () => {
    if (!zone) return 'bg-gray-100 text-gray-600';
    if (zone === 'GO') return 'bg-green-100 text-green-700 border-green-300';
    if (zone === 'CAUTION') return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-red-100 text-red-700 border-red-300';
  };

  const getZoneIcon = () => {
    if (!zone) return <AlertCircle size={24} />;
    if (zone === 'GO') return <CheckCircle2 size={24} className="text-green-600" />;
    if (zone === 'CAUTION') return <AlertCircle size={24} className="text-yellow-600" />;
    return <X size={24} className="text-red-600" />;
  };

  const getRecommendation = () => {
    if (!zone) return 'Fill all fields to see your readiness score';
    if (zone === 'GO') return 'You\'re ready! Play your full plan, feel free to take complex decisions and experiment.';
    if (zone === 'CAUTION') return 'Proceed with caution. Consider a shorter session (1-2 hours), avoid shots, focus on discipline.';
    return 'Not ready. Consider skipping play today and focusing on theory or hand reviews instead.';
  };

  const getProgressColor = () => {
    if (!score) return 'stroke-gray-300';
    if (score >= 70) return 'stroke-green-500';
    if (score >= 50) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };

  const calculateProgress = () => {
    if (!score) return 0;
    return (score / 100) * 283;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center text-blue-900">
          <Activity className="mr-2 text-blue-600" size={22} />
          A-Game Readiness Check
        </h3>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={skipCheck}
            onChange={(e) => onSkipCheckChange(e.target.checked)}
            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-600">Skip today</span>
        </label>
      </div>

      {!skipCheck && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sleep Quality (0 = no sleep, 10 = excellent)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={sleepQuality}
                    onChange={(e) => onSleepQualityChange(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-lg font-semibold text-blue-900 w-8 text-center">{sleepQuality}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Energy Level (0 = exhausted, 10 = max energy)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={energyLevel}
                    onChange={(e) => onEnergyLevelChange(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-lg font-semibold text-blue-900 w-8 text-center">{energyLevel}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mental Clarity (0 = scattered, 10 = laser focus)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={mentalClarity}
                    onChange={(e) => onMentalClarityChange(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-lg font-semibold text-blue-900 w-8 text-center">{mentalClarity}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emotional Stability (0 = stressed/irritated, 10 = calm/confident)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={emotionalStability}
                    onChange={(e) => onEmotionalStabilityChange(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-lg font-semibold text-blue-900 w-8 text-center">{emotionalStability}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Physical Preparation
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={physicalPrep.water}
                      onChange={(e) => onPhysicalPrepChange({ ...physicalPrep, water: e.target.checked })}
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded mr-3"
                    />
                    <Droplet className="mr-2 text-blue-500" size={18} />
                    <span className="text-sm font-medium">Water</span>
                  </label>

                  <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={physicalPrep.food}
                      onChange={(e) => onPhysicalPrepChange({ ...physicalPrep, food: e.target.checked })}
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded mr-3"
                    />
                    <Flame className="mr-2 text-orange-500" size={18} />
                    <span className="text-sm font-medium">Food</span>
                  </label>

                  <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={physicalPrep.stretch}
                      onChange={(e) => onPhysicalPrepChange({ ...physicalPrep, stretch: e.target.checked })}
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded mr-3"
                    />
                    <TrendingUp className="mr-2 text-green-500" size={18} />
                    <span className="text-sm font-medium">Stretch</span>
                  </label>

                  <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={physicalPrep.caffeine}
                      onChange={(e) => onPhysicalPrepChange({ ...physicalPrep, caffeine: e.target.checked })}
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded mr-3"
                    />
                    <Coffee className="mr-2 text-amber-600" size={18} />
                    <span className="text-sm font-medium">Caffeine OK</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 mb-4">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray="283"
                    strokeDashoffset={283 - calculateProgress()}
                    className={`${getProgressColor()} transition-all duration-500 ease-out`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-gray-800">
                    {score !== null ? score : '—'}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">/ 100</span>
                </div>
              </div>

              {zone && (
                <div className={`${getZoneColor()} px-6 py-3 rounded-lg border-2 flex items-center gap-2 mb-4`}>
                  {getZoneIcon()}
                  <span className="font-bold text-lg">{zone}</span>
                </div>
              )}
            </div>
          </div>

          <div className={`${getZoneColor()} p-4 rounded-lg border-2`}>
            <p className="text-sm font-medium">{getRecommendation()}</p>
          </div>
        </>
      )}

      {skipCheck && (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="mx-auto mb-2" size={32} />
          <p className="text-sm">Readiness check skipped for this session</p>
        </div>
      )}
    </div>
  );
};

export default AGameReadinessCheck;
