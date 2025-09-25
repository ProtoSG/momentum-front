import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GameButton, GameCard, GameInput } from '../components/GameComponents';
import { Heart, Sparkles } from 'lucide-react';
import { apiService } from '../services/api';
import dragonSprite from '../assets/dragon-sprite.png';

const petNameSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(20, 'El nombre no puede tener más de 20 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios')
});

type PetNameFormData = z.infer<typeof petNameSchema>;

function CreatePet() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingPet, setIsCheckingPet] = useState(true);
  const [error, setError] = useState('');
  const [currentFrame, setCurrentFrame] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PetNameFormData>({
    resolver: zodResolver(petNameSchema)
  });

  // Check if user already has a pet
  useEffect(() => {
    const checkExistingPet = async () => {
      try {
        const pet = await apiService.getPet();
        if (pet) {
          // User already has a pet, redirect to dashboard
          navigate('/dashboard', { replace: true });
          return;
        }
      } catch {
        // If getPet fails, it means user doesn't have a pet yet
        // This is expected, so we continue to the create pet form
      } finally {
        setIsCheckingPet(false);
      }
    };

    checkExistingPet();
  }, [navigate]);

  // Animación del sprite
  useState(() => {
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % 4);
    }, 800);

    return () => clearInterval(interval);
  });

  const onSubmit = async (data: PetNameFormData) => {
    setIsLoading(true);
    setError('');

    try {
      await apiService.createPet({
        name: data.name.trim(),
        url: "/assets/dragon-sprite.png"
      });
      
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = (err as Error).message?.includes('409') 
        ? 'Ya tienes una mascota creada'
        : 'Error al crear la mascota. Inténtalo de nuevo.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const DragonSprite = () => {
    const frameWidth = 128;
    const spriteStyle = {
      width: '128px',
      height: '128px',
      backgroundImage: `url(${dragonSprite})`,
      backgroundPosition: `-${currentFrame * frameWidth}px 0px`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '512px 128px',
      imageRendering: 'pixelated' as const,
      transform: 'scale(1.2)',
      transition: 'transform 0.3s ease'
    };

    return (
      <div 
        style={spriteStyle}
        className="mx-auto animate-bounce"
      />
    );
  };

  // Show loading while checking if user has existing pet
  if (isCheckingPet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-cyan-300 text-xl">Verificando tu mascota...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <GameCard className="space-y-6" glowing>
          <div className="text-center">
            <h1 className="game-title text-4xl font-bold mb-2">🐉 ¡Tu Dragón Nace!</h1>
            <p className="text-cyan-300 text-lg mb-4">Dale un nombre a tu compañero virtual</p>
          </div>

          <div className="text-center mb-6">
            <div className="mb-4 p-4 bg-gray-800 rounded-lg">
              <DragonSprite />
            </div>
            <p className="text-gray-400 text-sm">
              Este será tu compañero en la aventura de productividad
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <GameInput
              label="Nombre de tu Dragón"
              type="text"
              placeholder="Ej: Fuego, Spark, Luna..."
              error={errors.name?.message}
              required
              register={register('name')}

            />

            {error && (
              <div className="bg-red-900 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
                ⚠️ {error}
              </div>
            )}

            <div className="bg-purple-900 border border-purple-500 text-purple-300 px-4 py-3 rounded-lg text-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} />
                <span className="font-semibold">Tips para nombrar tu dragón:</span>
              </div>
              <ul className="space-y-1 text-xs ml-6">
                <li>• Elige un nombre que te inspire</li>
                <li>• Entre 2 y 20 caracteres</li>
                <li>• Solo letras y espacios</li>
                <li>• ¡Será tu compañero por mucho tiempo!</li>
              </ul>
            </div>

            <GameButton
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-lg"
            >
              {isLoading ? (
                <>🔄 Creando tu dragón...</>
              ) : (
                <>
                  <Heart className="w-5 h-5 mr-2" />
                  ✨ Crear mi Dragón
                </>
              )}
            </GameButton>
          </form>

          <div className="text-center text-sm text-gray-400">
            Una vez creado, podrás cuidar a tu dragón completando tareas
          </div>
        </GameCard>
      </div>
    </div>
  );
}

export default CreatePet;