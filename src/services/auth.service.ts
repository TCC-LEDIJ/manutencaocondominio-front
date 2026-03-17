import type { Role } from '../types'
import { login, registerUser } from './mock-store'

export const authService = {
  login: (input: { email: string; password: string }) => login(input.email, input.password),
  register: (input: { name: string; email: string; password: string; role: Role }) => registerUser(input),
}