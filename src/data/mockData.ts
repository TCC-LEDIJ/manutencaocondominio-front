import type {
  Alert,
  Condominium,
  Equipment,
  InspectionWithMeta,
  User,
} from '../types'
import { addDays } from '../lib/utils'

export interface MockUserRecord extends User {
  password: string
}

export interface MockDatabase {
  condominium: Condominium
  users: MockUserRecord[]
  equipment: Equipment[]
  inspections: InspectionWithMeta[]
  alerts: Alert[]
}

function createId(prefix: string, suffix: string) {
  return `${prefix}-${suffix}`
}

function createDocument(inspectionId: string, fileName: string) {
  return {
    id: crypto.randomUUID(),
    inspectionId,
    fileName,
    url: '#',
    mimeType: 'application/pdf',
  }
}

function createDoneInspection(
  inspectionId: string,
  maintenancePlanId: string,
  scheduledOffset: number,
  executedOffset: number,
  executedById: string,
  executedByName: string,
  documentName: string,
) {
  return {
    id: inspectionId,
    maintenancePlanId,
    scheduledDate: addDays(new Date(), scheduledOffset).toISOString(),
    executedAt: addDays(new Date(), executedOffset).toISOString(),
    executedById,
    executedByName,
    status: 'DONE' as const,
    notes: 'Vistoria concluída com checklist aprovado.',
    documents: [createDocument(inspectionId, documentName)],
  }
}

function createOpenInspection(
  inspectionId: string,
  maintenancePlanId: string,
  scheduledOffset: number,
  status: 'SCHEDULED' | 'OVERDUE',
  notes: string,
) {
  return {
    id: inspectionId,
    maintenancePlanId,
    scheduledDate: addDays(new Date(), scheduledOffset).toISOString(),
    executedAt: null,
    executedById: null,
    executedByName: null,
    status,
    notes,
    documents: [],
  }
}

