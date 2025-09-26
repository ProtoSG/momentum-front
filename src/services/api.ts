import type { AuthResponse, Task, CreateTaskRequest, TaskStatusUpdate, Pet, CreatePetRequest, PointsLedger, PetLevel } from '../types/api';
import { TaskStatus } from '../types/api';

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  timezone?: string;
  locale?: string;
  dayStartHour?: number;
}

const API_BASE_URL = 'https://momentum-back.onrender.com/api';

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const res = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!res.ok) {
      // lee body UNA vez como texto por si quieres mostrarlo
      const errText = await res.text().catch(() => '');
      if (res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userEmail');
        window.location.href = '/login';
      }
      throw new Error(`HTTP ${res.status} ${res.statusText}${errText ? ` - ${errText}` : ''}`);
    }

    // 204/205: no content
    if (res.status === 204 || res.status === 205) {
      return undefined as T;
    }

    // lee el body SOLO una vez
    const text = await res.text();

    if (!text) return undefined as T;

    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      return JSON.parse(text) as T;
    }

    // si el backend no devuelve JSON, no intentes parsear
    return undefined as T;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    return this.makeRequest<void>('/auth/logout', {
      method: 'POST',
    });
  }

  async getTasks(): Promise<Task[]> {
    return this.makeRequest<Task[]>('/task');
  }

  async createTask(task: CreateTaskRequest): Promise<Task> {
    return this.makeRequest<Task>('/task', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(taskId: number, task: Partial<Task>): Promise<Task> {
    return this.makeRequest<Task>(`/task/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  }

  async updateTaskStatus(taskId: number, status: TaskStatus): Promise<Task> {
    const statusUpdate: TaskStatusUpdate = { status };
    return this.makeRequest<Task>(`/task/state/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(statusUpdate),
    });
  }

  async deleteTask(taskId: number): Promise<void> {
    return this.makeRequest<void>(`/task/${taskId}`, {
      method: 'DELETE',
    });
  }

  async createPet(pet: CreatePetRequest): Promise<Pet> {
    return this.makeRequest<Pet>('/pet', {
      method: 'POST',
      body: JSON.stringify(pet),
    });
  }

  async getPet(): Promise<Pet> {
    return this.makeRequest<Pet>('/pet');
  }

  async addPointsToPet(pointsData: PointsLedger): Promise<void> {
    return this.makeRequest<void>('/pet/points', {
      method: 'POST',
      body: JSON.stringify(pointsData),
    });
  }

  async addExperienceToPet(amount: number): Promise<Pet> {
    return this.makeRequest<Pet>('/pet/experience', {
      method: 'POST',
      body: amount.toString(),
    });
  }

  async feedPet(): Promise<Pet> {
    return this.makeRequest<Pet>('/pet/feed', {
      method: 'POST',
    });
  }

  async healPet(): Promise<Pet> {
    return this.makeRequest<Pet>('/pet/heal', {
      method: 'POST',
    });
  }

  async boostPetEnergy(): Promise<Pet> {
    return this.makeRequest<Pet>('/pet/boost-energy', {
      method: 'POST',
    });
  }

  async getPetLevels(): Promise<PetLevel[]> {
    return this.makeRequest<PetLevel[]>('/pet-levels');
  }
}

export const apiService = new ApiService();
