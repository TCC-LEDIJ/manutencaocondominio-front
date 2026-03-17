import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, FileText, Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'

import { EquipmentStatusBadge } from '../../components/EquipmentStatusBadge'
import { InspectionHistoryTable } from '../../components/InspectionHistoryTable'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { useAuth } from '../../context/AuthContext'
import { useEquipmentDetail } from '../../hooks/useEquipment'
import { useMarkInspectionDone } from '../../hooks/useInspections'
import { markInspectionDoneSchema, type MarkInspectionDoneFormValues } from '../../lib/schemas'
import { equipmentTypeLabels, formatDate, toDateInputValue } from '../../lib/utils'

export function EquipmentDetailPage() {
  const { id = '' } = useParams()
  const { condominiumId, user } = useAuth()
  const equipmentQuery = useEquipmentDetail(id)
  const markDoneMutation = useMarkInspectionDone(condominiumId ?? '', id)

  const form = useForm<MarkInspectionDoneFormValues>({
    resolver: zodResolver(markInspectionDoneSchema),
    defaultValues: {
      executedAt: toDateInputValue(new Date()),
      notes: '',
      document: undefined,
    },
  })

  const nextInspection = equipmentQuery.data?.nextInspection ?? null

  const groupedDocuments = (equipmentQuery.data?.inspectionHistory ?? []).filter(
    (inspection) => inspection.documents.length > 0,
  )

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!nextInspection || !user) {
      return
    }

    await markDoneMutation.mutateAsync({
      inspectionId: nextInspection.id,
      executedAt: values.executedAt,
      executedById: user.id,
      notes: values.notes,
      documentFile: values.document?.item(0) ?? undefined,
    })

    form.reset({
      executedAt: toDateInputValue(new Date()),
      notes: '',
      document: undefined,
    })
  })

  if (equipmentQuery.isLoading) {
    return <Card><CardContent className="p-8 text-sm text-muted-foreground">Carregando detalhe do equipamento...</CardContent></Card>
  }

  if (equipmentQuery.isError || !equipmentQuery.data) {
    return <Card><CardContent className="p-8 text-sm text-status-danger">Não foi possível carregar este equipamento.</CardContent></Card>
  }

  const equipment = equipmentQuery.data

  return (
    <div className="space-y-6">
      <div>
        <Link to="/equipment" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Voltar para equipamentos
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle className="text-3xl">{equipment.name}</CardTitle>
            <CardDescription className="mt-2">
              {equipmentTypeLabels[equipment.type]} • próxima inspeção em {formatDate(equipment.nextInspection?.scheduledDate ?? null)}
            </CardDescription>
          </div>
          <EquipmentStatusBadge status={equipment.currentStatus} className="self-start md:self-auto" />
        </CardHeader>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de inspeções</CardTitle>
            <CardDescription>Agenda, execução, responsável e documentos vinculados.</CardDescription>
          </CardHeader>
          <CardContent>
            <InspectionHistoryTable inspections={equipment.inspectionHistory} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Marcar inspeção como realizada</CardTitle>
            <CardDescription>
              {nextInspection
                ? `Inspeção aberta para ${formatDate(nextInspection.scheduledDate)}.`
                : 'Não há inspeção pendente para este equipamento.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {nextInspection ? (
              <Form {...form}>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <FormField
                    control={form.control}
                    name="executedAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de execução</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Ex.: troca de rolamentos e limpeza do conjunto." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="document"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Laudo em PDF</FormLabel>
                        <FormControl>
                          <Input
                            accept="application/pdf"
                            type="file"
                            name={field.name}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            onChange={(event) => field.onChange(event.target.files)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {markDoneMutation.isError ? (
                    <p className="text-sm font-medium text-status-danger">{markDoneMutation.error.message}</p>
                  ) : null}

                  <Button className="w-full" type="submit" disabled={markDoneMutation.isPending}>
                    <Upload className="h-4 w-4" />
                    {markDoneMutation.isPending ? 'Salvando...' : 'Registrar execução'}
                  </Button>
                </form>
              </Form>
            ) : (
              <p className="text-sm text-muted-foreground">Tudo certo. Não existe inspeção pendente neste momento.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Documentos por inspeção</CardTitle>
          <CardDescription>Laudos e certificados anexados ao histórico do equipamento.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groupedDocuments.map((inspection) => (
            <div key={inspection.id} className="rounded-2xl border border-border/60 bg-white/70 p-4">
              <p className="font-semibold">Inspeção de {formatDate(inspection.scheduledDate)}</p>
              <p className="mt-1 text-sm text-muted-foreground">Executada em {formatDate(inspection.executedAt)}</p>
              <div className="mt-4 space-y-2">
                {inspection.documents.map((document) => (
                  <a key={document.id} href={document.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                    <FileText className="h-4 w-4" />
                    {document.fileName}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}