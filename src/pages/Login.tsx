import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema, type LoginFormData } from '../schemas/auth';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { GameButton, GameCard, GameInput } from '../components/GameComponents';
import { ArrowLeft } from 'lucide-react';
import { apiService } from '../services/api';

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  useEffect(() => {
    const checkUserPetAndRedirect = async () => {
      if (!authLoading && isAuthenticated) {
        try {
          await apiService.getPet();
          // Si tiene mascota, ir al dashboard
          navigate('/dashboard');
        } catch {
          // Si no tiene mascota, ir a crear mascota
          navigate('/create-pet');
        }
      }
    };

    checkUserPetAndRedirect();
  }, [isAuthenticated, authLoading, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const authData = await apiService.login(data.email, data.password);
      login(authData.token, authData.refreshToken, authData.email);
      
      // Verificar si el usuario tiene mascota
      try {
        await apiService.getPet();
        navigate('/dashboard');
      } catch {
        navigate('/create-pet');
      }
    } catch {
      setError('Credenciales inválidas. Verifica tu email y contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-cyan-300 text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <GameCard className="space-y-6">
          <div className="text-center">
            <h1 className="game-title text-4xl font-bold mb-2">MOMENTUM</h1>
            <p className="text-cyan-300 text-lg mb-2">🎮 Acceso al Sistema</p>
            <p className="text-gray-400">Inicia sesión para continuar tu aventura</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <GameInput
              label="Email de Jugador"
              type="email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              required
              register={register('email')}
            />

            <GameInput
              label="Código de Acceso"
              type="password"
              placeholder="Tu contraseña secreta"
              error={errors.password?.message}
              required
              register={register('password')}
            />

            {error && (
              <div className="bg-red-900 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
                ⚠️ {error}
              </div>
            )}

            <GameButton
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-lg"
            >
              {isLoading ? (
                <>🔄 Accediendo...</>
              ) : (
                <>
                  🚀 Iniciar Sesión
                </>
              )}
            </GameButton>
          </form>

          <div className="text-center space-y-4">
            <div className="text-sm">
              <span className="text-gray-400">¿No tienes cuenta? </span>
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Crear cuenta
              </Link>
            </div>
            
            <Link to="/" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver al inicio
            </Link>
            
            <div className="text-sm text-gray-400 bg-gray-800 p-3 rounded-lg">
              <div className="font-semibold text-cyan-300 mb-2">🎯 Credenciales de Prueba:</div>
              <div>Email: test@test.com</div>
              <div>Contraseña: test</div>
            </div>
          </div>
        </GameCard>
      </div>
    </div>
  );
}

export default Login;
