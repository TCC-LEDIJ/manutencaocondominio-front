import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
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
import { Select } from '../../components/ui/select'
import { useAuth } from '../../context/AuthContext'
import { registerSchema, type RegisterFormValues } from '../../lib/schemas'
import { authService } from '../../services/auth.service'

export function RegisterPage() {
  const navigate = useNavigate()
  const auth = useAuth()
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'MANAGER',
    },
  })

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (payload) => {
      auth.login(payload)
      navigate(payload.role === 'MANAGER' ? '/dashboard' : '/resident', { replace: true })
    },
  })

  const handleSubmit = form.handleSubmit((values) => {
    registerMutation.mutate(values)
  })

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl items-center justify-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Criar conta</CardTitle>
            <CardDescription>Todos os usuários criados entram no condomínio demo para validar a experiência.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex.: Paula Nascimento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="paula@alvenar.app" {...field} />
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

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Papel</FormLabel>
                      <FormControl>
                        <Select {...field}>
                          <option value="MANAGER">MANAGER</option>
                          <option value="RESIDENT">RESIDENT</option>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {registerMutation.isError ? (
                  <p className="md:col-span-2 text-sm font-medium text-status-danger">{registerMutation.error.message}</p>
                ) : null}

                <div className="md:col-span-2 flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Já possui conta?{' '}
                    <Link className="font-semibold text-primary hover:underline" to="/login">
                      Entrar
                    </Link>
                  </p>
                  <Button type="submit" disabled={registerMutation.isPending}>
                    {registerMutation.isPending ? 'Criando...' : 'Criar e acessar'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}