export function createInitialMockDatabase(): MockDatabase {
  const condominiumId = 'cond-park-flores'
  const managerId = 'user-manager-01'
  const residentId = 'user-resident-01'

  const condominium: Condominium = {
    id: condominiumId,
    name: 'Condomínio Parque das Flores',
  }

  const users: MockUserRecord[] = [
    {
      id: managerId,
      name: 'Carlos Mendes',
      email: 'manager@safecondo.app',
      password: 'safecondo123',
      role: 'MANAGER',
      condominiumId,
    },
    {
      id: residentId,
      name: 'Marina Souza',
      email: 'resident@safecondo.app',
      password: 'safecondo123',
      role: 'RESIDENT',
      condominiumId,
    },
  ]

  const equipment: Equipment[] = [
    {
      id: createId('equipment', 'elevador-social-a'),
      name: 'Elevador Social A',
      type: 'ELEVATOR',
      condominiumId,
      maintenancePlans: [
        {
          id: createId('plan', 'elevador-social-a'),
          equipmentId: createId('equipment', 'elevador-social-a'),
          type: 'PREVENTIVE',
          frequencyDays: 30,
          description: 'Inspeção mensal de segurança e desempenho.',
          isCustomized: false,
        },
      ],
    },
    {
      id: createId('equipment', 'elevador-social-b'),
      name: 'Elevador Social B',
      type: 'ELEVATOR',
      condominiumId,
      maintenancePlans: [
        {
          id: createId('plan', 'elevador-social-b'),
          equipmentId: createId('equipment', 'elevador-social-b'),
          type: 'PREVENTIVE',
          frequencyDays: 45,
          description: 'Rotina de checagem de cabos e casa de máquinas.',
          isCustomized: false,
        },
      ],
    },
    {
      id: createId('equipment', 'para-raios'),
      name: 'Sistema de Para-raios',
      type: 'LIGHTNING_ROD',
      condominiumId,
      maintenancePlans: [
        {
          id: createId('plan', 'para-raios'),
          equipmentId: createId('equipment', 'para-raios'),
          type: 'ROUTINE',
          frequencyDays: 180,
          description: 'Medição e laudo de SPDA semestral.',
          isCustomized: true,
        },
      ],
    },
    {
      id: createId('equipment', 'caixa-dagua'),
      name: 'Caixa d\'água principal',
      type: 'WATER_TANK',
      condominiumId,
      maintenancePlans: [
        {
          id: createId('plan', 'caixa-dagua'),
          equipmentId: createId('equipment', 'caixa-dagua'),
          type: 'ROUTINE',
          frequencyDays: 120,
          description: 'Limpeza e potabilidade da reservação.',
          isCustomized: false,
        },
      ],
    },
    {
      id: createId('equipment', 'bomba-recalque'),
      name: 'Bomba de recalque',
      type: 'OTHER',
      condominiumId,
      maintenancePlans: [
        {
          id: createId('plan', 'bomba-recalque'),
          equipmentId: createId('equipment', 'bomba-recalque'),
          type: 'CORRECTIVE',
          frequencyDays: 60,
          description: 'Verificação de pressão, vedação e rotor.',
          isCustomized: true,
        },
      ],
    },
  ]

  const inspections: InspectionWithMeta[] = [
    createDoneInspection('insp-ela-1', 'plan-elevador-social-a', -120, -120, managerId, 'Carlos Mendes', 'laudo-elevador-a-jan.pdf'),
    createDoneInspection('insp-ela-2', 'plan-elevador-social-a', -90, -90, managerId, 'Carlos Mendes', 'laudo-elevador-a-fev.pdf'),
    createDoneInspection('insp-ela-3', 'plan-elevador-social-a', -30, -29, managerId, 'Carlos Mendes', 'laudo-elevador-a-mar.pdf'),
    createOpenInspection('insp-ela-4', 'plan-elevador-social-a', 18, 'SCHEDULED', 'Próxima vistoria preventiva agendada.'),

    createDoneInspection('insp-elb-1', 'plan-elevador-social-b', -180, -180, managerId, 'Carlos Mendes', 'laudo-elevador-b-out.pdf'),
    createDoneInspection('insp-elb-2', 'plan-elevador-social-b', -120, -119, managerId, 'Carlos Mendes', 'laudo-elevador-b-dez.pdf'),
    createDoneInspection('insp-elb-3', 'plan-elevador-social-b', -45, -44, managerId, 'Carlos Mendes', 'laudo-elevador-b-fev.pdf'),
    createOpenInspection('insp-elb-4', 'plan-elevador-social-b', 26, 'SCHEDULED', 'Inspeção preventiva prevista para o próximo ciclo.'),

    createDoneInspection('insp-pr-1', 'plan-para-raios', -400, -399, managerId, 'Carlos Mendes', 'spda-2024.pdf'),
    createDoneInspection('insp-pr-2', 'plan-para-raios', -220, -219, managerId, 'Carlos Mendes', 'spda-2025-1.pdf'),
    createDoneInspection('insp-pr-3', 'plan-para-raios', -60, -59, managerId, 'Carlos Mendes', 'spda-2025-2.pdf'),
    createOpenInspection('insp-pr-4', 'plan-para-raios', -14, 'OVERDUE', 'Laudo semestral vencido e aguardando execução.'),

    createDoneInspection('insp-cd-1', 'plan-caixa-dagua', -420, -419, managerId, 'Carlos Mendes', 'caixa-dagua-2024.pdf'),
    createDoneInspection('insp-cd-2', 'plan-caixa-dagua', -240, -239, managerId, 'Carlos Mendes', 'caixa-dagua-2025-1.pdf'),
    createDoneInspection('insp-cd-3', 'plan-caixa-dagua', -120, -118, managerId, 'Carlos Mendes', 'caixa-dagua-2025-2.pdf'),
    createOpenInspection('insp-cd-4', 'plan-caixa-dagua', 5, 'SCHEDULED', 'Limpeza periódica próxima do vencimento.'),

    createDoneInspection('insp-br-1', 'plan-bomba-recalque', -300, -299, managerId, 'Carlos Mendes', 'bomba-2025-jan.pdf'),
    createDoneInspection('insp-br-2', 'plan-bomba-recalque', -180, -179, managerId, 'Carlos Mendes', 'bomba-2025-mar.pdf'),
    createDoneInspection('insp-br-3', 'plan-bomba-recalque', -90, -88, managerId, 'Carlos Mendes', 'bomba-2025-mai.pdf'),
    createOpenInspection('insp-br-4', 'plan-bomba-recalque', -32, 'OVERDUE', 'Equipamento aguardando corretiva priorizada.'),
  ]

  const alerts: Alert[] = [
    {
      id: 'alert-1',
      inspectionId: 'insp-pr-4',
      trigger: 'DAILY_REMINDER',
      status: 'SENT',
      sentAt: addDays(new Date(), -1).toISOString(),
    },
    {
      id: 'alert-2',
      inspectionId: 'insp-br-4',
      trigger: 'DAILY_REMINDER',
      status: 'FAILED',
      sentAt: addDays(new Date(), -2).toISOString(),
    },
    {
      id: 'alert-3',
      inspectionId: 'insp-cd-4',
      trigger: 'DAYS_7_BEFORE',
      status: 'SENT',
      sentAt: addDays(new Date(), 0).toISOString(),
    },
    {
      id: 'alert-4',
      inspectionId: 'insp-ela-4',
      trigger: 'DAYS_15_BEFORE',
      status: 'SENT',
      sentAt: addDays(new Date(), 0).toISOString(),
    },
  ]

  return {
    condominium,
    users,
    equipment,
    inspections,
    alerts,
  }
}