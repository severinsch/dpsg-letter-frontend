<script lang="ts">
    import {DefaultApi, type LetterConfigModel, ResponseError} from "../api";
    import {Input} from "$lib/components/ui/input";
    import {Checkbox} from "$lib/components/ui/checkbox";
    import {Textarea} from "$lib/components/ui/textarea";
    import {Button} from "$lib/components/ui/button";
    import * as Select from "$lib/components/ui/select";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Popover from "$lib/components/ui/popover";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import {Info} from "lucide-svelte";
    import {Separator} from "$lib/components/ui/separator";
    import { Label } from "$lib/components/ui/label";
    import {Circle} from 'svelte-loading-spinners';
    import "./createLetter.css";
    import {applyTemplate, emptyModel, validateModel} from "$lib/modelUtils";
    import {contentTemplates, type ContentTemplate} from "$lib/contentTemplates";
    import Drawer from "$lib/Drawer.svelte";
    import Help from "$lib/Help.svelte";
    import MarkdownPreview from "$lib/MarkdownPreview.svelte";

    let apiClient = new DefaultApi();

    let downloadURL: string | undefined = $state();

    let formData: LetterConfigModel = $state(emptyModel);

    let errorDialogOpen = $state(false);
    let errorDialogMessage = $state("");
    let isLoading = $state(false);
    let selectedTemplate = $state("");

    function addToContent(text: string) {
        formData.content += text;
    }

    function applyContentTemplate(template: ContentTemplate) {
        formData.title = template.title;
        addToContent(template.content);
    }

    function showErrorMessage(message: string) {
        errorDialogMessage = message;
        errorDialogOpen = true;
    }

    async function submitForm() {
        try {
            let error = validateModel(formData);
            if(error) {
                showErrorMessage(error)
                return;
            }
            isLoading = true;
            const response = await apiClient.apiV1LetterPostRaw({letterConfigModel: formData});
            isLoading = false;
            if (response.raw.status !== 200) {
                showErrorMessage(`API Error: ${response.raw.status} ${response.raw.statusText}`);
            }
            const blob = await response.value()
            if (response.raw.headers.get('content-type') !== 'application/pdf' || !blob) {
                showErrorMessage('API Error: Invalid response');
            }
            if (downloadURL) URL.revokeObjectURL(downloadURL);
            downloadURL = URL.createObjectURL(blob);
            // Auto-trigger download
            const a = document.createElement('a');
            a.href = downloadURL;
            a.download = 'letter.pdf';
            a.click();
        } catch (error: ResponseError | any) {
            if (error instanceof ResponseError) {
                showErrorMessage(`API Error: ${error.response.status}: ${error.response.statusText} - ${await error.response.text() || 'No additional error message provided'}`);
            } else {
                showErrorMessage(`API Error: ${error}`);
            }
            isLoading = false;
        }
    }
</script>

<div class="page-layout">
<div class="container">
    <div class="form-header">
        <h1>Brief erstellen</h1>
        <div class="header-controls">
            <Select.Root type="single" onValueChange={(v: string) => { selectedTemplate = v; formData = applyTemplate(v, formData); }}>
                <Select.Trigger class="w-[180px]">
                    {selectedTemplate || "Vorlage wählen"}
                </Select.Trigger>
                <Select.Content>
                    <Select.Group>
                        <Select.Item value="Langenbach">Langenbach</Select.Item>
                        <Select.Item value="Freising">Freising</Select.Item>
                        <Select.Item value="Moosburg">Moosburg</Select.Item>
                        <Select.Item value="BezirkFS">Bezirk Freising</Select.Item>
                        <Select.Item value="Custom">Keine</Select.Item>
                    </Select.Group>
                </Select.Content>
            </Select.Root>
            <Drawer bind:formData={formData} />
        </div>
    </div>

    <div class="content-templates">
        <span class="content-templates-label">Vorlage einfügen:</span>
        {#each contentTemplates as template}
            <Button type="button" variant="outline" size="sm" onclick={() => applyContentTemplate(template)}>
                {template.label}
            </Button>
        {/each}
    </div>

    <!-- Form fields -->
    <form onsubmit={submitForm}>
        <Input placeholder="Titel" bind:value={formData.title} />
        <Textarea placeholder="Inhalt" bind:value={formData.content} class="min-h-[200px]" />

        <div class="form-checkbox">
            <Checkbox id="singup" bind:checked={formData.includeSignUp} aria-labelledby="signup-label" />
            <Label id="signup-label" for="signup">Anmeldung anfügen</Label>
        </div>

        <div class="form-checkbox">
            <Checkbox id="toc" bind:checked={formData.includeTableOfContents} aria-labelledby="toc-label" />
            <Label id="toc-label" for="toc">Tagesordnung generieren</Label>
            <Tooltip.Provider>
                <Tooltip.Root>
                    <Tooltip.Trigger>
                        <Info class="toc-info-icon" />
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        <p><code>[toc]</code> oder <code>[agenda]</code> im Inhalt wird durch eine Tagesordnung ersetzt,<br>die aus allen Hauptüberschriften (<code># ...</code>) generiert wird.</p>
                    </Tooltip.Content>
                </Tooltip.Root>
            </Tooltip.Provider>
        </div>

        <Separator />
        <div class="button-group">
            <div class="left-buttons">
                <Button type="submit">PDF erstellen</Button>
                <Button type="button" onclick={() => {
                    if (downloadURL) {
                        const a = document.createElement('a');
                        a.href = downloadURL;
                        a.download = 'letter.pdf';
                        a.click();
                    }
                }}
                disabled={!downloadURL}
                variant={downloadURL ? "default" : "outline"}
                >PDF herunterladen</Button>
            </div>
        </div>
        <Separator />
        <Help />
    </form>
</div>

<div class="preview-panel">
    <h2 class="preview-title">Vorschau</h2>
    {#if formData.content}
        <MarkdownPreview content={formData.content} />
    {:else}
        <div class="preview-empty">Noch kein Inhalt vorhanden</div>
    {/if}
</div>
</div>

<AlertDialog.Root open={isLoading}>
    <AlertDialog.Content class="loading-dialog">
        <AlertDialog.Header>
            <AlertDialog.Title>Wird erstellt…</AlertDialog.Title>
            <AlertDialog.Description class="loading-circle">
                <Circle color="#000000" size="30"/>
            </AlertDialog.Description>
        </AlertDialog.Header>
    </AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root open={errorDialogOpen} onOpenChange={() => {errorDialogOpen=!errorDialogOpen}}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Ein Fehler ist aufgetreten</AlertDialog.Title>
            <AlertDialog.Description>
                {errorDialogMessage}
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel>Schließen</AlertDialog.Cancel>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
