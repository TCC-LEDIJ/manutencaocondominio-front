export type Role = 'MANAGER' | 'RESIDENT'

export type EquipmentType = 'ELEVATOR' | 'LIGHTNING_ROD' | 'WATER_TANK' | 'OTHER'

export type MaintenanceType = 'ROUTINE' | 'PREVENTIVE' | 'CORRECTIVE'

export type InspectionStatus = 'SCHEDULED' | 'DONE' | 'OVERDUE'

export type AlertTrigger = 'DAYS_15_BEFORE' | 'DAYS_7_BEFORE' | 'DAILY_REMINDER'

export type AlertStatus = 'PENDING' | 'SENT' | 'FAILED'

export type EquipmentHealthStatus = 'UP_TO_DATE' | 'EXPIRING_SOON' | 'OVERDUE'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  condominiumId: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface AuthState {
  user: AuthUser | null
  condominiumId: string | null
  role: Role | null
  token: string | null
}

export interface MaintenancePlan {
  id: string
  equipmentId: string
  type: MaintenanceType
  frequencyDays: number
  description: string
  isCustomized: boolean
}

export interface Equipment {
  id: string
  name: string
  type: EquipmentType
  condominiumId: string
  maintenancePlans: MaintenancePlan[]
}

export interface Document {
  id: string
  inspectionId: string
  fileName: string
  url: string
  mimeType: string
}

export interface Inspection {
  id: string
  maintenancePlanId: string
  scheduledDate: string
  executedAt: string | null
  executedById: string | null
  status: InspectionStatus
  notes: string | null
  documents: Document[]
}

export interface InspectionWithMeta extends Inspection {
  executedByName: string | null
}

export interface Alert {
  id: string
  inspectionId: string
  trigger: AlertTrigger
  status: AlertStatus
  sentAt: string | null
}

export interface EquipmentSummary extends Equipment {
  currentStatus: EquipmentHealthStatus
  nextInspection: Inspection | null
  lastCompletedInspection: Inspection | null
}

export interface EquipmentDetails extends EquipmentSummary {
  inspectionHistory: InspectionWithMeta[]
}

export interface DashboardMetrics {
  totalEquipment: number
  upToDate: number
  expiringSoon: number
  overdue: number
  healthScore: number
  healthLabel: 'Crítico' | 'Regular' | 'Bom' | 'Excelente'
}

export interface DashboardOverview {
  condominiumName: string
  metrics: DashboardMetrics
  equipment: EquipmentSummary[]
}

export interface DashboardChartDatum {
  dateLabel: string
  agendadas: number
  concluidas: number
  vencidas: number
}

export interface RecentAlert extends Alert {
  equipmentName: string
  inspectionDate: string
}

export interface Condominium {
  id: string
  name: string
}

export interface AuthPayload {
  token: string
  user: AuthUser
  role: Role
  condominiumId: string
}