import { useState } from 'react'
import type { InputHTMLAttributes, PropsWithChildren, ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { EyeOff, LockKeyhole, Mail, UserRoundPlus } from 'lucide-react'
import {
  loginSchema,
  registerSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from '../features/auth/schemas/authSchema'
import type { LoginInput, RegisterInput } from '../types/finance'
import logoMark from '../assets/figma/logo-mark.svg'
import logoWord from '../assets/figma/logo-word.svg'

type LoginPageProps = {
  onLogin: (input: LoginInput) => Promise<void>
  onRegister: (input: RegisterInput) => Promise<void>
}

export function LoginPage({ onLogin, onRegister }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const schema = mode === 'register' ? registerSchema : loginSchema
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<LoginFormValues | RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  })

  async function submitForm(values: LoginFormValues | RegisterFormValues) {
    if (mode === 'register') {
      await onRegister(values as RegisterInput)
      return
    }

    await onLogin(values as LoginInput)
  }

  function toggleMode() {
    setMode((currentMode) => (currentMode === 'login' ? 'register' : 'login'))
    reset({ email: '', password: '', name: '' })
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 bg-[#f8f9fa] p-12">
      <div className="flex h-8 w-[134px] items-center gap-[11.134px]">
        <img src={logoMark} className="h-8 w-8 shrink-0" alt="" />
        <img src={logoWord} className="h-[18.552px] w-[89.873px] shrink-0" alt="Financy" />
      </div>

      <section className="flex w-[448px] max-w-full flex-col items-start gap-8 rounded-xl border border-[#e5e7eb] bg-white p-[33px]">
        <header className="flex w-full flex-col items-center justify-center gap-1 text-center">
          <h1 className="m-0 w-full text-xl font-bold leading-7 text-[#111827]">
            {mode === 'login' ? 'Fazer login' : 'Criar conta'}
          </h1>
          <p className="m-0 w-full text-base font-normal leading-6 text-[#4b5563]">
            {mode === 'login'
              ? 'Entre na sua conta para continuar'
              : 'Preencha seus dados para começar'}
          </p>
        </header>

        <form className="grid w-full gap-6" onSubmit={handleSubmit(submitForm)}>
          <div className="grid w-full gap-4">
            {mode === 'register' ? (
              <FigmaField label="Nome" error={'name' in errors ? errors.name?.message : undefined}>
                <FigmaTextInput
                  hasError={'name' in errors && Boolean(errors.name)}
                  placeholder="Seu nome"
                  {...register('name')}
                />
              </FigmaField>
            ) : null}

            <FigmaField label="E-mail" error={errors.email?.message}>
              <FigmaTextInput
                hasError={Boolean(errors.email)}
                icon={<Mail size={16} strokeWidth={1.5} />}
                type="email"
                placeholder="mail@exemplo.com"
                {...register('email')}
              />
            </FigmaField>

            <FigmaField label="Senha" error={errors.password?.message}>
              <FigmaTextInput
                hasError={Boolean(errors.password)}
                icon={<LockKeyhole size={16} strokeWidth={1.5} />}
                rightIcon={<EyeOff size={16} strokeWidth={1.5} />}
                type="password"
                placeholder="Digite sua senha"
                {...register('password')}
              />
            </FigmaField>

            <div className="flex h-5 w-full items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-normal leading-5 text-[#374151]">
                <input
                  type="checkbox"
                  className="h-4 w-4 appearance-none rounded border border-[#d1d5db] bg-white"
                />
                Lembrar-me
              </label>
              <button
                type="button"
                className="text-sm font-medium leading-5 text-[#1f6f43]"
              >
                Recuperar senha
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-[#1f6f43] px-4 py-3 text-base font-medium leading-6 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
          </button>

          <div className="flex w-full items-center justify-center gap-3">
            <span className="h-px flex-1 bg-[#d1d5db]" />
            <span className="text-sm font-normal leading-5 text-[#6b7280]">ou</span>
            <span className="h-px flex-1 bg-[#d1d5db]" />
          </div>

          <div className="grid w-full gap-4">
            <p className="m-0 w-full text-center text-sm font-normal leading-5 text-[#4b5563]">
              {mode === 'login' ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'}
            </p>
            <button
              type="button"
              onClick={toggleMode}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#d1d5db] bg-white px-4 py-3 text-center text-base font-medium leading-6 text-[#374151]"
            >
              {mode === 'login' ? (
                <UserRoundPlus size={18} strokeWidth={1.5} />
              ) : null}
              {mode === 'login' ? 'Criar conta' : 'Fazer login'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

type FigmaFieldProps = PropsWithChildren<{
  error?: string
  label: string
}>

function FigmaField({ children, error, label }: FigmaFieldProps) {
  return (
    <label className="flex w-full flex-col items-start gap-2">
      <span className="w-full text-sm font-medium leading-5 text-[#374151]">{label}</span>
      {children}
      {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
    </label>
  )
}

type FigmaTextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean
  icon?: ReactNode
  rightIcon?: ReactNode
}

function FigmaTextInput({ hasError, icon, rightIcon, className, ...props }: FigmaTextInputProps) {
  return (
    <div
      className={[
        'flex h-12 w-full items-center gap-3 overflow-hidden rounded-lg border bg-white px-[13px] py-[15px]',
        hasError ? 'border-red-500' : 'border-[#d1d5db]',
        className ?? '',
      ].join(' ')}
    >
      {icon ? <span className="grid h-4 w-4 shrink-0 place-items-center text-[#9ca3af]">{icon}</span> : null}
      <input
        className="min-w-0 flex-1 bg-transparent text-base font-normal leading-[18px] text-[#111827] outline-none placeholder:text-[#9ca3af]"
        {...props}
      />
      {rightIcon ? (
        <span className="grid h-4 w-4 shrink-0 place-items-center text-[#111827]">{rightIcon}</span>
      ) : null}
    </div>
  )
}
