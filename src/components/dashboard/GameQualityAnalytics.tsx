import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Target, ArrowUpRight, Info, Sparkles, ArrowRight } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface GameQualityData {
  aGame: number;
  bGame: number;
  cGame: number;
  dGame: number;
}

interface WinrateData {
  aGame: string;
  bGame: string;
  cGame: string;
  dGame: string;
}

const GameQualityAnalytics: React.FC = () => {
  const [gameQuality, setGameQuality] = useState<GameQualityData>({
    aGame: 25,
    bGame: 45,
    cGame: 20,
    dGame: 10,
  });

  const [manualFrequencies, setManualFrequencies] = useState<GameQualityData>({
    aGame: 25,
    bGame: 45,
    cGame: 20,
    dGame: 10,
  });

  const [useManualFrequencies, setUseManualFrequencies] = useState(false);
  const [frequencyError, setFrequencyError] = useState<string | null>(null);
  const [maxValues, setMaxValues] = useState<Partial<GameQualityData>>({});

  const [winrates, setWinrates] = useState<WinrateData>({
    aGame: '8',
    bGame: '3',
    cGame: '-1',
    dGame: '-6',
  });

  const [monthlyHands, setMonthlyHands] = useState<string>('30000');
  const [bigBlind, setBigBlind] = useState<string>('2');

  const [targetAGame, setTargetAGame] = useState<string>('40');
  const [targetWinrate, setTargetWinrate] = useState<string>('6');
  const [targetIncome, setTargetIncome] = useState<string>('3000');

  const handleFrequencyChange = (game: keyof GameQualityData, value: string) => {
    const numValue = Math.max(0, Math.min(100, parseFloat(value) || 0));
    
    if (isNaN(numValue)) {
      return;
    }

    const newFrequencies = { ...manualFrequencies };

    if (game === 'aGame') {
      newFrequencies.bGame = 0;
      newFrequencies.cGame = 0;
      newFrequencies.dGame = 0;
      setMaxValues({
        bGame: 100 - numValue,
        cGame: 100 - numValue,
        dGame: 100 - numValue
      });
    } else if (game === 'bGame') {
      newFrequencies.cGame = 0;
      newFrequencies.dGame = 0;
      setMaxValues({
        cGame: 100 - (newFrequencies.aGame + numValue),
        dGame: 100 - (newFrequencies.aGame + numValue)
      });
    } else if (game === 'cGame') {
      const remainingForD = 100 - (newFrequencies.aGame + newFrequencies.bGame + numValue);
      if (remainingForD < 0) {
        setFrequencyError(`Maximum value for C-Game is ${100 - (newFrequencies.aGame + newFrequencies.bGame)}%`);
        return;
      }
      newFrequencies.dGame = remainingForD;
    }

    newFrequencies[game] = numValue;

    const total = Object.values(newFrequencies).reduce((sum, val) => sum + val, 0);
    if (total > 100) {
      setFrequencyError('Total cannot exceed 100%');
      return;
    }

    setFrequencyError(null);
    setManualFrequencies(newFrequencies);
  };

  const toggleManualFrequencies = (enabled: boolean) => {
    if (enabled) {
      setManualFrequencies({
        aGame: 0,
        bGame: 0,
        cGame: 0,
        dGame: 0
      });
      setMaxValues({
        aGame: 100,
        bGame: 100,
        cGame: 100,
        dGame: 100
      });
    } else {
      resetToAutoFrequencies();
    }
    setUseManualFrequencies(enabled);
    setFrequencyError(null);
  };

  const resetToAutoFrequencies = () => {
    setManualFrequencies(gameQuality);
    setUseManualFrequencies(false);
    setFrequencyError(null);
    setMaxValues({});
  };

  const calculateWeightedWinrate = () => {
    const frequencies = useManualFrequencies ? manualFrequencies : gameQuality;
    const weightedA = (frequencies.aGame / 100) * parseFloat(winrates.aGame);
    const weightedB = (frequencies.bGame / 100) * parseFloat(winrates.bGame);
    const weightedC = (frequencies.cGame / 100) * parseFloat(winrates.cGame);
    const weightedD = (frequencies.dGame / 100) * parseFloat(winrates.dGame);
    return weightedA + weightedB + weightedC + weightedD;
  };

  const [overallWinrate, setOverallWinrate] = useState<number>(0);

  useEffect(() => {
    setOverallWinrate(calculateWeightedWinrate());
  }, [gameQuality, winrates, manualFrequencies, useManualFrequencies]);

  const chartData = {
    labels: ['A-Game', 'B-Game', 'C-Game', 'D-Game'],
    datasets: [
      {
        data: useManualFrequencies 
          ? [manualFrequencies.aGame, manualFrequencies.bGame, manualFrequencies.cGame, manualFrequencies.dGame]
          : [gameQuality.aGame, gameQuality.bGame, gameQuality.cGame, gameQuality.dGame],
        backgroundColor: [
          'rgba(46, 204, 113, 0.8)',
          'rgba(52, 152, 219, 0.8)',
          'rgba(241, 196, 15, 0.8)',
          'rgba(231, 76, 60, 0.8)',
        ],
        borderColor: [
          'rgba(46, 204, 113, 1)',
          'rgba(52, 152, 219, 1)',
          'rgba(241, 196, 15, 1)',
          'rgba(231, 76, 60, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          padding: 20,
          font: {
            size: 14,
            weight: '500' as const,
          },
          generateLabels: (chart: any) => {
            const data = chart.data;
            const totalHands = 1113;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const handCount = Math.round((data.datasets[0].data[i] / 100) * totalHands);
                return {
                  text: `${label}: ${handCount} hands (${data.datasets[0].data[i].toFixed(1)}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  lineWidth: 2,
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.formattedValue || '';
            const descriptions: { [key: string]: string } = {
              'A-Game': 'Focused, confident, optimal decision-making',
              'B-Game': 'Solid play, minor mistakes',
              'C-Game': 'Distracted, making errors',
              'D-Game': 'Tilted, significant leaks',
            };
            return [`${label}: ${value}%`, `${descriptions[label]}`];
          },
        },
      },
    },
  };

  const calculateMonthlyProfit = (wr: number, hands: number, bb: number) => {
    return (wr / 100) * hands * bb;
  };

  const baseMonthlyProfit = calculateMonthlyProfit(
    overallWinrate,
    parseFloat(monthlyHands),
    parseFloat(bigBlind)
  );

  const calculateImprovedGameQuality = () => {
    const frequencies = useManualFrequencies ? manualFrequencies : gameQuality;
    const doubledAGame = frequencies.aGame * 2;
    const excess = doubledAGame - frequencies.aGame;
    
    const remainingStates = 3;
    const reductionPerState = excess / remainingStates;
    
    const newBGame = Math.max(0, frequencies.bGame - reductionPerState);
    const newCGame = Math.max(0, frequencies.cGame - reductionPerState);
    const newDGame = Math.max(0, frequencies.dGame - reductionPerState);
    
    const totalReduction = frequencies.bGame + frequencies.cGame + frequencies.dGame - (newBGame + newCGame + newDGame);
    const remainingTotal = newBGame + newCGame + newDGame;
    
    const normalizer = (100 - doubledAGame) / remainingTotal;
    
    return {
      aGame: doubledAGame,
      bGame: newBGame * normalizer,
      cGame: newCGame * normalizer,
      dGame: newDGame * normalizer,
    };
  };

  const improvedGameQuality = calculateImprovedGameQuality();

  const improvedWinrate = (
    (improvedGameQuality.aGame / 100) * parseFloat(winrates.aGame) +
    (improvedGameQuality.bGame / 100) * parseFloat(winrates.bGame) +
    (improvedGameQuality.cGame / 100) * parseFloat(winrates.cGame) +
    (improvedGameQuality.dGame / 100) * parseFloat(winrates.dGame)
  );

  const improvedMonthlyProfit = calculateMonthlyProfit(
    improvedWinrate,
    parseFloat(monthlyHands),
    parseFloat(bigBlind)
  );

  const profitIncrease = ((improvedMonthlyProfit - baseMonthlyProfit) / baseMonthlyProfit) * 100;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center">
            <Brain className="mr-2 text-blue-600" size={20} />
            Game Quality & Projections
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Winrate by Mental State</h3>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Info size={14} className="mr-2 text-blue-600 flex-shrink-0" />
                <span>Estimate your winrate (bb/100) for each mindset based on how you typically perform.</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">A-Game (bb/100)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={winrates.aGame}
                      onChange={(e) => setWinrates({ ...winrates, aGame: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <div className="relative w-24">
                      <input
                        type="number"
                        value={manualFrequencies.aGame || ''}
                        onChange={(e) => handleFrequencyChange('aGame', e.target.value)}
                        disabled={!useManualFrequencies}
                        max={maxValues.aGame}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="%"
                      />
                      {useManualFrequencies && maxValues.aGame !== undefined && (
                        <div className="absolute -bottom-5 left-0 text-xs text-gray-500">
                          Max: {maxValues.aGame}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">B-Game (bb/100)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={winrates.bGame}
                      onChange={(e) => setWinrates({ ...winrates, bGame: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <div className="relative w-24">
                      <input
                        type="number"
                        value={manualFrequencies.bGame || ''}
                        onChange={(e) => handleFrequencyChange('bGame', e.target.value)}
                        disabled={!useManualFrequencies || manualFrequencies.aGame === 0}
                        max={maxValues.bGame}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="%"
                      />
                      {useManualFrequencies && maxValues.bGame !== undefined && (
                        <div className="absolute -bottom-5 left-0 text-xs text-gray-500">
                          Max: {maxValues.bGame}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">C-Game (bb/100)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={winrates.cGame}
                      onChange={(e) => setWinrates({ ...winrates, cGame: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <div className="relative w-24">
                      <input
                        type="number"
                        value={manualFrequencies.cGame || ''}
                        onChange={(e) => handleFrequencyChange('cGame', e.target.value)}
                        disabled={!useManualFrequencies || manualFrequencies.bGame === 0}
                        max={maxValues.cGame}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="%"
                      />
                      {useManualFrequencies && maxValues.cGame !== undefined && (
                        <div className="absolute -bottom-5 left-0 text-xs text-gray-500">
                          Max: {maxValues.cGame}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">D-Game (bb/100)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={winrates.dGame}
                      onChange={(e) => setWinrates({ ...winrates, dGame: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="number"
                      value={manualFrequencies.dGame || ''}
                      disabled={true}
                      className="w-24 p-2 border border-gray-300 rounded-md bg-gray-50"
                      placeholder="Auto %"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={useManualFrequencies}
                    onChange={(e) => toggleManualFrequencies(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Manually set frequencies</span>
                </label>
                {useManualFrequencies && (
                  <button
                    onClick={resetToAutoFrequencies}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Reset to Auto
                  </button>
                )}
              </div>

              {frequencyError && (
                <div className="mt-2 text-sm text-red-600">
                  {frequencyError}
                </div>
              )}

              <div className="mt-2 text-sm text-gray-500 flex items-center">
                <Info size={14} className="mr-1" />
                Total: {Object.values(manualFrequencies).reduce((sum, val) => sum + val, 0).toFixed(1)}%
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Game Quality Distribution</h3>
              <div className="relative" style={{ height: '300px' }}>
                <Doughnut data={chartData} options={chartOptions} />
              </div>
              <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                <p className="text-base font-medium text-gray-800 flex items-center">
                  <Brain size={16} className="mr-2 text-green-600" />
                  Your current A-Game frequency is <span className="mx-1 text-green-600 font-semibold">
                    {useManualFrequencies ? manualFrequencies.aGame.toFixed(1) : gameQuality.aGame}%
                  </span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  This reflects how often you play at your highest level of focus and decision-making.
                </p>
                <button className="mt-3 px-4 py-2 text-sm font-medium text-green-700 hover:text-green-800 bg-green-100 hover:bg-green-200 rounded-md transition-colors flex items-center">
                  <Target size={16} className="mr-1" />
                  Set A-Game Goal
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                <TrendingUp size={16} className="mr-2 text-blue-600" />
                Monthly Projection
              </h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700 mb-1">Overall Weighted Winrate</p>
                  <p className="text-2xl font-semibold text-blue-900">{overallWinrate.toFixed(2)} bb/100</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Monthly Hands</label>
                    <input
                      type="number"
                      value={monthlyHands}
                      onChange={(e) => setMonthlyHands(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Big Blind ($)</label>
                    <input
                      type="number"
                      value={bigBlind}
                      onChange={(e) => setBigBlind(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg shadow-sm">
                  <p className="text-blue-900 text-2xl font-semibold mb-1">
                    ${baseMonthlyProfit.toFixed(2)}
                  </p>
                  <p className="text-blue-700 text-sm">Expected Monthly Profit</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-green-800 font-medium flex items-center">
                        With Doubled A-Game:
                        <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          Rebalanced proportionally
                        </span>
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        A: {improvedGameQuality.aGame.toFixed(1)}% | 
                        B: {improvedGameQuality.bGame.toFixed(1)}% | 
                        C: {improvedGameQuality.cGame.toFixed(1)}% | 
                        D: {improvedGameQuality.dGame.toFixed(1)}%
                      </p>
                    </div>
                    <div className="flex items-center text-green-700">
                      <ArrowUpRight size={16} className="mr-1" />
                      <span>+{profitIncrease.toFixed(1)}%</span>
                    </div>
                  </div>
                  <p className="text-green-900 text-2xl font-semibold">
                    ${improvedMonthlyProfit.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-green-50 rounded-lg shadow-sm p-6 border border-blue-100">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-blue-900">
                  Your current distribution is completely normal
                </h3>
                <p className="mt-2 text-blue-800">
                  Most players spend the majority of their time in B and C-Game — and that's okay.
                  What matters most is that you're aware of it now.
                </p>
              </div>

              <div className="bg-white bg-opacity-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
                  <p className="text-blue-900 font-medium">
                    Right now, your A-Game is at {useManualFrequencies ? manualFrequencies.aGame.toFixed(1) : gameQuality.aGame}% — imagine what happens at 40%
                  </p>
                </div>
                <p className="mt-2 text-blue-800">
                  With a few adjustments in mindset, routine, and strategy, even 5–10% more A-Game can lead to massive gains, both emotionally and financially.
                </p>
              </div>

              <p className="text-blue-800">
                This tool helps you track, train, and transform your mental game — one session at a time.
              </p>

              <div className="mt-6 border-t border-blue-200 pt-4">
                <p className="text-sm text-blue-800">
                  Thousands of players are already using mental game tools to improve performance and consistency.
                  If you're ready to make real progress, let's take the next step together.
                </p>
                <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameQualityAnalytics;