import './Nav.css';

export default function Nav() {
  return (
    <nav className="nav-bar">
      <a href="#top" className="nav-bar__brand">
        <span className="nav-bar__mark">hz.</span>
        <span className="nav-bar__name">hannah martinez</span>
      </a>
      <a href="#about" className="nav-bar__link">about</a>
      <a href="#work" className="nav-bar__link">projects</a>
      <a href="#contact" className="nav-bar__link">contact</a>
    </nav>
  );
}
