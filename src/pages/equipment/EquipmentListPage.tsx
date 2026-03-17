import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { EquipmentTable } from '../../components/EquipmentTable'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { Textarea } from '../../components/ui/textarea'
import { useAuth } from '../../context/AuthContext'
import { addEquipmentSchema, type AddEquipmentFormValues } from '../../lib/schemas'
import { useCreateEquipment, useEquipmentList } from '../../hooks/useEquipment'

export function EquipmentListPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { condominiumId } = useAuth()
  const equipmentQuery = useEquipmentList(condominiumId ?? '')
  const createEquipmentMutation = useCreateEquipment()

  const form = useForm<AddEquipmentFormValues>({
    resolver: zodResolver(addEquipmentSchema),
    defaultValues: {
      name: '',
      type: 'ELEVATOR',
      frequencyDays: 30,
      maintenanceType: 'PREVENTIVE',
      description: '',
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!condominiumId) {
      return
    }

    await createEquipmentMutation.mutateAsync({
      condominiumId,
      ...values,
    })

    form.reset()
    setIsDialogOpen(false)
  })

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Cadastro operacional</p>
          <h1 className="text-3xl md:text-4xl">Equipamentos</h1>
          <p className="text-muted-foreground">Acompanhe status, próximos vencimentos e detalhe de cada plano de manutenção.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Novo equipamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar equipamento</DialogTitle>
              <DialogDescription>Cria o equipamento, o plano e a primeira inspeção programada.</DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex.: Elevador Torre B" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo do equipamento</FormLabel>
                      <FormControl>
                        <Select {...field}>
                          <option value="ELEVATOR">ELEVATOR</option>
                          <option value="LIGHTNING_ROD">LIGHTNING_ROD</option>
                          <option value="WATER_TANK">WATER_TANK</option>
                          <option value="OTHER">OTHER</option>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="frequencyDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequência em dias</FormLabel>
                      <FormControl>
                        <Input
                          min={1}
                          type="number"
                          value={field.value}
                          onChange={(event) => field.onChange(Number(event.target.value))}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maintenanceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de manutenção</FormLabel>
                      <FormControl>
                        <Select {...field}>
                          <option value="ROUTINE">ROUTINE</option>
                          <option value="PREVENTIVE">PREVENTIVE</option>
                          <option value="CORRECTIVE">CORRECTIVE</option>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Ex.: inspeção visual, teste funcional e emissão de laudo." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {createEquipmentMutation.isError ? (
                  <p className="md:col-span-2 text-sm font-medium text-status-danger">{createEquipmentMutation.error.message}</p>
                ) : null}

                <DialogFooter className="md:col-span-2">
                  <Button type="submit" disabled={createEquipmentMutation.isPending}>
                    {createEquipmentMutation.isPending ? 'Salvando...' : 'Salvar equipamento'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Base de equipamentos</CardTitle>
          <CardDescription>Tabela completa com data da próxima inspeção e status atual.</CardDescription>
        </CardHeader>
        <CardContent>
          {equipmentQuery.isLoading ? <p className="text-sm text-muted-foreground">Carregando equipamentos...</p> : null}
          {equipmentQuery.isError ? <p className="text-sm text-status-danger">Não foi possível carregar os equipamentos.</p> : null}
          {equipmentQuery.data ? <EquipmentTable equipment={equipmentQuery.data} /> : null}
        </CardContent>
      </Card>
    </div>
  )
}