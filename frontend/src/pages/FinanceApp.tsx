import { useMemo, useState } from 'react'
import type { PropsWithChildren, ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  BriefcaseBusiness,
  CalendarDays,
  CarFront,
  ChevronDown,
  ChevronRight,
  CircleArrowDown,
  CircleArrowUp,
  Edit2,
  HeartPulse,
  LockKeyhole,
  PiggyBank,
  Plus,
  Search,
  ShoppingCart,
  Tag,
  Ticket,
  ToolCase,
  Trash2,
  Utensils,
  Wallet,
} from 'lucide-react'
import { CategoryDialog } from '../components/dialogs/CategoryDialog'
import { TransactionDialog } from '../components/dialogs/TransactionDialog'
import { useFinance } from '../features/finance/hooks/useFinance'
import type { Category, Transaction, User } from '../types/finance'
import { formatCurrency, shortDateFormatter } from '../utils/formatters'
import logoMark from '../assets/figma/logo-mark.svg'
import logoWord from '../assets/figma/logo-word.svg'

type Page = 'dashboard' | 'transactions' | 'categories' | 'profile'

type FinanceAppProps = {
  user: User
  onLogout: () => void
}

const iconMap = {
  briefcase: BriefcaseBusiness,
  calendar: CalendarDays,
  car: CarFront,
  'heart-pulse': HeartPulse,
  'piggy-bank': PiggyBank,
  'shopping-cart': ShoppingCart,
  tag: Tag,
  ticket: Ticket,
  'tool-case': ToolCase,
  utensils: Utensils,
}

export function FinanceApp({ onLogout, user }: FinanceAppProps) {
  const finance = useFinance()
  const [page, setPage] = useState<Page>('dashboard')
  const [transactionDialog, setTransactionDialog] = useState<Transaction | null | undefined>()
  const [categoryDialog, setCategoryDialog] = useState<Category | null | undefined>()

  const categoriesById = useMemo(() => {
    return new Map(finance.categories.map((category) => [category.id, category]))
  }, [finance.categories])

  const initials = getInitials(user.name)

  return (
    <main className="min-h-screen bg-[#f8f9fa] text-[#111827]">
      <TopNavbar activePage={page} initials={initials} onNavigate={setPage} />

      {page === 'dashboard' ? (
        <DashboardScreen
          categories={finance.categories}
          categoriesById={categoriesById}
          onCreateTransaction={() => setTransactionDialog(null)}
          onNavigate={setPage}
          transactions={finance.transactions}
        />
      ) : null}

      {page === 'transactions' ? (
        <TransactionsScreen
          categoriesById={categoriesById}
          onCreateTransaction={() => setTransactionDialog(null)}
          onDeleteTransaction={finance.deleteTransaction}
          onEditTransaction={setTransactionDialog}
          transactions={finance.transactions}
        />
      ) : null}

      {page === 'categories' ? (
        <CategoriesScreen
          categories={finance.categories}
          onCreateCategory={() => setCategoryDialog(null)}
          onDeleteCategory={finance.deleteCategory}
          onEditCategory={setCategoryDialog}
          transactionsCount={finance.transactions.length}
        />
      ) : null}

      {page === 'profile' ? <ProfileScreen initials={initials} onLogout={onLogout} user={user} /> : null}

      {transactionDialog !== undefined ? (
        <TransactionDialog
          key={transactionDialog?.id || 'new-transaction'}
          categories={finance.categories}
          transaction={transactionDialog}
          onClose={() => setTransactionDialog(undefined)}
          onSubmit={(input) => {
            if (transactionDialog) {
              finance.updateTransaction(transactionDialog.id, input)
              return
            }

            finance.createTransaction(input)
          }}
        />
      ) : null}

      {categoryDialog !== undefined ? (
        <CategoryDialog
          key={categoryDialog?.id || 'new-category'}
          category={categoryDialog}
          onClose={() => setCategoryDialog(undefined)}
          onSubmit={(input) => {
            if (categoryDialog) {
              finance.updateCategory(categoryDialog.id, input)
              return
            }

            finance.createCategory(input)
          }}
        />
      ) : null}
    </main>
  )
}

type TopNavbarProps = {
  activePage: Page
  initials: string
  onNavigate: (page: Page) => void
}

