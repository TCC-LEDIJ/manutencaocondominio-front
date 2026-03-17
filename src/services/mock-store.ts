import { createInitialMockDatabase, type MockDatabase } from '../data/mockData'
import {
  calculateHealthScore,
  formatShortDate,
  getEquipmentStatusFromInspection,
  getHealthLabel,
} from '../lib/utils'
import type {
  AuthPayload,
  AuthUser,
  DashboardChartDatum,
  DashboardOverview,
  Equipment,
  EquipmentDetails,
  EquipmentSummary,
  RecentAlert,
  Role,
} from '../types'

type CreateEquipmentInput = {
  condominiumId: string
  name: string
  type: Equipment['type']
  frequencyDays: number
  maintenanceType: Equipment['maintenancePlans'][number]['type']
  description: string
}

type MarkInspectionDoneInput = {
  inspectionId: string
  executedAt: string
  executedById: string
  notes?: string
  documentFile?: File
}

let database = createInitialMockDatabase()

function delay<T>(factory: () => T, timeout = 180) {
  return new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(factory()), timeout)
  })
}

function getEquipmentInspections(equipmentId: string) {
  const equipment = database.equipment.find((item) => item.id === equipmentId)

  if (!equipment) {
    return []
  }

  const planIds = new Set(equipment.maintenancePlans.map((plan) => plan.id))
  return database.inspections.filter((inspection) => planIds.has(inspection.maintenancePlanId))
}

function getNextInspection(equipmentId: string) {
  return getEquipmentInspections(equipmentId)
    .filter((inspection) => inspection.status !== 'DONE')
    .sort(
      (leftInspection, rightInspection) =>
        new Date(leftInspection.scheduledDate).getTime() -
        new Date(rightInspection.scheduledDate).getTime(),
    )[0] ?? null
}

function getLastCompletedInspection(equipmentId: string) {
  return getEquipmentInspections(equipmentId)
    .filter((inspection) => inspection.status === 'DONE' && inspection.executedAt)
    .sort(
      (leftInspection, rightInspection) =>
        new Date(rightInspection.executedAt ?? 0).getTime() -
        new Date(leftInspection.executedAt ?? 0).getTime(),
    )[0] ?? null
}

function mapEquipmentSummary(equipment: Equipment): EquipmentSummary {
  const nextInspection = getNextInspection(equipment.id)

  return {
    ...equipment,
    currentStatus: getEquipmentStatusFromInspection(nextInspection),
    nextInspection,
    lastCompletedInspection: getLastCompletedInspection(equipment.id),
  }
}

