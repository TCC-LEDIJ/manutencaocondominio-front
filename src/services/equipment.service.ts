import { createEquipment, getEquipmentDashboard, getEquipmentDetail, getEquipmentList } from './mock-store'

export const equipmentService = {
  findAll: getEquipmentList,
  findOne: getEquipmentDetail,
  create: createEquipment,
  getDashboardOverview: getEquipmentDashboard,
}