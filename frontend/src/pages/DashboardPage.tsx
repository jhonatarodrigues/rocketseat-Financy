import { useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { CategoryDialog } from '../components/dialogs/CategoryDialog'
import { TransactionDialog } from '../components/dialogs/TransactionDialog'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { Table, TableRow } from '../components/ui/Table'
import { useFinance } from '../features/finance/hooks/useFinance'
import type { Category, Transaction, User } from '../types/finance'
import { currencyFormatter, dateFormatter } from '../utils/formatters'

type DashboardPageProps = {
  user: User
  onLogout: () => void
}

export function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const finance = useFinance()
  const [transactionDialog, setTransactionDialog] = useState<Transaction | null | undefined>()
  const [categoryDialog, setCategoryDialog] = useState<Category | null | undefined>()

  const categoriesById = useMemo(() => {
    return new Map(finance.categories.map((category) => [category.id, category]))
  }, [finance.categories])

  return (
    <main className="grid min-h-screen bg-app-background lg:grid-cols-[280px_1fr]">
      <aside className="flex border-app-border bg-app-surface p-6 lg:sticky lg:top-0 lg:h-screen lg:flex-col lg:justify-between lg:border-r">
        <div className="w-full">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-app-primary text-lg font-extrabold text-white">
              F
            </div>
            <strong className="text-lg text-app-text">Financy</strong>
          </div>

          <nav className="mt-10 grid gap-2" aria-label="Principal">
            <a className="rounded-lg bg-app-primary-soft px-3.5 py-3 font-bold text-app-primary" href="#dashboard">
              Dashboard
            </a>
            <a className="rounded-lg px-3.5 py-3 font-bold text-app-muted hover:bg-app-surface-muted hover:text-app-text" href="#transactions">
              Transacoes
            </a>
            <a className="rounded-lg px-3.5 py-3 font-bold text-app-muted hover:bg-app-surface-muted hover:text-app-text" href="#categories">
              Categorias
            </a>
          </nav>
        </div>

        <Card className="mt-6 grid w-full gap-2 p-4 lg:mt-0">
          <span className="font-bold text-app-text">{user.name}</span>
          <small className="text-app-muted">{user.email}</small>
          <Button type="button" variant="ghost" onClick={onLogout}>
            Sair
          </Button>
        </Card>
      </aside>

      <section className="grid content-start gap-7 p-6 sm:p-9">
        <PageHeader
          eyebrow="Dashboard"
          title="Resumo financeiro"
          actions={
            <>
              <Button type="button" variant="secondary" onClick={() => setCategoryDialog(null)}>
                Nova categoria
              </Button>
              <Button type="button" onClick={() => setTransactionDialog(null)}>
                Nova transacao
              </Button>
            </>
          }
        />

        <section className="grid gap-4 md:grid-cols-3" aria-label="Resumo" id="dashboard">
          <SummaryCard label="Entradas" value={finance.summary.income} />
          <SummaryCard label="Saidas" value={finance.summary.expense} />
          <SummaryCard label="Saldo" value={finance.summary.balance} featured />
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
          <Card className="grid gap-5 p-5" id="transactions">
            <SectionTitle eyebrow="Movimentacoes" title="Transacoes" />

            {finance.isLoading ? (
              <EmptyState>Carregando transacoes...</EmptyState>
            ) : finance.transactions.length === 0 ? (
              <EmptyState>Nenhuma transacao cadastrada.</EmptyState>
            ) : (
              <Table>
                {finance.transactions.map((transaction) => {
                  const category = categoriesById.get(transaction.categoryId)

                  return (
                    <TableRow
                      className="grid-cols-1 sm:grid-cols-[minmax(180px,1fr)_auto] lg:grid-cols-[minmax(180px,1fr)_auto_auto]"
                      key={transaction.id}
                    >
                      <div>
                        <strong className="text-app-text">{transaction.title}</strong>
                        <span className="mt-1 block text-sm text-app-muted">
                          {category?.name || 'Sem categoria'} ·{' '}
                          {dateFormatter.format(new Date(transaction.date))}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 sm:justify-end">
                        <Badge variant={transaction.type === 'income' ? 'success' : 'danger'}>
                          {transaction.type === 'income' ? 'Entrada' : 'Saida'}
                        </Badge>
                        <strong
                          className={
                            transaction.type === 'income' ? 'text-app-success' : 'text-app-danger'
                          }
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {currencyFormatter.format(transaction.amount)}
                        </strong>
                      </div>

                      <div className="flex flex-wrap gap-2 sm:justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setTransactionDialog(transaction)}
                        >
                          Editar
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => finance.deleteTransaction(transaction.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </TableRow>
                  )
                })}
              </Table>
            )}
          </Card>

          <Card className="grid content-start gap-5 p-5" id="categories">
            <SectionTitle eyebrow="Organizacao" title="Categorias" />

            <Table>
              {finance.categories.map((category) => (
                <TableRow className="grid-cols-[16px_1fr] sm:grid-cols-[16px_1fr_auto]" key={category.id}>
                  <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: category.color }} />
                  <strong className="text-app-text">{category.name}</strong>
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <Button type="button" variant="ghost" onClick={() => setCategoryDialog(category)}>
                      Editar
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => finance.deleteCategory(category.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </TableRow>
              ))}
            </Table>
          </Card>
        </section>
      </section>

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

type SummaryCardProps = {
  featured?: boolean
  label: string
  value: number
}

function SummaryCard({ featured = false, label, value }: SummaryCardProps) {
  return (
    <Card className={featured ? 'grid gap-3 bg-app-primary p-5 text-white' : 'grid gap-3 p-5'}>
      <span className={featured ? 'font-bold text-white/80' : 'font-bold text-app-muted'}>{label}</span>
      <strong className="text-3xl font-extrabold">{currencyFormatter.format(value)}</strong>
    </Card>
  )
}

type SectionTitleProps = {
  eyebrow: string
  title: string
}

function SectionTitle({ eyebrow, title }: SectionTitleProps) {
  return (
    <header>
      <p className="mb-1 text-xs font-extrabold uppercase tracking-normal text-app-primary">{eyebrow}</p>
      <h2 className="text-xl font-extrabold text-app-text">{title}</h2>
    </header>
  )
}

function EmptyState({ children }: PropsWithChildren) {
  return (
    <p className="rounded-lg border border-dashed border-app-border p-7 text-center text-app-muted">
      {children}
    </p>
  )
}
