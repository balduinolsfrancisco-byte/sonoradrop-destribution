import { useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, FileText, Coins, CheckCircle2 } from 'lucide-react'
import Logo from '../components/Logo'

type DocKey = 'termos' | 'privacidade' | 'royalties'

const DOCS: Record<DocKey, {
  titulo: string
  resumo: string
  icon: typeof FileText
  secoes: { titulo: string; corpo: string[] }[]
}> = {
  termos: {
    titulo: 'Termos de serviço',
    resumo: 'As regras claras entre ti e a SonoraDrop Distribution, Lda. — em português simples, sem letras pequenas escondidas.',
    icon: FileText,
    secoes: [
      {
        titulo: '1. Quem somos',
        corpo: [
          'A SonoraDrop Distribution, Lda. («SonoraDrop», «nós») é uma distribuidora musical angolana com sede na Av. 4 de Fevereiro 151, Luanda. Distribuímos fonogramas para lojas digitais em mais de 190 países.',
        ],
      },
      {
        titulo: '2. A tua conta',
        corpo: [
          'Tens de ter pelo menos 18 anos ou autorização de um responsável legal para criar conta. Os dados que nos dás (nome, email, dados fiscais) devem ser verdadeiros e mantidos atualizados.',
          'És responsável por manter a palavra-passe segura. Se suspeitares de acesso não autorizado, contacta imediatamente suporte@sonoradrop.ao.',
        ],
      },
      {
        titulo: '3. O teu conteúdo',
        corpo: [
          'O áudio, as capas e os metadados que envias continuam a ser teus. Ao enviar um lançamento, declaras que tens todos os direitos necessários (master e composição) e autorizas a SonoraDrop a distribuir esse conteúdo nas lojas que selecionares.',
          'Não aceitamos conteúdo que viole direitos de terceiros, discurso de ódio, conteúdo ilegal ou samples sem licença.',
        ],
      },
      {
        titulo: '4. Aprovação e prazos',
        corpo: [
          'Cada lançamento passa por revisão técnica e de metadados. Normalmente demoramos menos de 48 horas. Recomendamos enviar com, pelo menos, 14 dias de antecedência em relação à data de lançamento.',
          'A SonoraDrop pode pedir correções (por exemplo, capas com resolução insuficiente ou títulos com caracteres inválidos). O lançamento fica em «Ação necessária» até as correções serem feitas.',
        ],
      },
      {
        titulo: '5. Pagamentos',
        corpo: [
          'Os royalties entram no teu saldo 45 dias após o fim de cada mês de referência. Podes levantar a partir de $50 via Multicaixa Express, transferência BAI ou PayPal. A SonoraDrop não cobra taxas de levantamento.',
        ],
      },
      {
        titulo: '6. Cancelamento',
        corpo: [
          'Podes remover um lançamento a qualquer momento no painel. A remoção das lojas pode levar até 30 dias. Podemos suspender contas que violem estes termos, após aviso e oportunidade de correção quando aplicável.',
        ],
      },
    ],
  },
  privacidade: {
    titulo: 'Política de privacidade',
    resumo: 'Que dados recolhemos, para quê e durante quanto tempo. Em conformidade com a Lei n.º 22/11 de Proteção de Dados Pessoais de Angola.',
    icon: ShieldCheck,
    secoes: [
      {
        titulo: '1. Dados que recolhemos',
        corpo: [
          'Dados de conta (nome, nome artístico, email, telefone, país, cidade), dados de pagamento (IBAN ou número Multicaixa) e dados de utilização (páginas visitadas, lançamentos criados).',
        ],
      },
      {
        titulo: '2. Para que usamos os dados',
        corpo: [
          'Para prestar o serviço de distribuição, processar pagamentos, prevenir fraude, cumprir obrigações legais e enviar comunicações que aceitaste receber. Nunca vendemos dados pessoais a terceiros.',
        ],
      },
      {
        titulo: '3. Partilha com lojas',
        corpo: [
          'Para distribuir a tua música, partilhamos o nome artístico, capas, metadados das faixas e o país do artista com as lojas digitais. Dados fiscais só são partilhados quando exigido por lei.',
        ],
      },
      {
        titulo: '4. Os teus direitos',
        corpo: [
          'Podes pedir acesso, correção, exportação ou eliminação dos teus dados a qualquer momento, escrevendo para privacidade@sonoradrop.ao. Respondemos no prazo máximo de 30 dias.',
        ],
      },
      {
        titulo: '5. Retenção e segurança',
        corpo: [
          'Guardamos dados de conta enquanto a conta estiver ativa e dados de pagamento durante 10 anos, conforme exigências fiscais. Usamos encriptação em trânsito e controlo de acessos internos.',
        ],
      },
      {
        titulo: '6. Demonstração',
        corpo: [
          'Esta versão da aplicação é uma demonstração: todos os dados são guardados apenas no teu navegador (localStorage) e nunca são enviados para servidores.',
        ],
      },
    ],
  },
  royalties: {
    titulo: 'Política de royalties',
    resumo: 'Como é calculado cada cêntimo, quando é pago e como levantas o teu dinheiro. Sem comissões escondidas.',
    icon: Coins,
    secoes: [
      {
        titulo: '1. Como ganhas',
        corpo: [
          'Cada loja paga um valor diferente por stream ou por visualização. A tabela abaixo é indicativa para 2026:',
        ],
      },
      {
        titulo: '2. Quando recebes',
        corpo: [
          'As lojas reportam os dados com 30 a 45 dias de atraso. Os royalties do mês X entram no teu saldo a 45 dias após o fim de X. Exemplo: streams de novembro → saldo disponível a 15 de janeiro.',
          'O pagamento é feito no dia 5 de cada mês (ou no dia útil seguinte) para o método escolhido.',
        ],
      },
      {
        titulo: '3. Comissões',
        corpo: [
          'Plano Starter: 15% de comissão, sem mensalidade. Plano Profissional: 4.900 Kz/mês, 0% de comissão. Plano Gravadora: 19.900 Kz/mês, 0% de comissão, até 10 artistas.',
          'Não cobramos taxas de envio, armazenamento, ISRC, UPC nem de levantamento.',
        ],
      },
      {
        titulo: '4. Levantamentos',
        corpo: [
          'Mínimo de $50 por levantamento. Métodos disponíveis: Multicaixa Express (instantâneo), transferência BAI por IBAN (1–2 dias úteis) e PayPal (1–3 dias úteis). A conversão USD→AOA usa a taxa do Banco Nacional de Angola do dia.',
        ],
      },
      {
        titulo: '5. Ajustes e disputas',
        corpo: [
          'As lojas podem fazer ajustes retroativos (streams fraudulentos, correções de relatórios). Quando isso acontece, informamos-te no painel com o detalhe do ajuste.',
        ],
      },
    ],
  },
}

