import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../types/database';

type Event = Database['public']['Tables']['events']['Row'];
type EventResponse = Database['public']['Tables']['event_responses']['Row'];
type Utensil = Database['public']['Tables']['utensils']['Row'];
type UtensilAssignment = Database['public']['Tables']['utensil_assignments']['Row'];
type User = Database['public']['Tables']['users']['Row'];

interface EventCardProps {
  event: Event;
  onUpdate: () => void;
}

interface ResponseWithUser extends EventResponse {
  user: User;
}

interface AssignmentWithDetails extends UtensilAssignment {
  utensil: Utensil;
  user: User;
}

export default function EventCard({ event, onUpdate }: EventCardProps) {
  const { user } = useAuth();
  const [responses, setResponses] = useState<ResponseWithUser[]>([]);
  const [utensils, setUtensils] = useState<Utensil[]>([]);
  const [assignments, setAssignments] = useState<AssignmentWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [showGuestInput, setShowGuestInput] = useState(false);
  const [guestCount, setGuestCount] = useState(0);
  const [comment, setComment] = useState('');

  const userResponse = responses.find((r) => r.user_id === user?.id);
  const isResponseLocked = new Date() > new Date(`${event.event_date}T13:00:00`);

  useEffect(() => {
    loadEventData();
  }, [event.id]);

  const loadEventData = async () => {
    try {
      // Load responses with user data
      const { data: responsesData, error: responsesError } = await supabase
        .from('event_responses')
        .select('*, user:users(*)')
        .eq('event_id', event.id);

      if (responsesError) throw responsesError;
      setResponses(responsesData as ResponseWithUser[]);

      // Load utensils
      const { data: utensilsData, error: utensilsError } = await supabase
        .from('utensils')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (utensilsError) throw utensilsError;
      setUtensils(utensilsData);

      // Load assignments with details
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('utensil_assignments')
        .select('*, utensil:utensils(*), user:users(*)')
        .eq('event_id', event.id);

      if (assignmentsError) throw assignmentsError;
      setAssignments(assignmentsData as AssignmentWithDetails[]);
    } catch (error) {
      console.error('Error loading event data:', error);
    }
  };

  const handleResponse = async (responseType: 'zusage' | 'absage') => {
    if (!user || isResponseLocked) return;
    
    setLoading(true);
    try {
      const responseData = {
        event_id: event.id,
        user_id: user.id,
        response_type: responseType,
        guest_count: responseType === 'zusage' ? guestCount : 0,
        comment: comment || null,
      };

      const { error } = await supabase
        .from('event_responses')
        .upsert(responseData);

      if (error) throw error;

      await loadEventData();
      onUpdate();
      setShowGuestInput(false);
      setGuestCount(0);
      setComment('');
    } catch (error) {
      console.error('Error saving response:', error);
      alert('Fehler beim Speichern der Antwort');
    } finally {
      setLoading(false);
    }
  };

  const handleZusageClick = () => {
    if (userResponse?.response_type === 'zusage') {
      // Already confirmed, allow editing
      setGuestCount(userResponse.guest_count);
      setComment(userResponse.comment || '');
    }
    setShowGuestInput(true);
  };

  const toggleUtensil = async (utensilId: string) => {
    if (!user || isResponseLocked || userResponse?.response_type !== 'zusage') return;

    setLoading(true);
    try {
      const existingAssignment = assignments.find(
        (a) => a.utensil_id === utensilId && a.user_id === user.id
      );

      if (existingAssignment) {
        // Remove assignment
        const { error } = await supabase
          .from('utensil_assignments')
          .delete()
          .eq('id', existingAssignment.id);

        if (error) throw error;
      } else {
        // Add assignment
        const { error } = await supabase
          .from('utensil_assignments')
          .insert({
            event_id: event.id,
            user_id: user.id,
            utensil_id: utensilId,
          });

        if (error) throw error;
      }

      await loadEventData();
      onUpdate();
    } catch (error) {
      console.error('Error toggling utensil:', error);
    } finally {
      setLoading(false);
    }
  };

  const zusagen = responses.filter((r) => r.response_type === 'zusage');
  const absagen = responses.filter((r) => r.response_type === 'absage');
  const totalParticipants = zusagen.reduce((sum, r) => sum + 1 + r.guest_count, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { 
      weekday: 'short', 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="card mb-4">
      <div className="mb-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
          <span className="text-sm font-medium text-primary-600">
            {totalParticipants} Teilnehmer
          </span>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p>📅 {formatDate(event.event_date)}</p>
          <p>🕐 {event.start_time.slice(0, 5)} - {event.end_time.slice(0, 5)} Uhr</p>
          <p>📍 {event.location}</p>
        </div>
      </div>

      {isResponseLocked && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded-lg text-sm mb-4">
          ⚠️ Anmeldefrist abgelaufen (13:00 Uhr)
        </div>
      )}

      {!isResponseLocked && (
        <div className="mb-4">
          {!showGuestInput ? (
            <div className="flex gap-2">
              <button
                onClick={handleZusageClick}
                disabled={loading}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  userResponse?.response_type === 'zusage'
                    ? 'bg-green-500 text-white'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                ✓ Zusage
                {userResponse?.response_type === 'zusage' && userResponse.guest_count > 0 && (
                  <span className="ml-1">+{userResponse.guest_count}</span>
                )}
              </button>
              <button
                onClick={() => handleResponse('absage')}
                disabled={loading}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  userResponse?.response_type === 'absage'
                    ? 'bg-red-500 text-white'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                ✗ Absage
              </button>
            </div>
          ) : (
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anzahl Gäste (optional)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kommentar (optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="input-field resize-none"
                  rows={2}
                  placeholder="z.B. komme später..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleResponse('zusage')}
                  disabled={loading}
                  className="flex-1 btn-success"
                >
                  Bestätigen
                </button>
                <button
                  onClick={() => {
                    setShowGuestInput(false);
                    setGuestCount(0);
                    setComment('');
                  }}
                  className="flex-1 btn-secondary"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {userResponse?.response_type === 'zusage' && !isResponseLocked && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Was bringst du mit?</h4>
          <div className="flex gap-2 flex-wrap">
            {utensils.map((utensil) => {
              const isAssigned = assignments.some(
                (a) => a.utensil_id === utensil.id && a.user_id === user?.id
              );
              const assignedUsers = assignments
                .filter((a) => a.utensil_id === utensil.id)
                .map((a) => a.user.nickname);

              return (
                <button
                  key={utensil.id}
                  onClick={() => toggleUtensil(utensil.id)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isAssigned
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={assignedUsers.length > 0 ? assignedUsers.join(', ') : ''}
                >
                  {utensil.icon} {utensil.name}
                  {assignedUsers.length > 0 && (
                    <span className="ml-1 text-xs">({assignedUsers.length})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {zusagen.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-green-700 mb-2">
              ✓ Zusagen ({zusagen.length})
            </h4>
            <div className="space-y-1">
              {zusagen.map((response) => (
                <div
                  key={response.id}
                  className="flex justify-between items-center text-sm bg-green-50 px-3 py-2 rounded"
                >
                  <span className="font-medium">
                    {response.user.nickname}
                    {response.guest_count > 0 && (
                      <span className="text-green-600 ml-1">+{response.guest_count}</span>
                    )}
                  </span>
                  {response.comment && (
                    <span className="text-gray-600 text-xs italic">{response.comment}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {absagen.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-red-700 mb-2">
              ✗ Absagen ({absagen.length})
            </h4>
            <div className="space-y-1">
              {absagen.map((response) => (
                <div
                  key={response.id}
                  className="flex justify-between items-center text-sm bg-red-50 px-3 py-2 rounded"
                >
                  <span className="font-medium">{response.user.nickname}</span>
                  {response.comment && (
                    <span className="text-gray-600 text-xs italic">{response.comment}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {assignments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Utensilien</h4>
          <div className="flex flex-wrap gap-2">
            {utensils.map((utensil) => {
              const utensilAssignments = assignments.filter((a) => a.utensil_id === utensil.id);
              if (utensilAssignments.length === 0) return null;

              return (
                <div
                  key={utensil.id}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  {utensil.icon} {utensilAssignments.map((a) => a.user.nickname).join(', ')}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