function TopNavbar({ activePage, initials, onNavigate }: TopNavbarProps) {
  return (
    <header className="border-b border-[#e5e7eb] bg-white">
      <div className="mx-auto flex h-[69px] w-full max-w-[1280px] items-center justify-between px-6 sm:px-12">
        <button
          type="button"
          className="flex h-6 w-[100px] items-center gap-[8px]"
          onClick={() => onNavigate('dashboard')}
        >
          <img src={logoMark} className="h-6 w-6 shrink-0" alt="" />
          <img src={logoWord} className="h-[13.914px] w-[67.405px] shrink-0" alt="Financy" />
        </button>

        <nav className="hidden items-center gap-5 text-sm leading-5 text-[#4b5563] md:flex">
          <NavButton active={activePage === 'dashboard'} onClick={() => onNavigate('dashboard')}>
            Dashboard
          </NavButton>
          <NavButton active={activePage === 'transactions'} onClick={() => onNavigate('transactions')}>
            Transações
          </NavButton>
          <NavButton active={activePage === 'categories'} onClick={() => onNavigate('categories')}>
            Categorias
          </NavButton>
        </nav>

        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-full bg-[#d1d5db] text-sm font-normal leading-5 text-[#374151]"
          onClick={() => onNavigate('profile')}
        >
          {initials}
        </button>
      </div>
      <nav className="mx-auto flex h-12 w-full max-w-[1280px] items-center justify-center gap-5 border-t border-[#e5e7eb] px-6 text-sm leading-5 text-[#4b5563] md:hidden">
        <NavButton active={activePage === 'dashboard'} onClick={() => onNavigate('dashboard')}>
          Dashboard
        </NavButton>
        <NavButton active={activePage === 'transactions'} onClick={() => onNavigate('transactions')}>
          Transações
        </NavButton>
        <NavButton active={activePage === 'categories'} onClick={() => onNavigate('categories')}>
          Categorias
        </NavButton>
      </nav>
    </header>
  )
}

function NavButton({
  active,
  children,
  onClick,
}: PropsWithChildren<{ active: boolean; onClick: () => void }>) {
  return (
    <button
      type="button"
      className={active ? 'font-bold text-[#1f6f43]' : 'font-normal text-[#4b5563]'}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

type DashboardScreenProps = {
  categories: Category[]
  categoriesById: Map<string, Category>
  onCreateTransaction: () => void
  onNavigate: (page: Page) => void
  transactions: Transaction[]
}

function DashboardScreen({
  categories,
  categoriesById,
  onCreateTransaction,
  onNavigate,
  transactions,
}: DashboardScreenProps) {
  const recentTransactions = transactions.slice(0, 5)
  const totalBalance = 12847.32
  const monthlyIncome = 4250
  const monthlyExpense = 2180.45

  return (
    <section className="mx-auto grid w-full max-w-[1280px] gap-6 px-6 py-12 sm:px-12">
      <div className="grid gap-6 lg:grid-cols-3">
        <MetricCard icon={<Wallet size={20} />} label="Saldo total" value={formatCurrency(totalBalance)} />
        <MetricCard
          icon={<CircleArrowUp size={20} />}
          iconClassName="text-[#1f6f43]"
          label="Receitas do mês"
          value={formatCurrency(monthlyIncome)}
        />
        <MetricCard
          icon={<CircleArrowDown size={20} />}
          iconClassName="text-[#ef4444]"
          label="Despesas do mês"
          value={formatCurrency(monthlyExpense)}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,781.333px)_minmax(320px,378.667px)]">
        <section className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
          <SectionHeader
            action="Ver todas"
            title="Transações recentes"
            onAction={() => onNavigate('transactions')}
          />
          <div>
            {recentTransactions.map((transaction) => (
              <DashboardTransactionRow
                category={categoriesById.get(transaction.categoryId)}
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </div>
          <button
            type="button"
            className="flex h-[60px] w-full items-center justify-center gap-2 border-t border-[#e5e7eb] text-sm font-normal leading-5 text-[#1f6f43]"
            onClick={onCreateTransaction}
          >
            <Plus size={16} />
            Nova transação
          </button>
        </section>

        <section className="h-fit overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
          <SectionHeader action="Gerenciar" title="Categorias" onAction={() => onNavigate('categories')} />
          <div className="grid gap-5 p-6">
            {categories
              .filter((category) => category.amount)
              .slice(0, 5)
              .map((category) => (
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-1" key={category.id}>
                  <CategoryTag category={category} />
                  <span className="text-right text-sm leading-5 text-[#4b5563]">
                    {category.itemsCount} itens
                  </span>
                  <strong className="min-w-[88px] text-right text-sm font-bold leading-5 text-[#111827]">
                    {formatCurrency(category.amount ?? 0)}
                  </strong>
                </div>
              ))}
          </div>
        </section>
      </div>
    </section>
  )
}

type TransactionsScreenProps = {
  categoriesById: Map<string, Category>
  onCreateTransaction: () => void
  onDeleteTransaction: (id: string) => void
  onEditTransaction: (transaction: Transaction) => void
  transactions: Transaction[]
}

function TransactionsScreen({
  categoriesById,
  onCreateTransaction,
  onDeleteTransaction,
  onEditTransaction,
  transactions,
}: TransactionsScreenProps) {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-6 py-12 sm:px-12">
      <PageTitle
        actionLabel="Nova transação"
        description="Gerencie todas as suas transações financeiras"
        onAction={onCreateTransaction}
        title="Transações"
      />

      <section className="mt-8 grid gap-4 rounded-lg border border-[#e5e7eb] bg-white p-6 lg:grid-cols-4">
        <FilterInput icon={<Search size={16} />} label="Buscar" placeholder="Buscar por descrição" />
        <FilterSelect label="Tipo" value="Todos" />
        <FilterSelect label="Categoria" value="Todas" />
        <FilterSelect label="Período" value="novembro / 2025" />
      </section>

      <section className="mt-9 overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
        <div className="hidden h-14 grid-cols-[414px_112px_200px_136px_200px_120px] border-b border-[#e5e7eb] bg-white text-xs font-medium uppercase leading-4 text-[#6b7280] lg:grid">
          <TableHead className="justify-start pl-6">Descrição</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="justify-end pr-6">Valor</TableHead>
          <TableHead>Ações</TableHead>
        </div>

        <div>
          {transactions.slice(1).map((transaction) => (
            <TransactionTableRow
              category={categoriesById.get(transaction.categoryId)}
              key={transaction.id}
              onDelete={() => onDeleteTransaction(transaction.id)}
              onEdit={() => onEditTransaction(transaction)}
              transaction={transaction}
            />
          ))}
        </div>

        <footer className="flex min-h-[72px] items-center justify-between border-t border-[#e5e7eb] px-6 max-sm:flex-col max-sm:items-start max-sm:gap-4 max-sm:py-4">
          <span className="text-sm leading-5 text-[#374151]">1 a 10 | 27 resultados</span>
          <div className="flex gap-2">
            <PaginationButton disabled>
              <ArrowLeft size={16} />
            </PaginationButton>
            <PaginationButton active>1</PaginationButton>
            <PaginationButton>2</PaginationButton>
            <PaginationButton>3</PaginationButton>
            <PaginationButton>
              <ArrowRight size={16} />
            </PaginationButton>
          </div>
        </footer>
      </section>
    </section>
  )
}

type CategoriesScreenProps = {
  categories: Category[]
  onCreateCategory: () => void
  onDeleteCategory: (id: string) => void
  onEditCategory: (category: Category) => void
  transactionsCount: number
}

function CategoriesScreen({
  categories,
  onCreateCategory,
  onDeleteCategory,
  onEditCategory,
  transactionsCount,
}: CategoriesScreenProps) {
  const mostUsed = categories[0]

  return (
    <section className="mx-auto w-full max-w-[1280px] px-6 py-12 sm:px-12">
      <PageTitle
        actionLabel="Nova categoria"
        description="Organize suas transações por categorias"
        onAction={onCreateCategory}
        title="Categorias"
      />

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <CategoryMetric icon={<Tag size={24} />} label="total de categorias" value={String(categories.length)} />
        <CategoryMetric
          icon={<ArrowUpDown size={24} />}
          iconClassName="text-[#9333ea]"
          label="total de transações"
          value={String(transactionsCount + 18)}
        />
        <CategoryMetric
          icon={<Utensils size={24} />}
          iconClassName="text-[#2563eb]"
          label="categoria mais utilizada"
          value={mostUsed?.name ?? '-'}
        />
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard
            category={category}
            key={category.id}
            onDelete={() => onDeleteCategory(category.id)}
            onEdit={() => onEditCategory(category)}
          />
        ))}
      </section>
    </section>
  )
}

type ProfileScreenProps = {
  initials: string
  onLogout: () => void
  user: User
}

function ProfileScreen({ initials, onLogout, user }: ProfileScreenProps) {
  return (
    <section className="mx-auto flex w-full max-w-[1280px] justify-center px-6 py-12 sm:px-12">
      <div className="flex w-[448px] max-w-full flex-col gap-8 rounded-xl border border-[#e5e7eb] bg-white p-[33px]">
        <header className="flex flex-col items-center gap-6 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[#d1d5db] text-[28px] font-normal leading-10 text-[#374151]">
            {initials}
          </div>
          <div>
            <h1 className="text-xl font-bold leading-7 text-[#111827]">{user.name}</h1>
            <p className="text-base leading-6 text-[#4b5563]">{user.email}</p>
          </div>
        </header>

        <div className="h-px bg-[#e5e7eb]" />

        <div className="grid gap-4">
          <FigmaInput label="Nome" value={user.name} />
          <FigmaInput label="E-mail" value={user.email} />
        </div>

        <div className="grid gap-4">
          <button className="h-12 rounded-lg bg-[#1f6f43] text-base font-medium text-white" type="button">
            Salvar alterações
          </button>
          <button
            className="flex h-12 items-center justify-center gap-2 rounded-lg border border-[#d1d5db] bg-white text-base font-medium text-[#374151]"
            type="button"
            onClick={onLogout}
          >
            <LockKeyhole size={18} />
            Sair da conta
          </button>
        </div>
      </div>
    </section>
  )
}

type MetricCardProps = {
  icon: ReactNode
  iconClassName?: string
  label: string
  value: string
}

function MetricCard({ icon, iconClassName = 'text-[#9333ea]', label, value }: MetricCardProps) {
  return (
    <article className="h-[118px] rounded-lg border border-[#e5e7eb] bg-white p-6">
      <div className="flex items-center gap-3">
        <span className={iconClassName}>{icon}</span>
        <span className="text-xs font-medium uppercase leading-4 tracking-[0.04em] text-[#6b7280]">
          {label}
        </span>
      </div>
      <strong className="mt-4 block text-[28px] font-bold leading-8 text-[#111827]">{value}</strong>
    </article>
  )
}

function SectionHeader({
  action,
  onAction,
  title,
}: {
  action: string
  onAction: () => void
  title: string
}) {
  return (
    <header className="flex h-[61px] items-center justify-between border-b border-[#e5e7eb] px-6">
      <h2 className="text-xs font-medium uppercase leading-4 tracking-[0.04em] text-[#6b7280]">{title}</h2>
      <button className="flex items-center gap-2 text-sm font-medium leading-5 text-[#1f6f43]" onClick={onAction} type="button">
        {action}
        <ChevronRight size={16} />
      </button>
    </header>
  )
}

function DashboardTransactionRow({
  category,
  transaction,
}: {
  category?: Category
  transaction: Transaction
}) {
  const Icon = iconMap[(transaction.icon ?? category?.icon ?? 'tag') as keyof typeof iconMap] ?? Tag
  const isIncome = transaction.type === 'income'

  return (
    <div className="grid min-h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-[#e5e7eb] px-6 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_160px_160px]">
      <div className="flex items-center gap-4">
        <IconBadge category={category} icon={<Icon size={16} />} />
        <div>
          <h3 className="text-base font-normal leading-6 text-[#111827]">{transaction.title}</h3>
          <p className="text-sm leading-5 text-[#4b5563]">
            {shortDateFormatter.format(new Date(transaction.date))}
          </p>
        </div>
      </div>

      <div className="hidden justify-center sm:flex">
        {category ? <CategoryTag category={category} /> : null}
      </div>

      <div className="flex items-center justify-end gap-2">
        <strong className="text-right text-sm font-bold leading-5 text-[#111827]">
          {isIncome ? '+ ' : '- '}
          {formatCurrency(transaction.amount)}
        </strong>
        {isIncome ? (
          <CircleArrowUp className="text-[#16a34a]" size={16} />
        ) : (
          <CircleArrowDown className="text-[#ef4444]" size={16} />
        )}
      </div>
    </div>
  )
}

