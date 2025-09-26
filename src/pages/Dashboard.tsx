import React, { useState, useEffect } from 'react';
import { LogOut, Trophy, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import type { Task, CreateTaskRequest } from '../types/api';
import { TaskStatus } from '../types/api';
import { GameButton, GameCard } from '../components/GameComponents';
import { TaskForm } from '../components/TaskForm';
import { TaskCard } from '../components/TaskCard';
import { PetComponent } from '../components/PetComponent';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [petRefreshTrigger, setPetRefreshTrigger] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      await loadTasks();
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await apiService.getTasks();
      setTasks(tasksData);
      calculatePoints(tasksData);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePoints = (tasksData: Task[]) => {
    const completedTasks = tasksData.filter(task => task.status === TaskStatus.DONE);
    const points = completedTasks.reduce((total, task) => {
      const pointsValue = task.priority === 'HIGH' ? 20 : task.priority === 'MEDIUM' ? 15 : 10;
      return total + pointsValue;
    }, 0);
    setTotalPoints(points);
  };

  const handleCreateTask = async (taskData: CreateTaskRequest) => {
    try {
      setLoading(true);
      await apiService.createTask(taskData);
      await loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: number, status: TaskStatus) => {
    try {
      setLoading(true);
      const task = tasks.find(t => t.taskId === taskId);
      
      // If task is being marked as complete, award points and XP
      if (status === TaskStatus.DONE && task && task.status !== TaskStatus.DONE) {
        const pointsValue = task.priority === 'HIGH' ? 20 : task.priority === 'MEDIUM' ? 15 : 10;
        const xpValue = task.priority === 'HIGH' ? 20 : task.priority === 'MEDIUM' ? 10 : 5;
        
        // Award points
        await apiService.addPointsToPet({
          amount: pointsValue,
          reason: `Completar tarea: ${task.description}`
        });
        
          console.log("pasa");
        // Award XP
        await apiService.addExperienceToPet(xpValue);
      }
      await apiService.updateTaskStatus(taskId, status);
      await loadTasks();
      
      // Trigger pet refresh if task was completed
      if (status === TaskStatus.DONE) {
        setPetRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      setLoading(true);
      await apiService.deleteTask(taskId);
      await loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Ejecutar logout inmediatamente
    logout();
    navigate("/login")
    // La redirección se maneja automáticamente en el AuthContext
  };

  const pendingTasks = tasks.filter(task => task.status === TaskStatus.TODO);
  const completedTasks = tasks.filter(task => task.status === TaskStatus.DONE);
  const archivedTasks = tasks.filter(task => task.status === TaskStatus.ARCHIVED);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="game-title text-4xl md:text-6xl font-bold mb-2">
              MOMENTUM
            </h1>
            <p className="text-cyan-300 text-lg">
              ¡Bienvenido de vuelta, {user?.name}! 🎮
            </p>
          </div>
          <GameButton onClick={handleLogout} variant="danger" className='flex'>
            <LogOut size={20} className="mr-2" />
            Salir
          </GameButton>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GameCard className="text-center">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-400">{totalPoints}</div>
                <div className="text-sm text-cyan-300">Puntos Totales</div>
              </GameCard>
              <GameCard className="text-center">
                <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-400">{pendingTasks.length}</div>
                <div className="text-sm text-cyan-300">Misiones Pendientes</div>
              </GameCard>
              <GameCard className="text-center">
                <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">{completedTasks.length}</div>
                <div className="text-sm text-cyan-300">Misiones Completadas</div>
              </GameCard>
            </div>

            {/* Task Form */}
            {showTaskForm && (
              <TaskForm
                onSubmit={handleCreateTask}
                onCancel={() => setShowTaskForm(false)}
                loading={loading}
              />
            )}

            {/* Add Task Button */}
            {!showTaskForm && (
              <GameButton
                onClick={() => setShowTaskForm(true)}
                className="w-full py-4 text-lg"
              >
                🚀 Nueva Misión
              </GameButton>
            )}

            {/* Tasks Lists */}
            {pendingTasks.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-cyan-300 flex items-center gap-2">
                  ⚡ Misiones Activas ({pendingTasks.length})
                </h2>
                <div className="space-y-4">
                  {pendingTasks.map(task => (
                    <TaskCard
                      key={task.taskId}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDeleteTask}
                      loading={loading}
                    />
                  ))}
                </div>
              </div>
            )}

            {completedTasks.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
                  ✅ Misiones Completadas ({completedTasks.length})
                </h2>
                <div className="space-y-4">
                  {completedTasks.map(task => (
                    <TaskCard
                      key={task.taskId}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDeleteTask}
                      loading={loading}
                    />
                  ))}
                </div>
              </div>
            )}

            {archivedTasks.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-400 flex items-center gap-2">
                  📦 Archivo ({archivedTasks.length})
                </h2>
                <div className="space-y-4">
                  {archivedTasks.map(task => (
                    <TaskCard
                      key={task.taskId}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDeleteTask}
                      loading={loading}
                    />
                  ))}
                </div>
              </div>
            )}

            {tasks.length === 0 && !loading && (
              <GameCard className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-cyan-300 mb-2">
                  ¡Comienza tu aventura!
                </h3>
                <p className="text-gray-400 mb-4">
                  Crea tu primera misión y comienza a ganar puntos para cuidar a tu mascota.
                </p>
                <GameButton onClick={() => setShowTaskForm(true)}>
                  🚀 Crear Primera Misión
                </GameButton>
              </GameCard>
            )}
          </div>

          {/* Right Column - Pet */}
          <div className="space-y-6">
            <PetComponent 
              onPointsChange={(points) => setTotalPoints(points)} 
              refreshTrigger={petRefreshTrigger}
            />
            
            <GameCard>
              <h3 className="text-lg font-bold text-cyan-300 mb-3">🎮 Sistema de Recompensas</h3>
              <div className="space-y-2 text-sm">
                <div className="text-cyan-100">
                  <div className="flex justify-between">
                    <span>🟢 Misión Fácil:</span>
                    <span>10 pts + 5 XP</span>
                  </div>
                </div>
                <div className="text-cyan-100">
                  <div className="flex justify-between">
                    <span>🟡 Misión Media:</span>
                    <span>15 pts + 10 XP</span>
                  </div>
                </div>
                <div className="text-cyan-100">
                  <div className="flex justify-between">
                    <span>🔴 Misión Difícil:</span>
                    <span>20 pts + 20 XP</span>
                  </div>
                </div>
                <hr className="border-gray-600 my-2" />
                <div className="text-gray-400 text-xs">
                  <div className="text-yellow-400">Puntos:</div> Gastables para cuidar a tu dragón
                </div>
                <div className="text-gray-400 text-xs">
                  <div className="text-green-400">Experiencia:</div> Permanente para subir de nivel
                </div>
              </div>
            </GameCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