function getAuthUser(userId: string): AuthUser {
  const user = database.users.find((entry) => entry.id === userId)

  if (!user) {
    throw new Error('Usuário não encontrado')
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}

function createAuthPayload(userId: string, role: Role, condominiumId: string): AuthPayload {
  return {
    token: `mock-token-${userId}`,
    user: getAuthUser(userId),
    role,
    condominiumId,
  }
}

function ensureEquipment(equipmentId: string) {
  const equipment = database.equipment.find((entry) => entry.id === equipmentId)

  if (!equipment) {
    throw new Error('Equipamento não encontrado')
  }

  return equipment
}

function ensureInspection(inspectionId: string) {
  const inspection = database.inspections.find((entry) => entry.id === inspectionId)

  if (!inspection) {
    throw new Error('Inspeção não encontrada')
  }

  return inspection
}

function getOverview(condominiumId: string): DashboardOverview {
  const equipment = database.equipment
    .filter((item) => item.condominiumId === condominiumId)
    .map(mapEquipmentSummary)

  const upToDate = equipment.filter((item) => item.currentStatus === 'UP_TO_DATE').length
  const expiringSoon = equipment.filter((item) => item.currentStatus === 'EXPIRING_SOON').length
  const overdue = equipment.filter((item) => item.currentStatus === 'OVERDUE').length
  const healthScore = calculateHealthScore(equipment.length, upToDate)

  return {
    condominiumName: database.condominium.name,
    metrics: {
      totalEquipment: equipment.length,
      upToDate,
      expiringSoon,
      overdue,
      healthScore,
      healthLabel: getHealthLabel(healthScore),
    },
    equipment,
  }
}

export function login(email: string, password: string) {
  return delay(() => {
    const user = database.users.find(
      (entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password,
    )

    if (!user) {
      throw new Error('Credenciais inválidas')
    }

    return createAuthPayload(user.id, user.role, user.condominiumId)
  })
}

export function registerUser(input: {
  name: string
  email: string
  password: string
  role: Role
}) {
  return delay(() => {
    const existingUser = database.users.find(
      (entry) => entry.email.toLowerCase() === input.email.toLowerCase(),
    )

    if (existingUser) {
      throw new Error('Já existe um usuário com esse e-mail')
    }

    const userId = crypto.randomUUID()
    database.users.push({
      id: userId,
      name: input.name,
      email: input.email,
      password: input.password,
      role: input.role,
      condominiumId: database.condominium.id,
    })

    return createAuthPayload(userId, input.role, database.condominium.id)
  })
}

export function getEquipmentList(condominiumId: string) {
  return delay(() =>
    database.equipment
      .filter((item) => item.condominiumId === condominiumId)
      .map(mapEquipmentSummary)
      .sort((leftItem, rightItem) => leftItem.name.localeCompare(rightItem.name)),
  )
}

export function getEquipmentDetail(equipmentId: string) {
  return delay(() => {
    const equipment = ensureEquipment(equipmentId)
    const summary = mapEquipmentSummary(equipment)
    const inspectionHistory = getEquipmentInspections(equipmentId).sort(
      (leftInspection, rightInspection) =>
        new Date(rightInspection.scheduledDate).getTime() -
        new Date(leftInspection.scheduledDate).getTime(),
    )

    return {
      ...summary,
      inspectionHistory,
    } satisfies EquipmentDetails
  })
}

export function createEquipment(input: CreateEquipmentInput) {
  return delay(() => {
    const equipmentId = crypto.randomUUID()
    const planId = crypto.randomUUID()

    const nextEquipment = {
      id: equipmentId,
      name: input.name,
      type: input.type,
      condominiumId: input.condominiumId,
      maintenancePlans: [
        {
          id: planId,
          equipmentId,
          type: input.maintenanceType,
          frequencyDays: input.frequencyDays,
          description: input.description,
          isCustomized: false,
        },
      ],
    } satisfies Equipment

    database.equipment.push(nextEquipment)
    database.inspections.push({
      id: crypto.randomUUID(),
      maintenancePlanId: planId,
      scheduledDate: new Date(Date.now() + input.frequencyDays * 24 * 60 * 60 * 1000).toISOString(),
      executedAt: null,
      executedById: null,
      executedByName: null,
      status: 'SCHEDULED',
      notes: 'Primeira inspeção gerada automaticamente pelo cadastro.',
      documents: [],
    })

    return mapEquipmentSummary(nextEquipment)
  })
}

export function getEquipmentDashboard(condominiumId: string) {
  return delay(() => getOverview(condominiumId))
}

export function getUpcomingInspectionChart(condominiumId: string) {
  return delay(() => {
    const planIds = new Set(
      database.equipment
        .filter((equipment) => equipment.condominiumId === condominiumId)
        .flatMap((equipment) => equipment.maintenancePlans.map((plan) => plan.id)),
    )

    const nextThirtyDays = new Date()
    nextThirtyDays.setDate(nextThirtyDays.getDate() + 30)

    const grouped = new Map<string, DashboardChartDatum>()

    database.inspections
      .filter((inspection) => planIds.has(inspection.maintenancePlanId))
      .filter((inspection) => new Date(inspection.scheduledDate) <= nextThirtyDays)
      .forEach((inspection) => {
        const key = formatShortDate(inspection.scheduledDate)
        const current =
          grouped.get(key) ?? {
            dateLabel: key,
            agendadas: 0,
            concluidas: 0,
            vencidas: 0,
          }

        if (inspection.status === 'DONE') {
          current.concluidas += 1
        } else if (inspection.status === 'OVERDUE') {
          current.vencidas += 1
        } else {
          current.agendadas += 1
        }

        grouped.set(key, current)
      })

    return [...grouped.values()].sort((leftItem, rightItem) => {
      const [leftDay, leftMonth] = leftItem.dateLabel.split('/')
      const [rightDay, rightMonth] = rightItem.dateLabel.split('/')
      return Number(leftMonth + leftDay) - Number(rightMonth + rightDay)
    })
  })
}

export function getRecentAlerts(condominiumId: string) {
  return delay(() => {
    const summaries = database.equipment
      .filter((equipment) => equipment.condominiumId === condominiumId)
      .map(mapEquipmentSummary)

    const inspectionToEquipment = new Map<string, string>()
    summaries.forEach((equipment) => {
      getEquipmentInspections(equipment.id).forEach((inspection) => {
        inspectionToEquipment.set(inspection.id, equipment.name)
      })
    })

    return database.alerts
      .map((alert) => {
        const inspection = ensureInspection(alert.inspectionId)
        return {
          ...alert,
          equipmentName: inspectionToEquipment.get(alert.inspectionId) ?? 'Equipamento',
          inspectionDate: inspection.scheduledDate,
        } satisfies RecentAlert
      })
      .sort(
        (leftAlert, rightAlert) =>
          new Date(rightAlert.sentAt ?? 0).getTime() - new Date(leftAlert.sentAt ?? 0).getTime(),
      )
  })
}

export function completeInspection(input: MarkInspectionDoneInput) {
  return delay(() => {
    const inspection = ensureInspection(input.inspectionId)
    const user = database.users.find((entry) => entry.id === input.executedById)

    if (!user) {
      throw new Error('Usuário executor não encontrado')
    }

    inspection.executedAt = new Date(input.executedAt).toISOString()
    inspection.executedById = user.id
    inspection.executedByName = user.name
    inspection.notes = input.notes?.trim() || null
    inspection.status = 'DONE'

    if (input.documentFile) {
      inspection.documents.push({
        id: crypto.randomUUID(),
        inspectionId: inspection.id,
        fileName: input.documentFile.name,
        url: URL.createObjectURL(input.documentFile),
        mimeType: input.documentFile.type || 'application/pdf',
      })
    }

    const equipment = database.equipment.find((entry) =>
      entry.maintenancePlans.some((plan) => plan.id === inspection.maintenancePlanId),
    )

    if (!equipment) {
      throw new Error('Equipamento da inspeção não encontrado')
    }

    const plan = equipment.maintenancePlans.find((entry) => entry.id === inspection.maintenancePlanId)

    if (!plan) {
      throw new Error('Plano de manutenção não encontrado')
    }

    const nextInspectionDate = new Date(input.executedAt)
    nextInspectionDate.setDate(nextInspectionDate.getDate() + plan.frequencyDays)

    database.inspections.push({
      id: crypto.randomUUID(),
      maintenancePlanId: inspection.maintenancePlanId,
      scheduledDate: nextInspectionDate.toISOString(),
      executedAt: null,
      executedById: null,
      executedByName: null,
      status: 'SCHEDULED',
      notes: 'Próxima manutenção gerada após a conclusão da inspeção.',
      documents: [],
    })

    database.alerts.unshift({
      id: crypto.randomUUID(),
      inspectionId: inspection.id,
      trigger: 'DAILY_REMINDER',
      status: 'SENT',
      sentAt: new Date().toISOString(),
    })

    return mapEquipmentSummary(equipment)
  })
}

export function getCondominiumName() {
  return database.condominium.name
}

export function resetMockStore(nextDatabase?: MockDatabase) {
  database = nextDatabase ?? createInitialMockDatabase()
}