function TransactionTableRow({
  category,
  onDelete,
  onEdit,
  transaction,
}: {
  category?: Category
  onDelete: () => void
  onEdit: () => void
  transaction: Transaction
}) {
  const Icon = iconMap[(transaction.icon ?? category?.icon ?? 'tag') as keyof typeof iconMap] ?? Tag
  const isIncome = transaction.type === 'income'

  return (
    <div className="grid min-h-[72px] gap-3 border-b border-[#e5e7eb] px-4 py-4 last:border-b-0 lg:grid-cols-[414px_112px_200px_136px_200px_120px] lg:px-0 lg:py-0">
      <div className="flex items-center gap-4 lg:px-6">
        <IconBadge category={category} icon={<Icon size={16} />} />
        <span className="text-base leading-6 text-[#111827]">{transaction.title}</span>
      </div>
      <Cell>{shortDateFormatter.format(new Date(transaction.date))}</Cell>
      <Cell>{category ? <CategoryTag category={category} /> : null}</Cell>
      <Cell>
        <span
          className={
            isIncome
              ? 'flex items-center gap-1 text-sm leading-5 text-[#15803d]'
              : 'flex items-center gap-1 text-sm leading-5 text-[#dc2626]'
          }
        >
          {isIncome ? <CircleArrowUp size={14} /> : <CircleArrowDown size={14} />}
          {isIncome ? 'Entrada' : 'Saída'}
        </span>
      </Cell>
      <div className="flex items-center font-bold lg:justify-end lg:px-6">
        {isIncome ? '+ ' : '- '}
        {formatCurrency(transaction.amount)}
      </div>
      <div className="flex items-center gap-2 lg:justify-center">
        <IconButton tone="danger" onClick={onDelete}>
          <Trash2 size={16} />
        </IconButton>
        <IconButton onClick={onEdit}>
          <Edit2 size={16} />
        </IconButton>
      </div>
    </div>
  )
}

function CategoriesScreenIcon({ category, size = 16 }: { category: Category; size?: number }) {
  const Icon = iconMap[(category.icon ?? 'tag') as keyof typeof iconMap] ?? Tag
  return <Icon size={size} />
}

function CategoryCard({
  category,
  onDelete,
  onEdit,
}: {
  category: Category
  onDelete: () => void
  onEdit: () => void
}) {
  return (
    <article className="h-[226px] rounded-lg border border-[#e5e7eb] bg-white p-6">
      <header className="flex items-start justify-between">
        <IconBadge category={category} icon={<CategoriesScreenIcon category={category} />} />
        <div className="flex gap-2">
          <IconButton tone="danger" onClick={onDelete}>
            <Trash2 size={16} />
          </IconButton>
          <IconButton onClick={onEdit}>
            <Edit2 size={16} />
          </IconButton>
        </div>
      </header>

      <div className="mt-5 h-[68px]">
        <h3 className="text-base font-bold leading-6 text-[#111827]">{category.name}</h3>
        <p className="mt-1 text-sm leading-5 text-[#4b5563]">{category.description}</p>
      </div>

      <footer className="mt-5 flex items-center justify-between">
        <CategoryTag category={category} />
        <span className="text-sm leading-5 text-[#4b5563]">{category.itemsCount} itens</span>
      </footer>
    </article>
  )
}

function CategoryMetric({
  icon,
  iconClassName = 'text-[#374151]',
  label,
  value,
}: {
  icon: ReactNode
  iconClassName?: string
  label: string
  value: string
}) {
  return (
    <article className="flex h-[106px] items-center gap-4 rounded-lg border border-[#e5e7eb] bg-white p-6">
      <span className={iconClassName}>{icon}</span>
      <div>
        <strong className="block text-[28px] font-bold leading-8 text-[#111827]">{value}</strong>
        <span className="mt-2 block text-xs font-medium uppercase leading-4 tracking-[0.04em] text-[#6b7280]">
          {label}
        </span>
      </div>
    </article>
  )
}

