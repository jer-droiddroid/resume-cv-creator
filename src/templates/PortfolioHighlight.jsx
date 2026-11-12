import { Link, Text } from '@react-pdf/renderer'
import { getPortfolioHighlight, getPortfolioUrl } from '../data/ojtPresets'

export default function PortfolioHighlight({ data, theme, color }) {
  const portfolio = getPortfolioHighlight(data)
  if (!portfolio) return null
  const url = getPortfolioUrl(portfolio)
  const style = { fontFamily: theme.fontFamilyBold, fontSize: theme.fontSize.body, color: color || theme.accentColor, marginBottom: 8 }
  const text = <Text hyphenationCallback={(word) => [word]}>Portfolio: {portfolio}</Text>
  return url
    ? <Link src={url} style={style}>{text}</Link>
    : <Text style={style} hyphenationCallback={(word) => [word]}>Portfolio: {portfolio}</Text>
}
