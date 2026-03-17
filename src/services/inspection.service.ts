import { completeInspection, getUpcomingInspectionChart } from './mock-store'

export const inspectionService = {
  markDone: completeInspection,
  getUpcomingChart: getUpcomingInspectionChart,
}