const RATES = [
  ['Spotify', '$0,0038 – $0,0046'],
  ['Apple Music', '$0,0080 – $0,0098'],
  ['YouTube Music', '$0,0018 – $0,0024'],
  ['Boomplay', '$0,0012 – $0,0020'],
  ['Deezer', '$0,0045 – $0,0062'],
  ['Audiomack', '$0,0009 – $0,0015'],
  ['Tidal', '$0,0090 – $0,0120'],
  ['Amazon Music', '$0,0040 – $0,0055'],
]

export default function Legal() {
  const { doc } = useParams<{ doc: string }>()
  const navigate = useNavigate()
  const key: DocKey = doc === 'privacidade' || doc === 'royalties' ? doc : 'termos'
  const data = DOCS[key]
  const Icon = data.icon

  useEffect(() => {
    document.title = `${data.titulo} | SonoraDrop Distribution`
  }, [data.titulo])

  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-line bg-ink/85 backdrop-blur-md">
        <div className="container-x flex h-16 items-center justify-between">
          <Link to="/" aria-label="SonoraDrop — início"><Logo size={36} /></Link>
          <button onClick={() => navigate(-1)} className="btn-ghost !px-3 !py-2 text-xs"><ArrowLeft size={15} /> Voltar</button>
        </div>
      </header>

      <div className="container-x grid gap-10 py-12 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-600">Documentos legais</p>
          <nav className="mt-3 space-y-1">
            {(Object.keys(DOCS) as DocKey[]).map((k) => {
              const ItemIcon = DOCS[k].icon
              const active = k === key
              return (
                <Link
                  key={k}
                  to={`/legal/${k}`}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition ${active ? 'border border-gold-400/30 bg-gold-400/10 text-gold-300' : 'border border-transparent text-zinc-400 hover:bg-white/[0.03] hover:text-white'}`}
                >
                  <ItemIcon size={15} /> {DOCS[k].titulo}
                </Link>
              )
            })}
          </nav>
          <div className="mt-6 rounded-xl border border-line bg-panel p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Dúvidas?</p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-500">Escreve para <span className="text-gold-300">legal@sonoradrop.ao</span> — respondemos em 2 dias úteis.</p>
          </div>
        </aside>

        <main className="max-w-3xl">
          <span className="eyebrow"><Icon size={13} /> Atualizado a 1 de novembro de 2026</span>
          <h1 className="mt-4 font-display text-3xl font-extrabold text-white sm:text-4xl">{data.titulo}</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500">{data.resumo}</p>

          <div className="mt-10 space-y-8">
            {data.secoes.map((secao) => (
              <section key={secao.titulo}>
                <h2 className="font-display text-lg font-bold text-white">{secao.titulo}</h2>
                <div className="mt-2.5 space-y-2.5">
                  {secao.corpo.map((paragrafo) => (
                    <p key={paragrafo.slice(0, 32)} className="text-[13.5px] leading-relaxed text-zinc-400">{paragrafo}</p>
                  ))}
                </div>
                {key === 'royalties' && secao.titulo.startsWith('1.') && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-line">
                    <table className="w-full text-left text-[12.5px]">
                      <thead className="bg-panel2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        <tr>
                          <th className="px-4 py-2.5">Loja</th>
                          <th className="px-4 py-2.5 text-right">Por stream</th>
                        </tr>
                      </thead>
                      <tbody>
                        {RATES.map(([loja, valor]) => (
                          <tr key={loja} className="border-t border-line/70">
                            <td className="px-4 py-2.5 text-zinc-300">{loja}</td>
                            <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-zinc-200">{valor}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))}
          </div>

          {key === 'royalties' && (
            <div className="mt-8 flex items-start gap-3 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.06] p-4">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />
              <p className="text-[12.5px] leading-relaxed text-emerald-200/80">A tabela é indicativa: as lojas podem alterar tarifas sem aviso prévio. Podes ver o valor exato recebido por loja no separador Estatísticas.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3 border-t border-line pt-6">
            <Link to="/registar" className="btn-gold !py-2.5 text-sm">Criar conta gratuita</Link>
            <Link to="/" className="btn-outline !py-2.5 text-sm">Voltar ao início</Link>
          </div>
        </main>
      </div>
    </div>
  )
}
