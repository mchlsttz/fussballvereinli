import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../types/database';

type User = Database['public']['Tables']['users']['Row'];

export default function AdminView() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [utensils, setUtensils] = useState<Database['public']['Tables']['utensils']['Row']>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  
  // Form state for new event
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('21:00');
  const [location, setLocation] = useState('Sportplatz Gummerwald');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersResult, utensilsResult] = await Promise.all([
        supabase.from('users').select('*').order('nickname'),
        supabase.from('utensils').select('*').order('sort_order')
      ]);

      if (usersResult.error) throw usersResult.error;
      if (utensilsResult.error) throw utensilsResult.error;

      setUsers(usersResult.data || []);
      setUtensils(utensilsResult.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserActive = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Fehler beim Ändern des User-Status');
    }
  };

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventDate || !startTime || !endTime || !location) {
      alert('Bitte fülle alle Felder aus');
      return;
    }

    try {
      const { error } = await supabase.from('events').insert({
        title: 'Training',
        event_date: eventDate,
        start_time: startTime,
        end_time: endTime,
        location: location,
        created_by: currentUser?.id
      });

      if (error) throw error;

      // Reset form
      setEventDate('');
      setStartTime('19:00');
      setEndTime('21:00');
      setLocation('Sportplatz Gummerwald');
      setShowCreateEvent(false);
      
      alert('Event erfolgreich erstellt!');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Fehler beim Erstellen des Events');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">⚙️</div>
          <p className="text-gray-600">Lade Admin-Daten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin-Bereich</h2>
      </div>

      {/* Create Event Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Events verwalten</h3>
          <button
            onClick={() => setShowCreateEvent(!showCreateEvent)}
            className="btn-primary"
          >
            {showCreateEvent ? 'Abbrechen' : '+ Neues Event'}
          </button>
        </div>

        {showCreateEvent && (
          <form onSubmit={createEvent} className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Datum *
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ort *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input-field"
                  placeholder="Sportplatz Gummerwald"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start-Zeit *
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End-Zeit *
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary">
              Event erstellen
            </button>
          </form>
        )}
      </div>

      {/* User Management Section */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Spieler-Verwaltung
        </h3>
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{user.nickname}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <button
                onClick={() => toggleUserActive(user.id, user.is_active)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  user.is_active
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                {user.is_active ? '✓ Aktiv' : '✗ Blockiert'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Utensils Display Section */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Definierte Utensilien
        </h3>
        <div className="flex flex-wrap gap-2">
          {utensils.map((utensil) => (
            <div
              key={utensil.id}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                utensil.is_active
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {utensil.icon} {utensil.name}
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Hinweis: Utensilien können aktuell nur über SQL-Migrationen geändert werden
        </p>
      </div>
    </div>
  );
}
