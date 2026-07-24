import React from "react";

// Minimal markdown -> JSX renderer for gno.land Render() output.
// Handles: #/##/### headings, [text](url) links, --- as <hr>, plain paragraphs.
export function renderSimpleMarkdown(md: string): React.ReactNode[] {
  const lines = md.split("\n");
  const nodes: React.ReactNode[] = [];
  let key = 0;

  function renderInline(text: string): React.ReactNode {
    const parts: React.ReactNode[] = [];
    const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = linkRe.exec(text)) !== null) {
      if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));
      parts.push(
        <a key={key++} href={m[2]}>
          {m[1]}
        </a>
      );
      lastIndex = m.index + m[0].length;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts;
  }

  for (const raw of lines) {
    const line = raw.trim();
    if (line === "---") {
      nodes.push(<hr key={key++} />);
    } else if (line.startsWith("### ")) {
      nodes.push(<h3 key={key++}>{renderInline(line.slice(4))}</h3>);
    } else if (line.startsWith("## ")) {
      nodes.push(<h2 key={key++}>{renderInline(line.slice(3))}</h2>);
    } else if (line.startsWith("# ")) {
      nodes.push(<h1 key={key++}>{renderInline(line.slice(2))}</h1>);
    } else if (line.length > 0) {
      nodes.push(<p key={key++}>{renderInline(line)}</p>);
    }
  }
  return nodes;
}
