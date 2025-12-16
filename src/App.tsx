import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Header from './components/Header';
import EventsList from './components/EventsList';
import AdminView from './components/AdminView';

function App() {
  const { user, profile, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'events' | 'admin'>('events');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⚽</div>
          <p className="text-gray-600">Lädt...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Login />;
  }

  if (!profile.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account deaktiviert</h2>
          <p className="text-gray-600 mb-6">
            Dein Account wurde vom Admin deaktiviert. Bitte kontaktiere den Admin für weitere Informationen.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary"
          >
            Neu laden
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={setCurrentView} currentView={currentView} />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {currentView === 'events' ? <EventsList /> : <AdminView />}
      </main>
    </div>
  );
}

export default App;
