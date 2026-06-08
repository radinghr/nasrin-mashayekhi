import { Link } from 'react-router-dom'
import './Logo.css'

/**
 * Logo component. Currently renders text.
 * To swap in an image: replace the <span> with an <img> — no layout changes needed.
 *   <img src="/nasrin-mashayekhi/logo.png" alt="Nasrin Mashayekhi" className="logo__img" />
 */
export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Nasrin Mashayekhi — Home">
      <span className="logo__text">Nasrin Mashayekhi</span>
    </Link>
  )
}
