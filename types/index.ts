export interface Vehicle {
  id: string;
  photo?: string;
  nickname: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  vin?: string;
  fuelType: string;
  engineType?: string; // e.g., V6, Inline 4, EV
  currentMileage: number;
  purchaseDate: string;
  createdAt: string;
  isDefault: boolean;
  healthScore?: number; // 0-100 calculated score
  lastMileageUpdate?: string; // ISO date of last odometer update
}

export type ServiceType = 
  | 'Oil Change' 
  | 'Air Filter' 
  | 'Fuel Filter' 
  | 'Brake Pads' 
  | 'Brake Fluid' 
  | 'Tire Rotation' 
  | 'Tire Replacement' 
  | 'Battery' 
  | 'Spark Plugs' 
  | 'Transmission' 
  | 'Coolant' 
  | 'Custom';

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  serviceType: ServiceType | string;
  date: string;
  mileage: number;
  cost: number;
  serviceProvider?: string;
  notes?: string;
  receiptImage?: string; // URI to locally stored image
  nextDueDate?: string;
  nextDueMileage?: number;
}

export interface Expense {
  id: string;
  vehicleId: string;
  category: string;
  amount: number;
  date: string;
  mileage: number;
  notes?: string;
  receiptImage?: string;
}

export interface Reminder {
  id: string;
  vehicleId: string;
  title: string;
  description?: string;
  dueDate?: string;
  dueMileage?: number;
  notificationEnabled: boolean;
  completed: boolean;
  notificationId?: string; // For expo-notifications tracking
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  date: string;
  pricePerUnit: number;
  totalCost: number;
  quantity: number; // liters/gallons
  mileage: number;
  isFullFill?: boolean;
}

export type DocumentType = 'Insurance' | 'Registration' | 'Invoice' | 'Inspection' | 'Other';

export interface Document {
  id: string;
  vehicleId: string;
  title: string;
  type: DocumentType;
  uri: string; // Local file URI
  dateAdded: string;
  expiryDate?: string;
  notificationId?: string;
}
