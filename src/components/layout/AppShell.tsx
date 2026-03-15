import { BellRing, Gauge, LogOut, ShieldCheck, Wrench } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { NavLink } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'

type NavigationItem = {
  label: string
  href: string
  icon: typeof Gauge
}

const managerNavigation: NavigationItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: Gauge },
  { label: 'Equipamentos', href: '/equipment', icon: Wrench },
]

const residentNavigation: NavigationItem[] = [
  { label: 'Visão geral', href: '/resident', icon: ShieldCheck },
]

export function AppShell({ children }: PropsWithChildren) {
  const { logout, role, user } = useAuth()
  const navigation = role === 'MANAGER' ? managerNavigation : residentNavigation

  return (
    <div className="min-h-screen px-2 py-2 md:px-3 md:py-3 xl:px-4 xl:py-4">
      <div className="mx-auto flex min-h-[calc(100vh-1rem)] max-w-[1680px] gap-3 md:min-h-[calc(100vh-1.5rem)] md:gap-4 2xl:max-w-[1840px]">
        <aside className="hidden w-[248px] shrink-0 rounded-[2rem] border border-white/70 bg-card/90 p-5 shadow-panel backdrop-blur-sm md:flex md:flex-col xl:w-[264px]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <BellRing className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-xl">SafeCondo</p>
              <p className="text-sm text-muted-foreground">Gestão de manutenção condominial</p>
            </div>
          </div>

          <div className="mb-5 rounded-2xl bg-secondary/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Condomínio ativo</p>
            <p className="mt-1.5 text-base font-semibold text-foreground">Condomínio Parque das Flores</p>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground',
                    isActive && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-border/70 bg-white/70 p-4">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{role === 'MANAGER' ? 'Síndico / Gestão' : 'Morador'}</p>
            <Button variant="ghost" className="mt-3 w-full justify-start" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="mb-3 flex items-center justify-between rounded-[1.5rem] border border-white/70 bg-card/85 px-4 py-3 shadow-panel backdrop-blur-sm md:hidden">
            <div>
              <p className="font-display text-lg">SafeCondo</p>
              <p className="text-xs text-muted-foreground">Condomínio Parque das Flores</p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} aria-label="Sair">
              <LogOut className="h-5 w-5" />
            </Button>
          </header>

          <main className="flex-1 pb-24 md:pb-0">{children}</main>

          <nav className="fixed inset-x-4 bottom-4 z-40 rounded-[1.5rem] border border-white/80 bg-card/95 p-2 shadow-panel backdrop-blur md:hidden">
            <div className="grid grid-cols-2 gap-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold text-muted-foreground',
                      isActive && 'bg-primary text-primary-foreground',
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}