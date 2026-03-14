import { Marked } from 'marked';

// FNV-1a 32-bit hash — matches name_coloring.lua exactly.
// Uses BigInt for the multiplication step to avoid float precision loss.
function fnv1a32(str: string): number {
    let hash = BigInt(2166136261);
    const FNV_PRIME = BigInt(16777619);
    const MOD32 = BigInt(4294967296);
    for (let i = 0; i < str.length; i++) {
        hash = hash ^ BigInt(str.charCodeAt(i));
        hash = (hash * FNV_PRIME) % MOD32;
    }
    return Number(hash);
}

// HSL→RGB matching hsl_to_rgb in name_coloring.lua.
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    function hue2rgb(p: number, q: number, t: number): number {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Replicates generate_latex_highlight — same hash decomposition and HSL ranges.
function getNameColor(name: string): string {
    const hash = fnv1a32(name.toLowerCase());
    const h = (hash % 360) / 360;
    const sByte = Math.floor(hash / 360) % 256;
    const lByte = Math.floor(hash / (360 * 256)) % 256;
    const s = 0.65 + (sByte / 255) * 0.35; // 0.65–1.0
    const l = 0.60 + (lByte / 255) * 0.25; // 0.60–0.85
    const [r, g, b] = hslToRgb(h, s, l);
    return `rgb(${r}, ${g}, ${b})`;
}

// Minimal YAML parser covering the subset used by the table filter:
//   key: scalar value
//   key:
//     - list item
// Preserves insertion order to match the lua filter's ordered_keys behaviour.
function parseSimpleYaml(text: string): Array<{ key: string; value: string | string[] }> {
    const lines = text.split('\n');
    const result: Array<{ key: string; value: string | string[] }> = [];
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        const keyMatch = line.match(/^([^:]+):\s*(.*)$/);
        if (keyMatch) {
            const key = keyMatch[1].trim();
            const inline = keyMatch[2].trim();
            if (!inline) {
                // Collect indented list items
                const items: string[] = [];
                while (i + 1 < lines.length && /^\s+-\s+/.test(lines[i + 1])) {
                    i++;
                    items.push(lines[i].replace(/^\s+-\s+/, '').trim());
                }
                result.push({ key, value: items.length ? items : '' });
            } else {
                result.push({ key, value: inline });
            }
        }
        i++;
    }
    return result;
}

// Replicates insert_metadata_table: two-column table, value bolded, lists joined with ", ".
function renderTableBlock(content: string): string {
    const entries = parseSimpleYaml(content.trim());
    if (entries.length === 0) return `<pre>${content}</pre>`;

    const rows = entries.map(({ key, value }) => {
        const displayValue = Array.isArray(value) ? value.join(', ') : value;
        return `<tr><td class="meta-key">${key}:</td><td><strong>${displayValue}</strong></td></tr>`;
    });
    return `<table class="metadata-table"><tbody>${rows.join('')}</tbody></table>`;
}

// Module-level counters, reset before each parse so $derived re-renders stay consistent.
let headingCounters = [0, 0, 0, 0, 0, 0];

const marked = new Marked();

marked.use({
    extensions: [
        {
            name: 'atName',
            level: 'inline',
            start(src: string) { return src.indexOf('@'); },
            tokenizer(src: string) {
                // Matches @Word (alphanum/hyphen/underscore), captures trailing punctuation
                const match = /^@([A-Za-z0-9][A-Za-z0-9\-_]*)([^A-Za-z0-9\-_@]*)/.exec(src);
                if (match) {
                    return {
                        type: 'atName',
                        raw: match[0],
                        id: match[1],
                        punct: match[2],
                    };
                }
            },
            renderer(token) {
                const bg = getNameColor(token.id as string);
                const displayName = (token.id as string).replace(/_/g, '\u00a0'); // underscore → non-breaking space
                const box = `<span class="at-name" style="background:${bg};color:#000">${displayName}</span>`;
                return token.punct ? box + token.punct : box;
            }
        }
    ],
    renderer: {
        code({ text, lang }) {
            if (lang === 'table') {
                return renderTableBlock(text);
            }
            return false;
        },
        heading({ text, depth }) {
            const isUnnumbered = /\s*\{[^}]*\}\s*$/.test(text);
            const clean = text.replace(/\s*\{[^}]*\}\s*$/, '').trim();
            if (isUnnumbered) {
                return `<h${depth}>${clean}</h${depth}>\n`;
            }
            // Increment counter at this depth, reset all deeper levels
            headingCounters[depth - 1]++;
            for (let i = depth; i < 6; i++) headingCounters[i] = 0;
            const num = headingCounters.slice(0, depth).filter((_, i) => i < depth).join('.');
            return `<h${depth}><span class="heading-num">${num}</span> ${clean}</h${depth}>\n`;
        }
    }
});

export function renderMarkdown(content: string): string {
    headingCounters = [0, 0, 0, 0, 0, 0];
    return marked.parse(content) as string;
}
