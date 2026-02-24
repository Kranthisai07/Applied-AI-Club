import { useParams, Link } from 'react-router-dom';
import { getPostBySlug } from '../data/blogPosts';
import './BlogPostPage.css';

/* ──────────────────────────────────────────────
   Lightweight Markdown → React renderer
   Handles: headings, code blocks, tables,
   bold, italic, inline code, links, lists,
   horizontal rules, blockquotes, paragraphs
   ────────────────────────────────────────────── */

function renderMarkdown(md) {
    const lines = md.split('\n');
    const elements = [];
    let i = 0;
    let key = 0;

    while (i < lines.length) {
        const line = lines[i];

        // ── Fenced code blocks ──
        if (line.trimStart().startsWith('```')) {
            const lang = line.trim().replace(/^```+/, '').trim();
            const codeLines = [];
            i++;
            while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
                codeLines.push(lines[i]);
                i++;
            }
            i++; // skip closing ```
            elements.push(
                <div key={key++} className="bp-code-block">
                    {lang && <span className="bp-code-lang">{lang}</span>}
                    <pre><code>{codeLines.join('\n')}</code></pre>
                </div>
            );
            continue;
        }

        // ── Horizontal rule ──
        if (/^---+$/.test(line.trim())) {
            elements.push(<hr key={key++} className="bp-hr" />);
            i++;
            continue;
        }

        // ── Headings ──
        const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
        if (headingMatch) {
            const level = headingMatch[1].length;
            const text = headingMatch[2];
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const Tag = `h${level}`;
            elements.push(<Tag key={key++} id={id} className={`bp-h${level}`}>{renderInline(text)}</Tag>);
            i++;
            continue;
        }

        // ── Tables ──
        if (line.includes('|') && i + 1 < lines.length && /^\|?[\s-:|]+\|/.test(lines[i + 1])) {
            const tableLines = [];
            while (i < lines.length && lines[i].includes('|')) {
                tableLines.push(lines[i]);
                i++;
            }
            elements.push(renderTable(tableLines, key++));
            continue;
        }

        // ── Unordered lists ──
        if (/^[\s]*[-*]\s+/.test(line)) {
            const listItems = [];
            while (i < lines.length && /^[\s]*[-*]\s+/.test(lines[i])) {
                listItems.push(lines[i].replace(/^[\s]*[-*]\s+/, ''));
                i++;
            }
            elements.push(
                <ul key={key++} className="bp-ul">
                    {listItems.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
                </ul>
            );
            continue;
        }

        // ── Ordered lists ──
        if (/^\d+\.\s+/.test(line)) {
            const listItems = [];
            while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
                listItems.push(lines[i].replace(/^\d+\.\s+/, ''));
                i++;
            }
            elements.push(
                <ol key={key++} className="bp-ol">
                    {listItems.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
                </ol>
            );
            continue;
        }

        // ── Blockquotes ──
        if (line.startsWith('>')) {
            const quoteLines = [];
            while (i < lines.length && lines[i].startsWith('>')) {
                quoteLines.push(lines[i].replace(/^>\s?/, ''));
                i++;
            }
            elements.push(
                <blockquote key={key++} className="bp-blockquote">
                    {renderInline(quoteLines.join(' '))}
                </blockquote>
            );
            continue;
        }

        // ── Empty lines ──
        if (line.trim() === '') {
            i++;
            continue;
        }

        // ── Paragraphs ──
        elements.push(<p key={key++} className="bp-p">{renderInline(line)}</p>);
        i++;
    }

    return elements;
}

/* ── Inline formatting: bold, italic, code, links ── */
function renderInline(text) {
    if (!text) return text;

    const parts = [];
    let remaining = text;
    let k = 0;

    while (remaining.length > 0) {
        // Inline code
        let match = remaining.match(/^(.*?)`([^`]+)`(.*)/s);
        if (match) {
            if (match[1]) parts.push(renderInlineFormatting(match[1], k++));
            parts.push(<code key={k++} className="bp-inline-code">{match[2]}</code>);
            remaining = match[3];
            continue;
        }

        // Links [text](url)
        match = remaining.match(/^(.*?)\[([^\]]+)\]\(([^)]+)\)(.*)/s);
        if (match) {
            if (match[1]) parts.push(renderInlineFormatting(match[1], k++));
            parts.push(
                <a key={k++} href={match[3]} target="_blank" rel="noopener noreferrer" className="bp-link">
                    {match[2]}
                </a>
            );
            remaining = match[4];
            continue;
        }

        parts.push(renderInlineFormatting(remaining, k++));
        break;
    }

    return parts.length === 1 ? parts[0] : parts;
}

function renderInlineFormatting(text, key) {
    // Bold + italic combined
    let result = text;
    const segments = [];
    let last = 0;

    // Bold **text**
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let m;
    while ((m = boldRegex.exec(result)) !== null) {
        if (m.index > last) segments.push(result.slice(last, m.index));
        segments.push(<strong key={`b${key}-${m.index}`}>{m[1]}</strong>);
        last = m.index + m[0].length;
    }
    if (segments.length === 0) return text;
    if (last < result.length) segments.push(result.slice(last));

    return <span key={key}>{segments}</span>;
}

/* ── Table renderer ── */
function renderTable(tableLines, key) {
    const parseRow = (line) =>
        line.split('|').map((c) => c.trim()).filter((c) => c.length > 0);

    const headerCells = parseRow(tableLines[0]);
    const dataRows = tableLines.slice(2).map(parseRow);

    return (
        <div key={key} className="bp-table-wrap">
            <table className="bp-table">
                <thead>
                    <tr>
                        {headerCells.map((cell, j) => (
                            <th key={j}>{renderInline(cell)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {dataRows.map((row, ri) => (
                        <tr key={ri}>
                            {row.map((cell, ci) => (
                                <td key={ci}>{renderInline(cell)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ── Extract headings for table of contents ── */
function extractToc(md) {
    const headings = [];
    for (const line of md.split('\n')) {
        const m = line.match(/^(#{2,3})\s+(.+)$/);
        if (m) {
            const level = m[1].length;
            const text = m[2];
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            headings.push({ level, text, id });
        }
    }
    return headings;
}

/* ═══════════════════════════════════════════════
   BlogPostPage component
   ═══════════════════════════════════════════════ */
export default function BlogPostPage() {
    const { slug } = useParams();
    const post = getPostBySlug(slug);

    if (!post) {
        return (
            <div className="bp-page section-padding">
                <div className="container">
                    <h1 className="aic-heading">Post Not Found</h1>
                    <p className="aic-subtext">The article you're looking for doesn't exist.</p>
                    <Link to="/blog" className="bp-back">&larr; Back to Blog</Link>
                </div>
            </div>
        );
    }

    const toc = extractToc(post.content);

    return (
        <div className="bp-page section-padding">
            <div className="container">
                {/* Back link */}
                <Link to="/blog" className="bp-back">&larr; Back to Blog</Link>

                {/* Article header */}
                <header className="bp-header">
                    <span className="bp-category">{post.category}</span>
                    <h1 className="bp-title">{post.title}</h1>
                    <p className="bp-description">{post.description}</p>
                    <div className="bp-meta">
                        <span>{post.author}</span>
                        <span className="bp-meta-sep">·</span>
                        <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span className="bp-meta-sep">·</span>
                        <span>{post.readingTime}</span>
                    </div>
                    <div className="bp-tags">
                        {post.tags.map((tag) => (
                            <span key={tag} className="bp-tag">{tag}</span>
                        ))}
                    </div>
                </header>

                {/* Layout: TOC + Article */}
                <div className="bp-layout">
                    {/* Sidebar TOC */}
                    <aside className="bp-toc">
                        <div className="bp-toc-inner">
                            <span className="bp-toc-label">// CONTENTS</span>
                            <nav>
                                {toc.map((h) => (
                                    <a
                                        key={h.id}
                                        href={`#${h.id}`}
                                        className={`bp-toc-link bp-toc-link--${h.level}`}
                                    >
                                        {h.text}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Article body */}
                    <article className="bp-article">
                        {renderMarkdown(post.content)}
                    </article>
                </div>
            </div>
        </div>
    );
}
