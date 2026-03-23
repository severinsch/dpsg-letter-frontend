export interface ContentTemplate {
    label: string;
    title: string;
    content: string;
}

export const contentTemplates: ContentTemplate[] = [
    {
        label: "Sitzungsprotokoll",
        title: "Protokoll",
        content: `Anwesenheit:

[agenda]

# TOP I: Begrüßung

# TOP II:
`,
    },
    {
        label: "Eigenbeleg",
        title: "Eigenbeleg",
        content: `\`\`\`table
Betrag: XX€
Empfänger:
Verwendungszweck:
Datum:
Grund: z.B. "Rechnung verloren"
IBAN: DE...
\`\`\`  
\\
\\
\\
Unterschrift: ______________________________
`,
    },
];
