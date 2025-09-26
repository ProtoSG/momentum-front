import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import { GameButton, GameCard } from '../components/GameComponents';
import { Zap, Trophy, Target } from 'lucide-react';

function Home() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserPetAndRedirect = async () => {
      if (!loading && isAuthenticated) {
        try {
          await apiService.getPet();
          navigate('/dashboard');
        } catch {
          navigate('/create-pet');
        }
      }
    };

    checkUserPetAndRedirect();
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-cyan-300 text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <GameCard className="text-center space-y-8" glowing>
          <div>
            <h1 className="game-title text-5xl md:text-7xl font-bold mb-4">
              MOMENTUM
            </h1>
            <p className="text-cyan-300 text-xl md:text-2xl mb-2">
              🎮 El juego de productividad definitivo
            </p>
            <p className="text-gray-400 text-lg">
              Completa tareas, gana puntos y cuida a tu mascota virtual
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-cyan-300 font-bold text-lg">Crea Misiones</h3>
              <p className="text-gray-400 text-sm">
                Convierte tus tareas en misiones épicas con diferentes niveles de dificultad
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-cyan-300 font-bold text-lg">Gana Puntos</h3>
              <p className="text-gray-400 text-sm">
                Cada misión completada te da puntos según su dificultad
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-cyan-300 font-bold text-lg">Cuida tu Mascota</h3>
              <p className="text-gray-400 text-sm">
                Usa tus puntos para alimentar y cuidar a tu compañero virtual
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <GameButton
              onClick={() => navigate('/register')}
              className="text-xl py-4 px-8"
            >
              🚀 Comenzar Aventura
            </GameButton>
            
            <p className="text-gray-400 text-sm">
              ¿Ya tienes una cuenta? <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">Inicia sesión aquí</Link>
            </p>
          </div>

          <div className="mt-8 p-4 bg-gray-800 rounded-lg">
            <div className="text-cyan-300 text-sm font-semibold mb-2">🎯 Sistema de Puntos:</div>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="text-center">
                <div className="text-green-400 font-bold">🟢 FÁCIL</div>
                <div className="text-gray-400">10 puntos</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 font-bold">🟡 MEDIO</div>
                <div className="text-gray-400">15 puntos</div>
              </div>
              <div className="text-center">
                <div className="text-red-400 font-bold">🔴 DIFÍCIL</div>
                <div className="text-gray-400">20 puntos</div>
              </div>
            </div>
          </div>
        </GameCard>
      </div>
    </div>
  );
}

export default Home
