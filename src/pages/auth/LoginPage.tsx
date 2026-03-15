import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Building2, LockKeyhole, ShieldCheck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

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
import { useAuth } from '../../context/AuthContext'
import { loginSchema, type LoginFormValues } from '../../lib/schemas'
import { authService } from '../../services/auth.service'

export function LoginPage() {
  const navigate = useNavigate()
  const auth = useAuth()
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'manager@safecondo.app',
      password: 'safecondo123',
    },
  })

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (payload) => {
      auth.login(payload)
      navigate(payload.role === 'MANAGER' ? '/dashboard' : '/resident', { replace: true })
    },
  })

  const handleSubmit = form.handleSubmit((values) => {
    loginMutation.mutate(values)
  })

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-primary via-primary to-slate-900 p-10 text-primary-foreground shadow-panel lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-2xl">SafeCondo</p>
                <p className="text-sm text-primary-foreground/75">Operação enxuta, rastreabilidade total.</p>
              </div>
            </div>

            <div className="mt-16 max-w-xl space-y-6">
              <h1 className="text-balance text-5xl text-primary-foreground">Gestão de vistorias, alertas e laudos em uma única operação.</h1>
              <p className="text-lg text-primary-foreground/80">
                Painel do síndico com visão operacional e transparência controlada para moradores.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
              <ShieldCheck className="h-5 w-5" />
              <p className="mt-3 font-semibold">Alertas proativos</p>
              <p className="mt-2 text-sm text-primary-foreground/75">D-15, D-7 e lembretes diários para itens críticos.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
              <LockKeyhole className="h-5 w-5" />
              <p className="mt-3 font-semibold">Acesso por papel</p>
              <p className="mt-2 text-sm text-primary-foreground/75">MANAGER com fluxo completo e RESIDENT com leitura segura.</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Entrar</CardTitle>
              <CardDescription>Use uma conta demo ou crie um usuário novo para testar o fluxo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-2xl bg-secondary/70 p-4 text-sm text-secondary-foreground">
                <p className="font-semibold">Contas demo</p>
                <p className="mt-2">MANAGER: manager@safecondo.app / safecondo123</p>
                <p>RESIDENT: resident@safecondo.app / safecondo123</p>
              </div>

              <Form {...form}>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input placeholder="voce@safecondo.app" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="******" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {loginMutation.isError ? (
                    <p className="text-sm font-medium text-status-danger">{loginMutation.error.message}</p>
                  ) : null}

                  <Button className="w-full" type="submit" disabled={loginMutation.isPending}>
                    {loginMutation.isPending ? 'Entrando...' : 'Acessar SafeCondo'}
                  </Button>
                </form>
              </Form>

              <p className="text-sm text-muted-foreground">
                Ainda não tem acesso?{' '}
                <Link className="font-semibold text-primary hover:underline" to="/register">
                  Criar conta
                </Link>
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}