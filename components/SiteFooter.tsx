export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-links">
        <a
          href="https://github.com/gnolang/gno"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          gno.land on GitHub
        </a>
      </div>
      <p className="footer-credit">
        Developed &amp; Maintained by{" "}
        <a
          href="https://www.zeycanode.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-name"
        >
          <img
            src="https://raw.githubusercontent.com/zeycan1/logolar/main/zeycanode-logo%20.svg"
            alt=""
            className="footer-logo"
          />
          ZeycaNode
        </a>
      </p>
    </footer>
  );
}
