export interface AuthResponse {
  email: string;
  token: string;
  refreshToken: string;
}

export interface User {
  userId: number;
  name: string;
  email: string;
}

export const TaskStatus = {
  TODO: 'TODO',
  DONE: 'DONE',
  ARCHIVED: 'ARCHIVED'
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export const TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
} as const;

export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority];

export interface Task {
  taskId: number;
  userId: number;
  description: string;
  status: TaskStatus;
  dueDate?: string;
  priority: TaskPriority;
  pointsValue?: number;
}

export interface CreateTaskRequest {
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
}

export interface Pet {
  petId?: number;
  userId?: number;
  name: string;
  level?: number;
  pointsTotal?: number;
  experience?: number;
  url?: string;
  health?: number;
  energy?: number;
  hunger?: number;
}

export interface CreatePetRequest {
  name: string;
  url?: string;
}

export interface PointsLedger {
  ledgerId?: number;
  userId?: number;
  petId?: number;
  amount: number;
  reason: string;
  refType?: string;
  refId?: number;
}

export interface TaskStatusUpdate {
  status: TaskStatus;
}

export interface PetLevel {
  level: number;
  experienceRequired: number;
  name: string;
  description: string;
}