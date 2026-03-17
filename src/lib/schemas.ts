import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Informe um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter ao menos 6 caracteres'),
})

export const registerSchema = z.object({
  name: z.string().min(3, 'Informe o nome completo'),
  email: z.email('Informe um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter ao menos 6 caracteres'),
  role: z.enum(['MANAGER', 'RESIDENT']),
})

export const addEquipmentSchema = z.object({
  name: z.string().min(1, 'Informe o nome do equipamento'),
  type: z.enum(['ELEVATOR', 'LIGHTNING_ROD', 'WATER_TANK', 'OTHER']),
  frequencyDays: z.number().int().positive('A frequência deve ser positiva'),
  maintenanceType: z.enum(['ROUTINE', 'PREVENTIVE', 'CORRECTIVE']),
  description: z.string().min(3, 'Descreva o plano de manutenção'),
})

export const markInspectionDoneSchema = z.object({
  executedAt: z.string().min(1, 'Informe a data de execução'),
  notes: z.string().max(500, 'Use até 500 caracteres').optional(),
  document: z
    .custom<FileList | undefined>()
    .refine(
      (fileList) =>
        !fileList || fileList.length === 0 || fileList[0]?.type === 'application/pdf',
      'Envie um arquivo PDF',
    )
    .optional(),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type AddEquipmentFormValues = z.infer<typeof addEquipmentSchema>
export type MarkInspectionDoneFormValues = z.infer<typeof markInspectionDoneSchema>