function PageTitle({
  actionLabel,
  description,
  onAction,
  title,
}: {
  actionLabel: string
  description: string
  onAction: () => void
  title: string
}) {
  return (
    <header className="flex items-center justify-between gap-6 max-sm:flex-col max-sm:items-start">
      <div>
        <h1 className="text-2xl font-bold leading-8 text-[#111827]">{title}</h1>
        <p className="mt-0.5 text-base leading-6 text-[#4b5563]">{description}</p>
      </div>
      <button
        className="flex h-9 items-center justify-center gap-2 rounded-lg bg-[#1f6f43] px-4 text-sm font-medium leading-5 text-white"
        type="button"
        onClick={onAction}
      >
        <Plus size={16} />
        {actionLabel}
      </button>
    </header>
  )
}

function FilterInput({
  icon,
  label,
  placeholder,
}: {
  icon: ReactNode
  label: string
  placeholder: string
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium leading-5 text-[#374151]">{label}</span>
      <div className="flex h-12 items-center gap-3 rounded-lg border border-[#d1d5db] bg-white px-[13px] py-[15px] text-[#9ca3af]">
        {icon}
        <input className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[#9ca3af]" placeholder={placeholder} />
      </div>
    </label>
  )
}

function FilterSelect({ label, value }: { label: string; value: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium leading-5 text-[#374151]">{label}</span>
      <button
        className="flex h-12 items-center justify-between rounded-lg border border-[#d1d5db] bg-white px-[13px] py-[15px] text-left text-base leading-[18px] text-[#111827]"
        type="button"
      >
        {value}
        <ChevronDown className="text-[#4b5563]" size={16} />
      </button>
    </label>
  )
}

function FigmaInput({
  asTextarea = false,
  label,
  value,
}: {
  asTextarea?: boolean
  label: string
  value: string
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[#374151]">
      {label}
      {asTextarea ? (
        <textarea
          className="h-[72px] resize-none rounded-lg border border-[#d1d5db] bg-white px-[13px] py-[15px] text-base text-[#111827]"
          defaultValue={value}
        />
      ) : (
        <input
          className="h-12 rounded-lg border border-[#d1d5db] bg-white px-[13px] py-[15px] text-base text-[#111827]"
          defaultValue={value}
        />
      )}
    </label>
  )
}

function Cell({ children }: PropsWithChildren) {
  return <div className="flex items-center text-sm leading-5 text-[#4b5563] lg:justify-center">{children}</div>
}

function TableHead({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <div className={`flex items-center justify-center ${className}`}>{children}</div>
}

function PaginationButton({
  active = false,
  children,
  disabled = false,
}: PropsWithChildren<{ active?: boolean; disabled?: boolean }>) {
  return (
    <button
      className={
        active
          ? 'grid h-8 w-8 place-items-center rounded-md bg-[#1f6f43] text-sm font-medium text-white'
          : 'grid h-8 w-8 place-items-center rounded-md border border-[#d1d5db] bg-white text-sm text-[#374151] disabled:opacity-50'
      }
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  )
}

function IconButton({
  children,
  onClick,
  tone = 'neutral',
}: PropsWithChildren<{ onClick: () => void; tone?: 'danger' | 'neutral' }>) {
  return (
    <button
      className={
        tone === 'danger'
          ? 'grid h-8 w-8 place-items-center rounded-md border border-[#d1d5db] text-[#ef4444]'
          : 'grid h-8 w-8 place-items-center rounded-md border border-[#d1d5db] text-[#4b5563]'
      }
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function IconBadge({ category, icon }: { category?: Category; icon: ReactNode }) {
  return (
    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-md ${category?.tagClassName ?? 'bg-[#e5e7eb] text-[#374151]'}`}>
      {icon}
    </span>
  )
}

function CategoryTag({ category }: { category: Category }) {
  return (
    <span className={`inline-flex h-7 items-center rounded-full px-3 text-sm font-normal leading-5 ${category.tagClassName ?? 'bg-[#e5e7eb] text-[#374151]'}`}>
      {category.name}
    </span>
  )
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}
