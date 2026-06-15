import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Logo.css'

export default function Logo() {
  const { t } = useTranslation()
  const name = `${t('name.first')} ${t('name.last')}`
  return (
    <Link to="/" className="nav__name" aria-label={`${name} — Home`}>
      {name}<span className="dot">.</span>
    </Link>
  )
}
