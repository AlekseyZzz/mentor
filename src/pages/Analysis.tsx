import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { getHandNotes, HandNote, HandNoteFilters } from '../lib/api/handNotes';
import { Link } from 'react-router-dom';

const Analysis: React.FC = () => {
  const [hands, setHands] = useState<HandNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<HandNoteFilters>({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadHands();
  }, [filters]);

  const loadHands = async () => {
    setLoading(true);
    try {
      const result = await getHandNotes(filters, 24, 0);
      setHands(result.items);
      setTotal(result.total);
    } catch (error) {
      console.error('Failed to load hands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters({ ...filters, query: searchQuery });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTagBadgeColor = (tag: string) => {
    if (['3BP', '4BP', '5BP'].includes(tag)) return 'bg-red-100 text-red-700';
    if (['Flop', 'Turn', 'River'].includes(tag)) return 'bg-blue-100 text-blue-700';
    if (['IP', 'OOP'].includes(tag)) return 'bg-green-100 text-green-700';
    if (['Value', 'Bluff'].includes(tag)) return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hand Analysis</h1>
          <p className="text-gray-600 mt-1">Review and learn from your analyzed hands</p>
        </div>
        <Link
          to="/analysis/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Hand</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search hands by history, thoughts, or adaptive rules..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>

        {filters.query && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-gray-600">Searching for:</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
              {filters.query}
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilters({});
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading hands...</div>
        </div>
      ) : hands.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-100 text-center">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hands analyzed yet</h3>
            <p className="text-gray-600 mb-6">
              Start building your hand library by analyzing hands from your sessions
            </p>
            <Link
              to="/analysis/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>Add Your First Hand</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-600 mb-4">
            Found {total} hand{total !== 1 ? 's' : ''}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hands.map((hand) => (
              <Link
                key={hand.id}
                to={`/analysis/${hand.id}`}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {hand.front.screenshot_urls.length > 0 && (
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={hand.front.screenshot_urls[0]}
                      alt="Hand screenshot"
                      className="w-full h-full object-cover"
                    />
                    {hand.meta.mark_for_review && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded">
                        Review
                      </div>
                    )}
                  </div>
                )}

                <div className="p-4">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {hand.front.tags.slice(0, 4).map((tag, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 text-xs font-medium rounded ${getTagBadgeColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                    {hand.front.tags.length > 4 && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-600">
                        +{hand.front.tags.length - 4}
                      </span>
                    )}
                  </div>

                  {hand.front.thoughts && (
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {hand.front.thoughts}
                    </p>
                  )}

                  {hand.back.adaptive_thought && (
                    <div className="text-xs text-gray-600 italic mb-3 line-clamp-2 border-l-2 border-blue-300 pl-2">
                      Rule: {hand.back.adaptive_thought}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <span>{formatDate(hand.created_at)}</span>
                    {hand.back.emotions.game_state && (
                      <span className={`px-2 py-0.5 rounded font-medium ${
                        hand.back.emotions.game_state === 'A'
                          ? 'bg-green-100 text-green-700'
                          : hand.back.emotions.game_state === 'B'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {hand.back.emotions.game_state}-Game
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Analysis;
