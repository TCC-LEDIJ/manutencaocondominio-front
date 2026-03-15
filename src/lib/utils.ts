import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type {
  AlertTrigger,
  EquipmentHealthStatus,
  EquipmentType,
  Inspection,
  MaintenanceType,
} from '../types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const equipmentTypeLabels: Record<EquipmentType, string> = {
  ELEVATOR: 'Elevador',
  LIGHTNING_ROD: 'Para-raios',
  WATER_TANK: 'Caixa d\'água',
  OTHER: 'Outro',
}

export const maintenanceTypeLabels: Record<MaintenanceType, string> = {
  ROUTINE: 'Rotina',
  PREVENTIVE: 'Preventiva',
  CORRECTIVE: 'Corretiva',
}

export const alertTriggerLabels: Record<AlertTrigger, string> = {
  DAYS_15_BEFORE: 'D-15',
  DAYS_7_BEFORE: 'D-7',
  DAILY_REMINDER: 'Lembrete diário',
}

export const equipmentStatusLabels: Record<EquipmentHealthStatus, string> = {
  UP_TO_DATE: 'em dia',
  EXPIRING_SOON: 'vencendo',
  OVERDUE: 'vencido',
}

export const equipmentStatusClasses: Record<EquipmentHealthStatus, string> = {
  UP_TO_DATE: 'border-status-success/25 bg-status-success/10 text-status-success',
  EXPIRING_SOON: 'border-status-warning/25 bg-status-warning/10 text-status-warning',
  OVERDUE: 'border-status-danger/25 bg-status-danger/10 text-status-danger',
}

export function formatDate(date: string | null, options?: Intl.DateTimeFormatOptions) {
  if (!date) {
    return '—'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(new Date(date))
}

export function formatShortDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(date))
}

export function getDaysUntil(date: string) {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const targetDate = new Date(date)
  targetDate.setHours(0, 0, 0, 0)

  const diffMs = targetDate.getTime() - startOfToday.getTime()
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

export function getEquipmentStatusFromInspection(inspection: Inspection | null): EquipmentHealthStatus {
  if (!inspection) {
    return 'UP_TO_DATE'
  }

  const daysUntil = getDaysUntil(inspection.scheduledDate)

  if (inspection.status === 'OVERDUE' || daysUntil < 0) {
    return 'OVERDUE'
  }

  if (daysUntil <= 7) {
    return 'EXPIRING_SOON'
  }

  return 'UP_TO_DATE'
}

export function getHealthLabel(score: number): 'Crítico' | 'Regular' | 'Bom' | 'Excelente' {
  if (score < 40) {
    return 'Crítico'
  }

  if (score < 70) {
    return 'Regular'
  }

  if (score < 90) {
    return 'Bom'
  }

  return 'Excelente'
}

export function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function addDays(baseDate: Date, amount: number) {
  const nextDate = new Date(baseDate)
  nextDate.setDate(nextDate.getDate() + amount)
  return nextDate
}

export function calculateHealthScore(totalEquipment: number, upToDate: number) {
  if (totalEquipment === 0) {
    return 0
  }

  return Math.round((upToDate / totalEquipment) * 100)
}