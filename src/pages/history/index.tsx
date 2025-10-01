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

  const getSessionForDay = (date: Date) => {
    const session = sessions.find((session) => {
      const sessionDate = new Date(session.session_date);
      const match = isSameDay(sessionDate, date);
      return match;
    });
    return session;
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
                      }
                    }}
                  >
                    <button className={getDayClasses(day)}>
                      {format(day, 'd')}
                      {session && (
                        <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                          <span className="block h-1 w-1 rounded-full bg-current"></span>
                        </span>
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

          <SessionDetails date={selectedDate} session={getSessionForDay(selectedDate)} />
        </div>
      )}
    </div>
  );
};

interface SessionDetailsProps {
  date: Date;
  session: any;
}

const SessionDetails: React.FC<SessionDetailsProps> = ({ session }) => {
  if (!session) {
    return <div className="text-center text-gray-500 py-8">No session recorded for this date</div>;
  }

  return <SessionReadOnly session={session} />;
};

export default SessionHistory;
