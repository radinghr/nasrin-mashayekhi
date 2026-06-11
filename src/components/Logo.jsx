import { Link } from 'react-router-dom'
import './Logo.css'

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Nasrin Mashayekhi — Home">
      <img src="/nasrin-mashayekhi/main-logo.png" alt="Nasrin Mashayekhi" className="logo__img" />
    </Link>
  )
}
