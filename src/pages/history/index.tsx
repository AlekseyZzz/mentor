import React, { useEffect, useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import SessionReadOnly from '../../components/session/SessionReadOnly';
import { getPostSessionHistory } from '../../lib/api/postSession';

const SessionHistory: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSessionIndex, setSelectedSessionIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'individual' | 'summary'>('individual');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getPostSessionHistory();
        console.log('Loaded sessions:', data);
        setSessions(data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to load sessions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const calendarStart = new Date(monthStart);
  calendarStart.setDate(calendarStart.getDate() - calendarStart.getDay());

  const calendarEnd = new Date(monthEnd);
  calendarEnd.setDate(calendarEnd.getDate() + (6 - calendarEnd.getDay()));

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const getSessionsForDay = (date: Date) => {
    return sessions.filter((session) => {
      const sessionDate = new Date(session.session_date);
      return isSameDay(sessionDate, date);
    });
  };

  const getSessionForDay = (date: Date) => {
    const daySessions = getSessionsForDay(date);
    return daySessions.length > 0 ? daySessions[0] : null;
  };

  const getDayClasses = (day: Date) => {
    const session = getSessionForDay(day);
    const baseClasses = 'h-12 w-12 rounded-full flex items-center justify-center relative cursor-pointer';

    if (!isSameMonth(day, currentMonth)) {
      return `${baseClasses} text-gray-400`;
    }

    if (!session) {
      return `${baseClasses} hover:bg-gray-100`;
    }

    const profileColors = {
      a: 'bg-green-100 text-green-800 hover:bg-green-200',
      b: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      c: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
      d: 'bg-red-100 text-red-800 hover:bg-red-200',
    };

    const gameLevel = session.game_level_self_rating || session.dominant_profile;
    const color = profileColors[gameLevel as keyof typeof profileColors] || 'bg-gray-100';
    return `${baseClasses} ${color}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center">
            <CalendarIcon className="mr-2 text-blue-600" size={20} />
            Session History
          </h2>
          <div className="flex items-center space-x-4">
            <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronLeft size={20} />
            </button>
            <span className="text-lg font-medium">{format(currentMonth, 'MMMM yyyy')}</span>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 p-4">Failed to load session history</div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const session = getSessionForDay(day);
                return (
                  <div
                    key={day.toString()}
                    className="relative flex items-center justify-center"
                    onClick={() => {
                      console.log('Clicked day:', format(day, 'yyyy-MM-dd'), 'Session:', session);
                      if (session) {
                        setSelectedDate(day);
                        setSelectedSessionIndex(0);
                        setViewMode('individual');
                      }
                    }}
                  >
                    <button className={getDayClasses(day)}>
                      {format(day, 'd')}
                      {session && (
                        <>
                          <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                            <span className="block h-1 w-1 rounded-full bg-current"></span>
                          </span>
                          {getSessionsForDay(day).length > 1 && (
                            <span className="absolute top-1 right-1 bg-blue-600 text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                              {getSessionsForDay(day).length}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-center space-x-6">
              {['green', 'yellow', 'orange', 'red'].map((color, i) => (
                <div key={color} className="flex items-center">
                  <span className={`h-3 w-3 rounded-full bg-${color}-100 mr-2`}></span>
                  <span className="text-sm text-gray-600">{['A-Game', 'B-Game', 'C-Game', 'D-Game'][i]}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {selectedDate && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</h3>
            <button onClick={() => setSelectedDate(null)} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={20} />
            </button>
          </div>

          <SessionDetails
            date={selectedDate}
            sessions={getSessionsForDay(selectedDate)}
            selectedSessionIndex={selectedSessionIndex}
            setSelectedSessionIndex={setSelectedSessionIndex}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </div>
      )}
    </div>
  );
};

interface SessionDetailsProps {
  date: Date;
  sessions: any[];
  selectedSessionIndex: number;
  setSelectedSessionIndex: (index: number) => void;
  viewMode: 'individual' | 'summary';
  setViewMode: (mode: 'individual' | 'summary') => void;
}

const SessionDetails: React.FC<SessionDetailsProps> = ({
  sessions,
  selectedSessionIndex,
  setSelectedSessionIndex,
  viewMode,
  setViewMode,
}) => {
  if (!sessions || sessions.length === 0) {
    return <div className="text-center text-gray-500 py-8">No session recorded for this date</div>;
  }

  const currentSession = sessions[selectedSessionIndex];

  return (
    <div className="space-y-4">
      {sessions.length > 1 && (
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">
              {sessions.length} session{sessions.length > 1 ? 's' : ''} on this day
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('individual')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'individual'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Individual
              </button>
              <button
                onClick={() => setViewMode('summary')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'summary'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Daily Summary
              </button>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'individual' && sessions.length > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setSelectedSessionIndex(Math.max(0, selectedSessionIndex - 1))}
            disabled={selectedSessionIndex === 0}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center space-x-2">
            {sessions.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedSessionIndex(index)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  index === selectedSessionIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Session {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSelectedSessionIndex(Math.min(sessions.length - 1, selectedSessionIndex + 1))}
            disabled={selectedSessionIndex === sessions.length - 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {viewMode === 'individual' ? (
        <SessionReadOnly session={currentSession} />
      ) : (
        <DailySummary sessions={sessions} />
      )}
    </div>
  );
};

interface DailySummaryProps {
  sessions: any[];
}

const DailySummary: React.FC<DailySummaryProps> = ({ sessions }) => {
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.minutes_played || 0), 0);
  const totalTables = sessions.reduce((sum, s) => sum + (s.tables_played || 0), 0);
  const avgTables = Math.round(totalTables / sessions.length);

  const gameLevelCounts = sessions.reduce((acc, s) => {
    const level = s.game_level_self_rating || 'unknown';
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantLevel = Object.entries(gameLevelCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown';

  const levelLabels: Record<string, string> = {
    a: 'A-Game',
    b: 'B-Game',
    c: 'C-Game',
    d: 'D-Game',
  };

  const levelColors: Record<string, string> = {
    a: 'text-green-600 bg-green-50',
    b: 'text-yellow-600 bg-yellow-50',
    c: 'text-orange-600 bg-orange-50',
    d: 'text-red-600 bg-red-50',
  };

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-600 font-medium mb-1">Total Sessions</div>
          <div className="text-2xl font-bold text-blue-900">{sessions.length}</div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-green-600 font-medium mb-1">Total Time</div>
          <div className="text-2xl font-bold text-green-900">
            {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm text-purple-600 font-medium mb-1">Avg Tables</div>
          <div className="text-2xl font-bold text-purple-900">{avgTables}</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-sm font-medium text-gray-700 mb-3">Game Quality Distribution</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(gameLevelCounts).map(([level, count]) => (
            <div key={level} className={`rounded-lg p-3 ${levelColors[level] || 'bg-gray-100'}`}>
              <div className="text-xs font-medium mb-1">{levelLabels[level] || level}</div>
              <div className="text-lg font-bold">
                {count} session{count > 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>

        {dominantLevel !== 'unknown' && (
          <div className="mt-4 text-sm text-gray-600">
            Dominant game quality: <span className="font-semibold">{levelLabels[dominantLevel]}</span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="text-sm font-medium text-gray-700 mb-3">Individual Sessions</div>
        <div className="space-y-3">
          {sessions.map((session, index) => (
            <div key={session.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-semibold text-gray-900">Session {index + 1}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    levelColors[session.game_level_self_rating] || 'bg-gray-100'
                  }`}>
                    {levelLabels[session.game_level_self_rating] || 'Unknown'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {session.minutes_played}m • {session.tables_played} table{session.tables_played > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SessionHistory;
