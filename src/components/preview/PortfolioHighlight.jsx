import { getPortfolioHighlight, getPortfolioUrl } from '../../data/ojtPresets'

export default function PortfolioHighlight({ data, color }) {
  const portfolio = getPortfolioHighlight(data)
  if (!portfolio) return null
  const url = getPortfolioUrl(portfolio)
  return (
    <p className="mb-2 text-[13px] font-bold break-words [overflow-wrap:anywhere]" style={{ color }}>
      Portfolio: {url ? <a href={url} target="_blank" rel="noreferrer" className="underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2">{portfolio}</a> : portfolio}
    </p>
  )
}
