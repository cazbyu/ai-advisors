import React, { useState, useEffect } from 'react';
import { Clock, Users } from 'lucide-react';
import { supabase } from '../supabase';

interface Meeting {
  id: string;
  advisor_id: string;
  scheduled_time: string;
  status: string;
  user_id: string;
}

const HOURS = Array.from({ length: 9 }, (_, i) => i + 9); // 9 AM to 5 PM
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function StaffCalendar() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Get start and end of week
  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6); // End of week (Saturday)
    end.setHours(23, 59, 59, 999);

    return { start, end };
  };

  useEffect(() => {
    fetchMeetings();
  }, [selectedDate]);

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      const { start, end } = getWeekDates(selectedDate);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', user.id)
        .gte('scheduled_time', start.toISOString())
        .lte('scheduled_time', end.toISOString())
        .order('scheduled_time');

      if (error) throw error;
      setMeetings(data || []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const previousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const formatWeekRange = () => {
    const { start, end } = getWeekDates(selectedDate);
    return `${start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
  };

  const getDayMeetings = (dayIndex: number, hour: number) => {
    const dayDate = new Date(selectedDate);
    dayDate.setDate(dayDate.getDate() - dayDate.getDay() + dayIndex);
    dayDate.setHours(hour, 0, 0, 0);

    return meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.scheduled_time);
      return (
        meetingDate.getDate() === dayDate.getDate() &&
        meetingDate.getMonth() === dayDate.getMonth() &&
        meetingDate.getFullYear() === dayDate.getFullYear() &&
        meetingDate.getHours() === hour
      );
    });
  };

  return (
    <div className="bg-white rounded-lg">
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousWeek}
          className="px-3 py-1 text-gray-600 hover:text-gray-900"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold text-gray-900">
          {formatWeekRange()}
        </h3>
        <button
          onClick={nextWeek}
          className="px-3 py-1 text-gray-600 hover:text-gray-900"
        >
          →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-lg overflow-auto">
        {/* Header row with days */}
        <div className="flex border-b">
          <div className="w-24 py-4 px-4 border-r bg-gray-50"></div>
          {DAYS.map((day, index) => {
            const date = new Date(selectedDate);
            date.setDate(date.getDate() - date.getDay() + index);
            return (
              <div
                key={day}
                className="flex-1 py-4 px-2 border-r last:border-r-0 bg-gray-50 text-center"
              >
                <div className="font-medium text-gray-900">{day}</div>
                <div className="text-sm text-gray-600">
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time slots */}
        {HOURS.map((hour) => (
          <div key={hour} className="flex border-b last:border-b-0">
            {/* Time column */}
            <div className="w-24 py-4 px-4 border-r bg-gray-50">
              <span className="text-sm text-gray-600">
                {hour % 12 || 12}:00 {hour >= 12 ? 'PM' : 'AM'}
              </span>
            </div>

            {/* Day columns */}
            {DAYS.map((_, dayIndex) => (
              <div
                key={dayIndex}
                className="flex-1 min-h-[80px] p-2 border-r last:border-r-0"
              >
                {getDayMeetings(dayIndex, hour).map((meeting) => (
                  <div
                    key={meeting.id}
                    className="bg-blue-100 rounded p-2 mb-1 hover:bg-blue-200 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-blue-700">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(meeting.scheduled_time).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <span className="text-xs font-medium text-blue-700 capitalize">
                        {meeting.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}