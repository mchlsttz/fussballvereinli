import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import EventCard from './EventCard';
import type { Database } from '../types/database';

type Event = Database['public']['Tables']['events']['Row'];

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', today)
        .order('event_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">⚽</div>
          <p className="text-gray-600">Lade Events...</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Keine anstehenden Events
        </h3>
        <p className="text-gray-600">
          Es sind aktuell keine Trainings geplant.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Anstehende Trainings
      </h2>
      {events.map((event) => (
        <EventCard key={event.id} event={event} onUpdate={loadEvents} />
      ))}
    </div>
  );
}

