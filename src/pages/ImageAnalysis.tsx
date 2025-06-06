import React, { useState } from 'react';
import { Upload, Maximize, Eye, Tag, Brain, Check, Info } from 'lucide-react';

const ImageAnalysis: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);

  // Mock data for demonstration
  const demoAnalysis = {
    handType: "Tough river decision",
    boardCards: ["Ah", "Kd", "2s", "7c", "Jh"],
    holeCards: ["Ad", "Jd"],
    handStrength: "Two pair, Aces and Jacks",
    potSize: "$240",
    betSize: "$120",
    tags: ["River Decision", "Value Bet", "Two Pair"],
    insights: [
      "Opponent's line suggests strong made hand or bluff",
      "Your hand is medium-strong but vulnerable to several hands",
      "Consider sizing - current bet is 50% of pot"
    ],
    recommendations: [
      "Review your two-pair river strategy",
      "Analyze opponent's frequency in similar spots",
      "Consider alternative sizings"
    ]
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        analyzeImage();
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const analyzeImage = () => {
    setAnalyzing(true);
    // Simulate AI analysis time
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysis(demoAnalysis);
    }, 1500);
  };

  const mockImageUrl = "https://images.pexels.com/photos/1452/playing-cards-casino-poker.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Hand Image Analysis</h2>
        <p className="text-gray-600 mb-6">
          Upload screenshots from your poker sessions to analyze hands, receive insights, and add them to your review library.
        </p>

        {!selectedImage ? (
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload size={24} className="mx-auto text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="image-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Upload hand screenshot</span>
                  <input
                    id="image-upload"
                    name="image-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageUpload}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative border border-gray-200 rounded-lg overflow-hidden">
              <img 
                src={selectedImage || mockImageUrl} 
                alt="Poker hand screenshot" 
                className="w-full object-contain max-h-[400px]"
              />
              <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100">
                <Maximize size={16} />
              </button>
            </div>

            {analyzing && (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-700">Analyzing hand image...</span>
              </div>
            )}

            {analysis && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Eye size={16} className="mr-2 text-blue-600" />
                      Hand Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Board:</span>
                        <span className="text-sm font-medium">{analysis.boardCards.join(" ")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Your Hand:</span>
                        <span className="text-sm font-medium">{analysis.holeCards.join(" ")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Hand Strength:</span>
                        <span className="text-sm font-medium">{analysis.handStrength}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Pot Size:</span>
                        <span className="text-sm font-medium">{analysis.potSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Bet Size:</span>
                        <span className="text-sm font-medium">{analysis.betSize}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Tag size={16} className="mr-2 text-blue-600" />
                      Tags & Classification
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {analysis.tags.map((tag: string, index: number) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Hand Type: <span className="font-medium text-gray-800">{analysis.handType}</span></p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Brain size={16} className="mr-2 text-blue-600" />
                    AI Insights
                  </h3>
                  <ul className="space-y-1">
                    {analysis.insights.map((insight: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <Info size={14} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                    <Check size={16} className="mr-2" />
                    Recommended Study Areas
                  </h3>
                  <ul className="space-y-1">
                    {analysis.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-700 mt-1.5 mr-2"></span>
                        <span className="text-sm text-blue-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end space-x-3">
                  <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Save to Library
                  </button>
                  <button className="px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                    Add to Session Review
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Recent Analyzed Hands</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
            <div className="relative h-40 bg-gray-100">
              <img 
                src="https://images.pexels.com/photos/1452/playing-cards-casino-poker.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Poker hand" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Value Bet
                </span>
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-medium text-sm">Two Pair vs River Raise</h3>
              <p className="text-xs text-gray-500 mt-1">Analyzed March 30, 2025</p>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
            <div className="relative h-40 bg-gray-100">
              <img 
                src="https://images.pexels.com/photos/6863196/pexels-photo-6863196.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Poker hand" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Bluff
                </span>
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-medium text-sm">Semi-Bluff on Draw-Heavy Board</h3>
              <p className="text-xs text-gray-500 mt-1">Analyzed March 28, 2025</p>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
            <div className="relative h-40 bg-gray-100">
              <img 
                src="https://images.pexels.com/photos/7345435/pexels-photo-7345435.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Poker hand" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Critical Decision
                </span>
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-medium text-sm">Top Pair in 3-Bet Pot</h3>
              <p className="text-xs text-gray-500 mt-1">Analyzed March 26, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageAnalysis;