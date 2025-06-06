import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

interface DayData {
  date: Date;
  quality?: 'good' | 'bad';
  hasLog: boolean;
}

const CalendarView: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Mock data - replace with real data in production
  const mockDayData: DayData[] = [
    { date: new Date(2025, 2, 15), quality: 'good', hasLog: true },
    { date: new Date(2025, 2, 16), quality: 'bad', hasLog: true },
    { date: new Date(2025, 2, 17), quality: 'good', hasLog: true },
    { date: new Date(2025, 2, 18), hasLog: false },
  ];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDayData = (date: Date): DayData | undefined => {
    return mockDayData.find(d => isSameDay(d.date, date));
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getDayClasses = (day: Date) => {
    const dayData = getDayData(day);
    const baseClasses = "h-12 w-12 rounded-full flex items-center justify-center relative";
    
    if (!isSameMonth(day, currentMonth)) {
      return `${baseClasses} text-gray-400`;
    }

    if (!dayData?.hasLog) {
      return `${baseClasses} hover:bg-gray-100`;
    }

    if (dayData.quality === 'good') {
      return `${baseClasses} bg-green-100 text-green-800 hover:bg-green-200`;
    }

    if (dayData.quality === 'bad') {
      return `${baseClasses} bg-red-100 text-red-800 hover:bg-red-200`;
    }

    return `${baseClasses} hover:bg-gray-100`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center">
          <CalendarIcon className="mr-2 text-blue-600" size={20} />
          Session Calendar
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-lg font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, dayIdx) => {
          const dayData = getDayData(day);
          return (
            <div
              key={day.toString()}
              className={`relative flex items-center justify-center ${
                !isSameMonth(day, currentMonth) ? 'text-gray-400' : ''
              }`}
            >
              <button className={getDayClasses(day)}>
                {format(day, 'd')}
                {dayData?.hasLog && (
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <span className="block h-1 w-1 rounded-full bg-current"></span>
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center space-x-4">
        <div className="flex items-center">
          <span className="h-3 w-3 rounded-full bg-green-100 mr-2"></span>
          <span className="text-sm text-gray-600">Good Session</span>
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 rounded-full bg-red-100 mr-2"></span>
          <span className="text-sm text-gray-600">Bad Session</span>
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 rounded-full bg-gray-100 mr-2"></span>
          <span className="text-sm text-gray-600">No Log</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;