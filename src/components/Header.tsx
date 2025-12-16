import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onNavigate: (view: 'events' | 'admin') => void;
  currentView: 'events' | 'admin';
}

export default function Header({ onNavigate, currentView }: HeaderProps) {
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">⚽</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Gumb</h1>
              <p className="text-xs text-gray-500">{profile?.nickname || 'Lädt...'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {profile?.is_admin && (
              <>
                <button
                  onClick={() => onNavigate('events')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'events'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Events
                </button>
                <button
                  onClick={() => onNavigate('admin')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'admin'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Admin
                </button>
              </>
            )}
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Abmelden
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
