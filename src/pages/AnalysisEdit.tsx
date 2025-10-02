import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, X, Clipboard } from 'lucide-react';
import { getHandNoteById, updateHandNote, uploadHandScreenshot, UpdateHandNoteData } from '../lib/api/handNotes';
import { TILT_TYPES, GAME_STATES } from '../lib/constants/analysisТags';
import TagSelector from '../components/common/TagSelector';
import ImageModal, { ScreenshotNote } from '../components/common/ImageModal';
import ScreenshotNoteModal from '../components/common/ScreenshotNoteModal';
import { getScreenshotNotesByHandId, createScreenshotNote, updateScreenshotNote as updateScreenshotNoteApi, deleteScreenshotNote, updateScreenshotNotePosition } from '../lib/api/screenshotNotes';

const AnalysisEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState<'front' | 'back'>('front');

  const [handHistory, setHandHistory] = useState('');
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const [thoughts, setThoughts] = useState('');
  const [argumentsFor, setArgumentsFor] = useState<string[]>(['']);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [wizardLink, setWizardLink] = useState('');
  const [wizardDrillScript, setWizardDrillScript] = useState('');
  const [wizardScreenshots, setWizardScreenshots] = useState<string[]>([]);
  const [correctSolution, setCorrectSolution] = useState('');
  const [argumentsAgainst, setArgumentsAgainst] = useState<string[]>(['']);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [pendingScreenshotForNote, setPendingScreenshotForNote] = useState<{ url: string; type: 'hand' | 'wizard' } | null>(null);
  const [screenshotNotes, setScreenshotNotes] = useState<Map<string, (ScreenshotNote & { dbId?: string })[]>>(new Map());
  const [focus, setFocus] = useState<number | undefined>(undefined);
  const [confidence, setConfidence] = useState<number | undefined>(undefined);
  const [impulsivity, setImpulsivity] = useState<number | undefined>(undefined);
  const [tiltType, setTiltType] = useState<string>('');
  const [gameState, setGameState] = useState<string>('');
  const [adaptiveThought, setAdaptiveThought] = useState('');
  const [nextTimePlan, setNextTimePlan] = useState('');
  const [markForReview, setMarkForReview] = useState(false);

  useEffect(() => {
    if (id) {
      loadHand();
    }
  }, [id]);

  const loadHand = async () => {
    if (!id) return;

    try {
      const hand = await getHandNoteById(id);

      setHandHistory(hand.front.hand_history);
      setScreenshots(hand.front.screenshot_urls);
      setThoughts(hand.front.thoughts);
      setArgumentsFor(hand.front.arguments_for.length > 0 ? hand.front.arguments_for : ['']);
      setSelectedTags(hand.front.tags);

      setWizardLink(hand.back.wizard_link || '');
      setWizardDrillScript(hand.back.wizard_drill_script || '');
      setWizardScreenshots(hand.back.wizard_screenshots);
      setCorrectSolution(hand.back.correct_solution);
      setArgumentsAgainst(hand.back.arguments_against.length > 0 ? hand.back.arguments_against : ['']);
      setFocus(hand.back.emotions.focus);
      setConfidence(hand.back.emotions.confidence);
      setImpulsivity(hand.back.emotions.impulsivity);
      setTiltType(hand.back.emotions.tilt_type || '');
      setGameState(hand.back.emotions.game_state || '');
      setAdaptiveThought(hand.back.adaptive_thought);
      setNextTimePlan(hand.back.next_time_plan);
      setMarkForReview(hand.meta.mark_for_review || false);

      const notes = await getScreenshotNotesByHandId(id);
      const notesMap = new Map<string, (ScreenshotNote & { dbId?: string })[]>();
      notes.forEach(note => {
        const existing = notesMap.get(note.screenshot_url) || [];
        existing.push({
          id: note.id,
          content: note.note,
          dbId: note.id,
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

  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageFiles: File[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            imageFiles.push(file);
          }
        }
      }

      if (imageFiles.length > 0) {
        e.preventDefault();
        const type = currentStep === 'front' ? 'hand' : 'wizard';
        await handleMultipleFileUpload(imageFiles, type);
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [currentStep, screenshots, wizardScreenshots]);

  const handleMultipleFileUpload = async (files: File[], type: 'hand' | 'wizard') => {
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large (max 10MB)`);
        continue;
      }

      if (!['image/png', 'image/jpeg', 'image/jpg', 'image/gif'].includes(file.type)) {
        alert(`File ${file.name} is not a valid image format`);
        continue;
      }

      try {
        setUploadingScreenshot(true);
        const url = await uploadHandScreenshot(file, type === 'hand' ? 'hands' : 'wizard');

        if (type === 'hand') {
          setScreenshots(prev => [...prev, url]);
        } else {
          setWizardScreenshots(prev => [...prev, url]);
        }

        setPendingScreenshotForNote({ url, type });
      } catch (error) {
        console.error('Upload failed:', error);
        alert(`Failed to upload ${file.name}`);
      }
    }
    setUploadingScreenshot(false);
  };

  const handleSaveScreenshotNote = async (note: string) => {
    if (pendingScreenshotForNote && id) {
      try {
        const allScreenshots = [...screenshots, ...wizardScreenshots];
        const displayOrder = allScreenshots.indexOf(pendingScreenshotForNote.url);

        const savedNote = await createScreenshotNote({
          hand_note_id: id,
          screenshot_url: pendingScreenshotForNote.url,
          note,
          screenshot_type: pendingScreenshotForNote.type,
          display_order: displayOrder * 100
        });

        const newNotes = new Map(screenshotNotes);
        const screenshotNote: ScreenshotNote & { dbId?: string } = {
          id: Date.now().toString(),
          content: note,
          dbId: savedNote.id
        };
        newNotes.set(pendingScreenshotForNote.url, [screenshotNote]);
        setScreenshotNotes(newNotes);
      } catch (error) {
        console.error('Failed to save screenshot note:', error);
      }
    }
    setPendingScreenshotForNote(null);
  };

  const handleSkipScreenshotNote = () => {
    setPendingScreenshotForNote(null);
  };

  const handleUpdateScreenshotNotes = async (url: string, notes: ScreenshotNote[]) => {
    if (!id) return;

    try {
      const existingNotes = screenshotNotes.get(url) || [];
      const allScreenshots = [...screenshots, ...wizardScreenshots];
      const baseDisplayOrder = allScreenshots.indexOf(url);
      const type = screenshots.includes(url) ? 'hand' : 'wizard';

      const updatedNotes: (ScreenshotNote & { dbId?: string })[] = [];
      const processedDbIds = new Set<string>();

      for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        const existingNote = existingNotes.find(n => n.id === note.id);

        if (existingNote?.dbId) {
          processedDbIds.add(existingNote.dbId);

          if (note.content && note.content.trim().length > 0) {
            await updateScreenshotNoteApi(existingNote.dbId, note.content);

            if (note.position && note.size) {
              await updateScreenshotNotePosition(existingNote.dbId, note.position, note.size);
            }

            updatedNotes.push({
              ...note,
              dbId: existingNote.dbId
            });
          } else {
            await deleteScreenshotNote(existingNote.dbId);
          }
        } else if (note.content && note.content.trim().length > 0) {
          const savedNote = await createScreenshotNote({
            hand_note_id: id,
            screenshot_url: url,
            note: note.content,
            screenshot_type: type,
            display_order: baseDisplayOrder * 100 + i
          });
          updatedNotes.push({
            ...note,
            dbId: savedNote.id
          });
        }
      }

      for (const existingNote of existingNotes) {
        if (existingNote.dbId && !processedDbIds.has(existingNote.dbId)) {
          await deleteScreenshotNote(existingNote.dbId);
        }
      }

      const newNotes = new Map(screenshotNotes);
      newNotes.set(url, updatedNotes);
      setScreenshotNotes(newNotes);
    } catch (error) {
      console.error('Failed to update screenshot notes:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'hand' | 'wizard') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    await handleMultipleFileUpload(fileArray, type);

    e.target.value = '';
  };

  const removeScreenshot = (index: number, type: 'hand' | 'wizard') => {
    if (type === 'hand') {
      setScreenshots(screenshots.filter((_, i) => i !== index));
    } else {
      setWizardScreenshots(wizardScreenshots.filter((_, i) => i !== index));
    }
  };


  const addArgument = (type: 'for' | 'against') => {
    if (type === 'for') {
      setArgumentsFor([...argumentsFor, '']);
    } else {
      setArgumentsAgainst([...argumentsAgainst, '']);
    }
  };

  const updateArgument = (index: number, value: string, type: 'for' | 'against') => {
    if (type === 'for') {
      const updated = [...argumentsFor];
      updated[index] = value;
      setArgumentsFor(updated);
    } else {
      const updated = [...argumentsAgainst];
      updated[index] = value;
      setArgumentsAgainst(updated);
    }
  };

  const removeArgument = (index: number, type: 'for' | 'against') => {
    if (type === 'for') {
      setArgumentsFor(argumentsFor.filter((_, i) => i !== index));
    } else {
      setArgumentsAgainst(argumentsAgainst.filter((_, i) => i !== index));
    }
  };

  const canProceedToBack = () => {
    return handHistory.trim().length > 0 || screenshots.length > 0;
  };

  const canSave = () => {
    return adaptiveThought.trim().length > 0 && adaptiveThought.length <= 120;
  };

  const handleSave = async () => {
    if (!id || !canSave()) {
      alert('Adaptive thought is required (max 120 characters)');
      return;
    }

    setSaving(true);
    try {
      const data: UpdateHandNoteData = {
        front: {
          hand_history: handHistory,
          screenshot_urls: screenshots,
          thoughts: thoughts,
          arguments_for: argumentsFor.filter(arg => arg.trim().length > 0),
          tags: selectedTags
        },
        back: {
          wizard_link: wizardLink || null,
          wizard_drill_script: wizardDrillScript || null,
          wizard_screenshots: wizardScreenshots,
          correct_solution: correctSolution,
          arguments_against: argumentsAgainst.filter(arg => arg.trim().length > 0),
          emotions: {
            focus,
            confidence,
            impulsivity,
            tilt_type: tiltType || null,
            game_state: gameState as 'A' | 'B' | 'C' | null
          },
          adaptive_thought: adaptiveThought,
          next_time_plan: nextTimePlan
        },
        meta: {
          mark_for_review: markForReview
        }
      };

      await updateHandNote(id, data);
      navigate(`/analysis/${id}`);
    } catch (error) {
      console.error('Failed to update hand:', error);
      alert('Failed to update hand');
    } finally {
      setSaving(false);
    }
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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/analysis/${id}`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Hand Analysis</h1>
          <p className="text-gray-600 mt-1">
            {currentStep === 'front' ? 'Step 1: Edit the hand scenario' : 'Step 2: Edit your analysis'}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setCurrentStep('front')}
          className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
            currentStep === 'front'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Front (Scenario)
        </button>
        <button
          onClick={() => canProceedToBack() && setCurrentStep('back')}
          disabled={!canProceedToBack()}
          className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
            currentStep === 'back'
              ? 'bg-blue-600 text-white'
              : canProceedToBack()
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Back (Analysis)
        </button>
      </div>

      {currentStep === 'front' ? (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hand History
              {handHistory && (
                <span className="ml-2 text-xs text-gray-500">({handHistory.length} characters)</span>
              )}
            </label>
            <details className="group">
              <summary className="cursor-pointer list-none">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                  <span className="group-open:rotate-90 transition-transform">▶</span>
                  {handHistory ? 'Click to view/edit hand history' : 'Click to add hand history'}
                </div>
              </summary>
              <div className="mt-3">
                <textarea
                  value={handHistory}
                  onChange={(e) => setHandHistory(e.target.value)}
                  placeholder="Paste hand history here..."
                  rows={8}
                  maxLength={10000}
                  className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {handHistory.length} / 10,000 characters
                </div>
              </div>
            </details>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Screenshots
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
              {screenshots.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    alt={`Screenshot ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setAllImages(screenshots);
                      setSelectedImageIndex(idx);
                      setSelectedImage(url);
                    }}
                  />
                  <button
                    onClick={() => removeScreenshot(idx, 'hand')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors">
              <Upload size={20} className="text-gray-400" />
              <span className="text-sm text-gray-600">
                {uploadingScreenshot ? 'Uploading...' : 'Upload screenshots (max 10MB each)'}
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif"
                multiple
                onChange={(e) => handleFileUpload(e, 'hand')}
                disabled={uploadingScreenshot}
                className="hidden"
              />
            </label>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <Clipboard size={14} />
              <span>Tip: You can also paste images directly (Ctrl+V / Cmd+V)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Thoughts (in the moment)
            </label>
            <textarea
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              placeholder="What were you thinking when making this decision?"
              rows={3}
              maxLength={280}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <div className="text-xs text-gray-500 mt-1">
              {thoughts.length} / 280 characters
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arguments FOR your decision
            </label>
            <div className="space-y-2">
              {argumentsFor.map((arg, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={arg}
                    onChange={(e) => updateArgument(idx, e.target.value, 'for')}
                    placeholder={`Argument ${idx + 1}`}
                    maxLength={120}
                    className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                  />
                  {argumentsFor.length > 1 && (
                    <button
                      onClick={() => removeArgument(idx, 'for')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
              {argumentsFor.length < 6 && (
                <button
                  onClick={() => addArgument('for')}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus size={16} />
                  Add argument
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <TagSelector selectedTags={selectedTags} onChange={setSelectedTags} />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setCurrentStep('back')}
              disabled={!canProceedToBack()}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                canProceedToBack()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue to Analysis →
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GTO Wizard Link
            </label>
            <input
              type="url"
              value={wizardLink}
              onChange={(e) => setWizardLink(e.target.value)}
              placeholder="https://app.gtowizard.com/..."
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GTO Wizard Drill Script
            </label>
            <textarea
              value={wizardDrillScript}
              onChange={(e) => setWizardDrillScript(e.target.value)}
              placeholder="Paste GTO Wizard drill script here..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wizard Screenshots (solution tree/frequencies)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
              {wizardScreenshots.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    alt={`Wizard ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setAllImages(wizardScreenshots);
                      setSelectedImageIndex(idx);
                      setSelectedImage(url);
                    }}
                  />
                  <button
                    onClick={() => removeScreenshot(idx, 'wizard')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors">
              <Upload size={20} className="text-gray-400" />
              <span className="text-sm text-gray-600">
                {uploadingScreenshot ? 'Uploading...' : 'Upload screenshots (max 10MB each)'}
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif"
                multiple
                onChange={(e) => handleFileUpload(e, 'wizard')}
                disabled={uploadingScreenshot}
                className="hidden"
              />
            </label>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <Clipboard size={14} />
              <span>Tip: You can also paste images directly (Ctrl+V / Cmd+V)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correct Solution <span className="text-red-500">*</span>
            </label>
            <textarea
              value={correctSolution}
              onChange={(e) => setCorrectSolution(e.target.value)}
              placeholder="Brief summary of the correct play..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arguments AGAINST your decision (why it was wrong)
            </label>
            <div className="space-y-2">
              {argumentsAgainst.map((arg, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={arg}
                    onChange={(e) => updateArgument(idx, e.target.value, 'against')}
                    placeholder={`Counter-argument ${idx + 1}`}
                    maxLength={120}
                    className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                  />
                  {argumentsAgainst.length > 1 && (
                    <button
                      onClick={() => removeArgument(idx, 'against')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
              {argumentsAgainst.length < 6 && (
                <button
                  onClick={() => addArgument('against')}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus size={16} />
                  Add counter-argument
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Focus (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={focus || ''}
                onChange={(e) => setFocus(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confidence (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={confidence || ''}
                onChange={(e) => setConfidence(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Impulsivity (0-10)</label>
              <input
                type="number"
                min="0"
                max="10"
                value={impulsivity || ''}
                onChange={(e) => setImpulsivity(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tilt Type</label>
              <select
                value={tiltType}
                onChange={(e) => setTiltType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">None</option>
                {TILT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Game State</label>
              <select
                value={gameState}
                onChange={(e) => setGameState(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Not set</option>
                {GAME_STATES.map(state => (
                  <option key={state} value={state}>{state}-Game</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adaptive Thought / Rule <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={adaptiveThought}
              onChange={(e) => setAdaptiveThought(e.target.value)}
              placeholder="Short rule to remember (max 120 chars)"
              maxLength={120}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <div className="text-xs text-gray-500 mt-1">
              {adaptiveThought.length} / 120 characters
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What to do next time
            </label>
            <textarea
              value={nextTimePlan}
              onChange={(e) => setNextTimePlan(e.target.value)}
              placeholder="Concrete action plan for similar spots..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={markForReview}
              onChange={(e) => setMarkForReview(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Mark for review (add to study queue)</span>
          </label>

          <div className="flex justify-between pt-4 border-t">
            <button
              onClick={() => setCurrentStep('front')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ← Back to Front
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave() || saving}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                canSave() && !saving
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {saving ? 'Saving...' : 'Update Hand'}
            </button>
          </div>
        </div>
      )}

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
          onNotesUpdate={(notes) => handleUpdateScreenshotNotes(selectedImage, notes)}
          canEdit={true}
        />
      )}

      {pendingScreenshotForNote && (
        <ScreenshotNoteModal
          screenshotUrl={pendingScreenshotForNote.url}
          onSave={handleSaveScreenshotNote}
          onSkip={handleSkipScreenshotNote}
        />
      )}
    </div>
  );
};

export default AnalysisEdit;
