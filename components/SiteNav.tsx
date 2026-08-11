const NAV_ITEMS = [
  { label: "Vaults", href: "/", external: false, soon: false },
  { label: "Explorer", href: "https://gnolandexplorer.zeycanode.com/", external: true, soon: false },
  { label: "Swap", href: "/swap", external: false, soon: false },
  { label: "Vote", href: "/vote", external: false, soon: false },
];

export default function SiteNav() {
  return (
    <nav className="site-nav">
      {NAV_ITEMS.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noopener noreferrer" : undefined}
          className="nav-link"
        >
          {item.label}
          {item.soon && <span className="nav-soon">soon</span>}
        </a>
      ))}
    </nav>
  );
}
