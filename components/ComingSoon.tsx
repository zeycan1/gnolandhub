export default function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="coming-soon">
      <span className="nav-soon">soon</span>
      <h1 className="vault-title">{title}</h1>
      <p className="vault-lede">{description}</p>
    </div>
  );
}
