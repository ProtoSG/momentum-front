import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema, type RegisterFormData } from '../schemas/auth';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { GameButton, GameCard, GameInput } from '../components/GameComponents';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { apiService } from '../services/api';

function Register() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/create-pet');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // 🎯 Detectar automáticamente configuración del usuario
  useEffect(() => {
    // Detectar zona horaria
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setValue('timezone', timezone);

    // Detectar idioma/locale
    const locale = navigator.language || 'es';
    setValue('locale', locale);

    // Hora de inicio inteligente basada en zona horaria
    const now = new Date();
    const currentHour = now.getHours();
    // Si es muy tarde/temprano, sugerir 6 AM, sino mantener hora actual
    const suggestedStartHour = (currentHour < 4 || currentHour > 22) ? 6 : currentHour;
    setValue('dayStartHour', suggestedStartHour);
  }, [setValue]);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const authData = await apiService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        timezone: data.timezone,
        locale: data.locale,
        dayStartHour: data.dayStartHour
      });
      
      login(authData.token, authData.refreshToken, authData.email);
      
      // Redirigir a la página de creación de mascota
      navigate('/create-pet');
    } catch (err) {
      const errorMessage = (err as Error).message?.includes('409') 
        ? 'Ya existe un usuario con este email'
        : 'Error al crear la cuenta. Inténtalo de nuevo.';
      setError(errorMessage);
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
            <p className="text-cyan-300 text-lg mb-2">🎮 Crear Nueva Cuenta</p>
            <p className="text-gray-400">Únete a la aventura de productividad</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <GameInput
              label="Nombre de Jugador"
              type="text"
              placeholder="Tu nombre"
              error={errors.name?.message}
              required
              register={register('name')}
            />

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
              placeholder="Mínimo 6 caracteres"
              error={errors.password?.message}
              required
              register={register('password')}
            />

            {error && (
              <div className="bg-red-900 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
                ⚠️ {error}
              </div>
            )}

            {/* Información de configuración detectada */}
            <div className="bg-gray-800 border border-cyan-500 text-cyan-300 px-4 py-3 rounded-lg text-sm">
              <div className="font-semibold text-cyan-300 mb-2">🤖 Configuración Detectada:</div>
              <div className="space-y-1 text-xs">
                <div>🌍 Zona horaria: <span className="text-yellow-400">{Intl.DateTimeFormat().resolvedOptions().timeZone}</span></div>
                <div>🗣️ Idioma: <span className="text-yellow-400">{navigator.language}</span></div>
                <div>⏰ Hora de inicio sugerida: <span className="text-yellow-400">{new Date().getHours()}:00 </span></div>
              </div>
            </div>

            <GameButton
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-lg"
            >
              {isLoading ? (
                <>🔄 Creando cuenta...</>
              ) : (
                <>
                  🚀 Crear Cuenta
                </>
              )}
            </GameButton>
          </form>

          <div className="text-center space-y-4">
            <Link to="/login" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors">
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
            
            <Link to="/" className="inline-flex items-center text-gray-400 hover:text-gray-300 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver al inicio
            </Link>
          </div>
        </GameCard>
      </div>
    </div>
  );
}

export default Register;
