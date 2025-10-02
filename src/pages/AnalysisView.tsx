import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard as Edit2, Trash2, Copy, ExternalLink } from 'lucide-react';
import { getHandNoteById, deleteHandNote, duplicateHandNote, HandNote } from '../lib/api/handNotes';
import ImageModal, { ScreenshotNote } from '../components/common/ImageModal';
import { getScreenshotNotesByHandId } from '../lib/api/screenshotNotes';

const AnalysisView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hand, setHand] = useState<HandNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFront, setShowFront] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [screenshotNotes, setScreenshotNotes] = useState<Map<string, ScreenshotNote[]>>(new Map());

  useEffect(() => {
    if (id) {
      loadHand();
    }
  }, [id]);

  const loadHand = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const data = await getHandNoteById(id);
      setHand(data);

      const notes = await getScreenshotNotesByHandId(id);
      const notesMap = new Map<string, ScreenshotNote[]>();
      notes.forEach(note => {
        const existing = notesMap.get(note.screenshot_url) || [];
        existing.push({
          id: note.id,
          content: note.note,
          position: note.panel_x !== null && note.panel_y !== null
            ? { x: note.panel_x, y: note.panel_y }
            : undefined,
          size: note.panel_width !== null && note.panel_height !== null
            ? { width: note.panel_width, height: note.panel_height }
            : undefined
        });
        notesMap.set(note.screenshot_url, existing);
      });
      setScreenshotNotes(notesMap);
    } catch (error) {
      console.error('Failed to load hand:', error);
      navigate('/analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this hand analysis?')) return;

    setDeleting(true);
    try {
      await deleteHandNote(id);
      navigate('/analysis');
    } catch (error) {
      console.error('Failed to delete hand:', error);
      alert('Failed to delete hand');
    } finally {
      setDeleting(false);
    }
  };

  const handleDuplicate = async () => {
    if (!id) return;

    try {
      const newHand = await duplicateHandNote(id);
      navigate(`/analysis/${newHand.id}`);
    } catch (error) {
      console.error('Failed to duplicate hand:', error);
      alert('Failed to duplicate hand');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTagBadgeColor = (tag: string) => {
    if (['3BP', '4BP', '5BP'].includes(tag)) return 'bg-red-100 text-red-700';
    if (['Flop', 'Turn', 'River'].includes(tag)) return 'bg-blue-100 text-blue-700';
    if (['IP', 'OOP'].includes(tag)) return 'bg-green-100 text-green-700';
    if (['Value', 'Bluff'].includes(tag)) return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading hand...</div>
        </div>
      </div>
    );
  }

  if (!hand) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/analysis')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          <span>Back to Analysis</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDuplicate}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            title="Duplicate hand"
          >
            <Copy size={18} />
          </button>
          <Link
            to={`/analysis/${id}/edit`}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            title="Edit hand"
          >
            <Edit2 size={18} />
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            title="Delete hand"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setShowFront(true)}
            className={`flex-1 py-4 px-6 font-medium transition-colors ${
              showFront
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Front (Scenario)
          </button>
          <button
            onClick={() => setShowFront(false)}
            className={`flex-1 py-4 px-6 font-medium transition-colors ${
              !showFront
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Back (Analysis)
          </button>
        </div>

        <div className="p-6">
          {showFront ? (
            <div className="space-y-6">
              {hand.front.screenshot_urls.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Screenshots</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hand.front.screenshot_urls.map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setAllImages(hand.front.screenshot_urls);
                          setSelectedImageIndex(idx);
                          setSelectedImage(url);
                        }}
                        className="block rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
                      >
                        <img
                          src={url}
                          alt={`Screenshot ${idx + 1}`}
                          className="w-full h-64 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {hand.front.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {hand.front.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 text-sm font-medium rounded ${getTagBadgeColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {hand.front.hand_history && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Hand History</h3>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(hand.front.hand_history);
                      alert('Hand history copied to clipboard!');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                  >
                    <Copy size={16} />
                    Copy Hand History
                  </button>
                </div>
              )}

              {hand.front.thoughts && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Thoughts</h3>
                  <p className="text-gray-700 leading-relaxed">{hand.front.thoughts}</p>
                </div>
              )}

              {hand.front.arguments_for.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Arguments FOR</h3>
                  <ul className="space-y-2">
                    {hand.front.arguments_for.map((arg, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-600 font-semibold mt-0.5">✓</span>
                        <span className="text-gray-700">{arg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {hand.back.adaptive_thought && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">Adaptive Thought / Rule</h3>
                  <p className="text-blue-800 font-medium">{hand.back.adaptive_thought}</p>
                </div>
              )}

              {hand.back.wizard_link && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">GTO Wizard Analysis</h3>
                  <a
                    href={hand.back.wizard_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <span>View in GTO Wizard</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}

              {hand.back.wizard_screenshots.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Wizard Screenshots</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hand.back.wizard_screenshots.map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setAllImages(hand.back.wizard_screenshots);
                          setSelectedImageIndex(idx);
                          setSelectedImage(url);
                        }}
                        className="block rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
                      >
                        <img
                          src={url}
                          alt={`Wizard ${idx + 1}`}
                          className="w-full h-64 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {hand.back.correct_solution && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Correct Solution</h3>
                  <p className="text-gray-700 leading-relaxed">{hand.back.correct_solution}</p>
                </div>
              )}

              {hand.back.arguments_against.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Arguments AGAINST</h3>
                  <ul className="space-y-2">
                    {hand.back.arguments_against.map((arg, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-600 font-semibold mt-0.5">✗</span>
                        <span className="text-gray-700">{arg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(hand.back.emotions.focus || hand.back.emotions.confidence || hand.back.emotions.impulsivity !== undefined) && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Emotional State</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {hand.back.emotions.focus && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Focus</div>
                        <div className="text-2xl font-bold text-gray-900">{hand.back.emotions.focus}/10</div>
                      </div>
                    )}
                    {hand.back.emotions.confidence && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Confidence</div>
                        <div className="text-2xl font-bold text-gray-900">{hand.back.emotions.confidence}/10</div>
                      </div>
                    )}
                    {hand.back.emotions.impulsivity !== undefined && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Impulsivity</div>
                        <div className="text-2xl font-bold text-gray-900">{hand.back.emotions.impulsivity}/10</div>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {hand.back.emotions.tilt_type && (
                      <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                        <div className="text-xs text-orange-700 font-semibold mb-1">Tilt Type</div>
                        <div className="text-sm font-medium text-orange-900">{hand.back.emotions.tilt_type}</div>
                      </div>
                    )}
                    {hand.back.emotions.game_state && (
                      <div className={`p-3 rounded-lg border ${
                        hand.back.emotions.game_state === 'A'
                          ? 'bg-green-50 border-green-200'
                          : hand.back.emotions.game_state === 'B'
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <div className={`text-xs font-semibold mb-1 ${
                          hand.back.emotions.game_state === 'A'
                            ? 'text-green-700'
                            : hand.back.emotions.game_state === 'B'
                            ? 'text-yellow-700'
                            : 'text-red-700'
                        }`}>
                          Game State
                        </div>
                        <div className={`text-sm font-medium ${
                          hand.back.emotions.game_state === 'A'
                            ? 'text-green-900'
                            : hand.back.emotions.game_state === 'B'
                            ? 'text-yellow-900'
                            : 'text-red-900'
                        }`}>
                          {hand.back.emotions.game_state}-Game
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {hand.back.next_time_plan && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Next Time Plan</h3>
                  <p className="text-gray-700 leading-relaxed">{hand.back.next_time_plan}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            <span className="font-medium">Created:</span> {formatDate(hand.created_at)}
          </div>
          {hand.meta.mark_for_review && (
            <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
              Marked for Review
            </div>
          )}
        </div>
      </div>

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
          images={allImages}
          currentIndex={selectedImageIndex}
          onNavigate={(index) => {
            setSelectedImageIndex(index);
            setSelectedImage(allImages[index]);
          }}
          notes={screenshotNotes.get(selectedImage) || []}
          canEdit={false}
        />
      )}
    </div>
  );
};

export default AnalysisView;
