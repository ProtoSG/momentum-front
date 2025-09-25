import React, { useState, useEffect } from 'react';
import { Heart, Zap, Pizza } from 'lucide-react';
import { GameCard } from './GameComponents';
import { apiService } from '../services/api';
import type { Pet, PetLevel } from '../types/api';
import dragonSprite from '../assets/dragon-sprite.png';

interface PetStats {
  health: number;
  energy: number;
  hunger: number;
  points: number;
  level: number;
  experience: number;
}

interface PetComponentProps {
  onPointsChange?: (points: number) => void;
  refreshTrigger?: number; // Add a trigger to refresh pet data
}

export const PetComponent: React.FC<PetComponentProps> = ({ onPointsChange, refreshTrigger }) => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [petLevels, setPetLevels] = useState<PetLevel[]>([]);
  const [petStats, setPetStats] = useState<PetStats>({
    health: 100,
    energy: 100,
    hunger: 0,
    points: 0,
    level: 1,
    experience: 0
  });
  const [loading, setLoading] = useState(true);

  const [petMood, setPetMood] = useState<'happy' | 'neutral' | 'sad'>('neutral');
  const [currentFrame, setCurrentFrame] = useState(0);

  // Cargar datos del backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const [petData, levelsData] = await Promise.all([
          apiService.getPet(),
          apiService.getPetLevels()
        ]);
        
        setPet(petData);
        setPetLevels(levelsData);
        setPetStats(prev => ({
          ...prev,
          points: petData.pointsTotal || 0,
          level: petData.level || 1,
          experience: petData.experience || 0,
          health: petData.health || 100,
          energy: petData.energy || 100,
          hunger: petData.hunger || 0
        }));
        console.log({petData, levelsData})
      } catch {
        console.log('No se encontró mascota para este usuario');
        setPet(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [refreshTrigger]); // Refresh when trigger changes

  useEffect(() => {
    const avgStat = (petStats.health + petStats.energy + (100 - petStats.hunger)) / 3;
    if (avgStat > 70) setPetMood('happy');
    else if (avgStat > 40) setPetMood('neutral');
    else setPetMood('sad');
  }, [petStats]);

  // Animación del sprite
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % 4);
    }, petMood === 'happy' ? 500 : petMood === 'neutral' ? 1000 : 1500);

    return () => clearInterval(interval);
  }, [petMood]);

  const feedPet = async () => {
    if (petStats.points >= 10 && petStats.hunger < 100) {
      try {
        const updatedPet = await apiService.feedPet();
        
        setPetStats(prev => ({
          ...prev,
          hunger: updatedPet.hunger || 0,
          health: updatedPet.health || prev.health,
          points: updatedPet.pointsTotal || 0
        }));
        onPointsChange?.(updatedPet.pointsTotal || 0);
      } catch (error) {
        console.error('Error alimentando mascota:', error);
      }
    }
  };

  const healPet = async () => {
    if (petStats.points >= 20 && petStats.health < 100) {
      try {
        const updatedPet = await apiService.healPet();
        
        setPetStats(prev => ({
          ...prev,
          health: updatedPet.health || 100,
          points: updatedPet.pointsTotal || 0
        }));
        onPointsChange?.(updatedPet.pointsTotal || 0);
      } catch (error) {
        console.error('Error curando mascota:', error);
      }
    }
  };

  const boostEnergy = async () => {
    if (petStats.points >= 15 && petStats.energy < 100) {
      try {
        const updatedPet = await apiService.boostPetEnergy();
        
        setPetStats(prev => ({
          ...prev,
          energy: updatedPet.energy || 100,
          points: updatedPet.pointsTotal || 0
        }));
        onPointsChange?.(updatedPet.pointsTotal || 0);
      } catch (error) {
        console.error('Error aumentando energía:', error);
      }
    }
  };



  const DragonSprite = () => {
    const frameWidth = 128; // Ancho de cada frame
    const spriteStyle = {
      width: '128px',
      height: '128px',
      backgroundImage: `url(${dragonSprite})`,
      backgroundPosition: `-${currentFrame * frameWidth}px 0px`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '512px 128px', // 4 frames de 128px cada uno
      imageRendering: 'pixelated' as const,
      transform: `scale(${petMood === 'happy' ? '1.1' : petMood === 'sad' ? '0.9' : '1'})`,
      transition: 'transform 0.3s ease',
      filter: petMood === 'sad' ? 'grayscale(0.3)' : 'none'
    };

    return (
      <div 
        style={spriteStyle}
        className={`mx-auto ${petMood === 'happy' ? 'animate-bounce' : ''}`}
      />
    );
  };

  const StatBar = ({ label, value, max, color, icon }: {
    label: string;
    value: number;
    max: number;
    color: string;
    icon: React.ReactNode;
  }) => {
    const percentage = Math.max(0, Math.min(100, (value / max) * 100));
    
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-cyan-300">
            {icon}
            <span>{label}</span>
          </div>
          <span className="text-cyan-100">{value}/{max}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: getBarColor(label.toLowerCase())
            }}
          />
        </div>
      </div>
    );
  };

  const getBarColor = (statType: string) => {
    switch (statType) {
      case 'salud':
        return '#ef4444'; // red-500
      case 'energía':
        return '#3b82f6'; // blue-500  
      case 'hambre':
        return '#f97316'; // orange-500
      default:
        return '#6b7280'; // gray-500
    }
  };

  if (loading) {
    return (
      <GameCard className="max-w-md">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-cyan-300 mb-4">🐉 Tu Dragón Virtual</h2>
          <div className="text-cyan-300">Cargando mascota...</div>
        </div>
      </GameCard>
    );
  }

  if (!pet) {
    return (
      <GameCard className="max-w-md">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-cyan-300 mb-4">🐉 Tu Dragón Virtual</h2>
          <div className="text-gray-400 mb-4">
            ¡Ups! Parece que aún no tienes una mascota creada.
          </div>
          <div className="text-sm text-cyan-300">
            Si acabas de registrarte, deberías haber sido redirigido para crear tu dragón.
            <br />
            Intenta cerrar sesión y volver a registrarte.
          </div>
        </div>
      </GameCard>
    );
  }

  return (
    <GameCard className="max-w-md" glowing={petMood === 'happy'}>
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-cyan-300 mb-2">🐉 {pet.name || 'Tu Dragón Virtual'}</h2>
        <div className="text-sm text-purple-300 mb-4">{
          petLevels.find(l => l.level === petStats.level)?.name || 'Unknown'
        }</div>
        
        <div className="mb-4 p-4">
          <DragonSprite />
        </div>

        <div className="flex justify-between items-center bg-gray-800 rounded-lg p-3">
          <div className="text-center">
            <div className="text-yellow-400 font-bold text-xl">{petStats.points}</div>
            <div className="text-xs text-yellow-300">Puntos</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400 font-bold text-xl">Nv.{petStats.level}</div>
            <div className="text-xs text-purple-300">Nivel</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-bold text-xl">
              {petStats.experience}/{
                petLevels.find(l => l.level === petStats.level + 1)?.experienceRequired || 'MAX'
              }
            </div>
            <div className="text-xs text-green-300">EXP</div>
          </div>
        </div>

        <div className="space-y-3">
          <StatBar
            label="Salud"
            value={petStats.health}
            max={100}
            color=""
            icon={<Heart size={16} />}
          />
          <StatBar
            label="Energía"
            value={petStats.energy}
            max={100}
            color=""
            icon={<Zap size={16} />}
          />
          <StatBar
            label="Hambre"
            value={petStats.hunger}
            max={100}
            color=""
            icon={<Pizza size={16} />}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <button
            onClick={feedPet}
            disabled={petStats.points < 10 || petStats.hunger >= 100}
            className="bg-orange-600 hover:bg-orange-500 disabled:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm transition-colors duration-200"
          >
            Alimentar (10pts)
          </button>
          <button
            onClick={healPet}
            disabled={petStats.points < 20 || petStats.health === 100}
            className="bg-red-600 hover:bg-red-500 disabled:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm transition-colors duration-200"
          >
            Curar (20pts)
          </button>
          <button
            onClick={boostEnergy}
            disabled={petStats.points < 15 || petStats.energy === 100}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm transition-colors duration-200"
          >
            Energía (15pts)
          </button>
        </div>

        <div className="text-center text-sm text-gray-400 mt-4">
          ¡Completa tareas para ganar puntos y cuidar a tu dragón!
        </div>
      </div>
    </GameCard>
  );
};
