import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type User = {
  id: string;
  email: string;
  nickname: string;
  is_admin: boolean;
  is_active: boolean;
};

type Utensil = {
  id: string;
  name: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
};

const WEEKDAYS = [
  { value: 0, label: 'Sonntag' },
  { value: 1, label: 'Montag' },
  { value: 2, label: 'Dienstag' },
  { value: 3, label: 'Mittwoch' },
  { value: 4, label: 'Donnerstag' },
  { value: 5, label: 'Freitag' },
  { value: 6, label: 'Samstag' },
];

export default function AdminView() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [utensils, setUtensils] = useState<Utensil[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showRecurringEvent, setShowRecurringEvent] = useState(false);
  
  // Form state for new event
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('21:00');
  const [location, setLocation] = useState('Sportplatz Gummerwald');
  
  // Form state for new user
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserNickname, setNewUserNickname] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  
  // Form state for recurring event
  const [recurringDayOfWeek, setRecurringDayOfWeek] = useState(1);
  const [recurringStartDate, setRecurringStartDate] = useState('');
  const [recurringEndDate, setRecurringEndDate] = useState('');
  const [recurringStartTime, setRecurringStartTime] = useState('19:00');
  const [recurringEndTime, setRecurringEndTime] = useState('21:00');
  const [recurringLocation, setRecurringLocation] = useState('Sportplatz Gummerwald');

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

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUserEmail || !newUserNickname || !newUserPassword) {
      alert('Bitte fülle alle Felder aus');
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUserEmail,
        password: newUserPassword,
        email_confirm: true,
      });

      if (authError) throw authError;

      const { error: profileError } = await supabase.from('users').insert({
        id: authData.user.id,
        email: newUserEmail,
        nickname: newUserNickname,
        is_admin: false,
        is_active: true,
      });

      if (profileError) throw profileError;

      setNewUserEmail('');
      setNewUserNickname('');
      setNewUserPassword('');
      setShowCreateUser(false);
      
      await loadData();
      alert('User erfolgreich erstellt!');
    } catch (error: any) {
      console.error('Error creating user:', error);
      alert('Fehler: ' + (error.message || 'Unbekannter Fehler'));
    }
  };

  const deleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`User "${userEmail}" wirklich löschen? Dies kann nicht rückgängig gemacht werden!`)) {
      return;
    }

    try {
      const { error: profileError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) {
        console.error('Warning: User deleted from database but not from auth:', authError);
      }

      await loadData();
      alert('User erfolgreich gelöscht!');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Fehler beim Löschen des Users');
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

  const createRecurringEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recurringStartDate || !recurringEndDate || !recurringStartTime || !recurringEndTime || !recurringLocation) {
      alert('Bitte fülle alle Felder aus');
      return;
    }

    if (new Date(recurringStartDate) > new Date(recurringEndDate)) {
      alert('End-Datum muss nach Start-Datum liegen');
      return;
    }

    try {
      const { data: template, error: templateError } = await supabase
        .from('recurring_event_templates')
        .insert({
          title: 'Training',
          day_of_week: recurringDayOfWeek,
          start_time: recurringStartTime,
          end_time: recurringEndTime,
          location: recurringLocation,
          start_date: recurringStartDate,
          end_date: recurringEndDate,
          created_by: currentUser?.id,
        })
        .select()
        .single();

      if (templateError) throw templateError;

      const { error: generateError } = await supabase.rpc('generate_events_from_template', {
        template_id: template.id,
      });

      if (generateError) throw generateError;

      setRecurringDayOfWeek(1);
      setRecurringStartDate('');
      setRecurringEndDate('');
      setRecurringStartTime('19:00');
      setRecurringEndTime('21:00');
      setRecurringLocation('Sportplatz Gummerwald');
      setShowRecurringEvent(false);
      
      alert('Serientermine erfolgreich erstellt!');
    } catch (error) {
      console.error('Error creating recurring event:', error);
      alert('Fehler beim Erstellen der Serientermine');
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

      {/* Event Management Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Events verwalten</h3>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowCreateEvent(!showCreateEvent);
                setShowRecurringEvent(false);
              }}
              className="btn-primary text-sm"
            >
              {showCreateEvent ? 'Abbrechen' : '+ Einzeltermin'}
            </button>
            <button
              onClick={() => {
                setShowRecurringEvent(!showRecurringEvent);
                setShowCreateEvent(false);
              }}
              className="btn-secondary text-sm"
            >
              {showRecurringEvent ? 'Abbrechen' : '+ Serientermin'}
            </button>
          </div>
        </div>

        {showCreateEvent && (
          <form onSubmit={createEvent} className="space-y-4 bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-gray-900">Einzeltermin erstellen</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Datum *</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ort *</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start-Zeit *</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End-Zeit *</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>
            <button type="submit" className="w-full btn-primary">Event erstellen</button>
          </form>
        )}

        {showRecurringEvent && (
          <form onSubmit={createRecurringEvent} className="space-y-4 bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-gray-900">Wöchentlichen Serientermin erstellen</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Wochentag *</label>
                <select
                  value={recurringDayOfWeek}
                  onChange={(e) => setRecurringDayOfWeek(parseInt(e.target.value))}
                  className="input-field"
                  required
                >
                  {WEEKDAYS.map(day => (
                    <option key={day.value} value={day.value}>{day.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ort *</label>
                <input
                  type="text"
                  value={recurringLocation}
                  onChange={(e) => setRecurringLocation(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Von Datum *</label>
                <input
                  type="date"
                  value={recurringStartDate}
                  onChange={(e) => setRecurringStartDate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bis Datum *</label>
                <input
                  type="date"
                  value={recurringEndDate}
                  onChange={(e) => setRecurringEndDate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start-Zeit *</label>
                <input
                  type="time"
                  value={recurringStartTime}
                  onChange={(e) => setRecurringStartTime(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End-Zeit *</label>
                <input
                  type="time"
                  value={recurringEndTime}
                  onChange={(e) => setRecurringEndTime(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">
              <strong>Info:</strong> Es werden automatisch alle {WEEKDAYS.find(d => d.value === recurringDayOfWeek)?.label}e 
              im angegebenen Zeitraum als Trainings erstellt.
            </div>
            <button type="submit" className="w-full btn-primary">Serientermine erstellen</button>
          </form>
        )}
      </div>

      {/* User Management Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Spieler-Verwaltung</h3>
          <button
            onClick={() => setShowCreateUser(!showCreateUser)}
            className="btn-primary text-sm"
          >
            {showCreateUser ? 'Abbrechen' : '+ Neuer Spieler'}
          </button>
        </div>

        {showCreateUser && (
          <form onSubmit={createUser} className="space-y-4 bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-gray-900">Neuen Spieler erstellen</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="input-field"
                  placeholder="spieler@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Spitzname *</label>
                <input
                  type="text"
                  value={newUserNickname}
                  onChange={(e) => setNewUserNickname(e.target.value)}
                  className="input-field"
                  placeholder="Max"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passwort *</label>
                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="input-field"
                  placeholder="Mindestens 6 Zeichen"
                  minLength={6}
                  required
                />
              </div>
            </div>
            <button type="submit" className="w-full btn-primary">Spieler erstellen</button>
          </form>
        )}

        <div className="space-y-2">
          {users.map(user => (
            <div
              key={user.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {user.nickname}
                  {user.is_admin && <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Admin</span>}
                </p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleUserActive(user.id, user.is_active)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    user.is_active
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {user.is_active ? '✓ Aktiv' : '✗ Blockiert'}
                </button>
                {user.id !== currentUser?.id && (
                  <button
                    onClick={() => deleteUser(user.id, user.email)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                  >
                    Löschen
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Utensils Display Section */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Definierte Utensilien</h3>
        <div className="flex flex-wrap gap-2">
          {utensils.map(utensil => (
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
