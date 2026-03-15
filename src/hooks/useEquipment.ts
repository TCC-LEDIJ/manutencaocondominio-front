import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { equipmentService } from '../services/equipment.service'

export function useEquipmentList(condominiumId: string) {
  return useQuery({
    queryKey: ['equipment', condominiumId],
    queryFn: () => equipmentService.findAll(condominiumId),
  })
}

export function useEquipmentDetail(id: string) {
  return useQuery({
    queryKey: ['equipment-detail', id],
    queryFn: () => equipmentService.findOne(id),
    enabled: Boolean(id),
  })
}

export function useDashboardOverview(condominiumId: string) {
  return useQuery({
    queryKey: ['dashboard-overview', condominiumId],
    queryFn: () => equipmentService.getDashboardOverview(condominiumId),
    enabled: Boolean(condominiumId),
  })
}

export function useCreateEquipment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: equipmentService.create,
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['equipment', variables.condominiumId] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard-overview', variables.condominiumId] })
      void queryClient.invalidateQueries({ queryKey: ['upcoming-chart', variables.condominiumId] })
    },
  })
}