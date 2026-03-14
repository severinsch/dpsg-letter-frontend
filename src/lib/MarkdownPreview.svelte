<script lang="ts">
    import { renderMarkdown } from './markdownUtils';

    let { content }: { content: string } = $props();

    let html = $derived(renderMarkdown(content));
</script>

<div class="markdown-preview">
    {@html html}
</div>

<style>
    .markdown-preview {
        padding: 1rem;
        font-size: 0.95rem;
        line-height: 1.6;
    }

    .markdown-preview :global(h1) { font-size: 1.5rem; font-weight: bold; margin-bottom: 0.75rem; }
    .markdown-preview :global(h2) { font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem; }
    .markdown-preview :global(h3) { font-size: 1.1rem; font-weight: bold; margin-bottom: 0.5rem; }
    .markdown-preview :global(p) { margin-bottom: 0.75rem; }
    .markdown-preview :global(ul) { padding-left: 1.5rem; margin-bottom: 0.75rem; list-style-type: disc; }
    .markdown-preview :global(ol) { padding-left: 1.5rem; margin-bottom: 0.75rem; list-style-type: decimal; }
    .markdown-preview :global(li) { margin-bottom: 0.25rem; }
    .markdown-preview :global(code) { background: #f4f4f5; padding: 0.15rem 0.35rem; border-radius: 3px; font-size: 0.875em; }
    .markdown-preview :global(pre) { background: #f4f4f5; padding: 0.75rem; border-radius: 6px; overflow-x: auto; margin-bottom: 0.75rem; }
    .markdown-preview :global(pre code) { background: none; padding: 0; }
    .markdown-preview :global(blockquote) { border-left: 3px solid #d1d5db; padding-left: 0.75rem; color: #6b7280; margin-bottom: 0.75rem; }
    .markdown-preview :global(.at-name) {
        display: inline-block;
        padding: 0.05em 0.35em;
        border-radius: 3px;
        font-weight: 500;
        font-size: 0.9em;
    }
    .markdown-preview :global(.metadata-table) { font-size: 0.9rem; border-collapse: collapse;}
    .markdown-preview :global(.metadata-table td) { border-bottom: none; padding-top: 0}
    .markdown-preview :global(.metadata-table .meta-key) {
        width: 1%;
        white-space: nowrap;
        padding-right: 1rem;
        vertical-align: top;
        color: #555;
    }
    .markdown-preview :global(.heading-num) { margin-right: 0.2em; }
</style>
