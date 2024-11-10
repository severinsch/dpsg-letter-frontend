<script lang="ts">
    import {DefaultApi, type LetterConfigModel} from "../api";
    import {Input} from "$lib/components/ui/input";
    import {Checkbox} from "$lib/components/ui/checkbox";
    import {Textarea} from "$lib/components/ui/textarea";
    import {Button} from "$lib/components/ui/button";
    import * as Select from "$lib/components/ui/select";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Popover from "$lib/components/ui/popover";
    import {Separator} from "$lib/components/ui/separator";
    import { Label } from "$lib/components/ui/label";
    import {Circle} from 'svelte-loading-spinners';
    import "./createLetter.css";
    import {applyTemplate, emptyModel, validateModel} from "$lib/modelUtils";
    import Drawer from "$lib/Drawer.svelte";
    import Help from "$lib/Help.svelte";

    let apiClient = new DefaultApi();

    let downloadURL: string | undefined = $state();

    let formData: LetterConfigModel = $state(emptyModel);

    let errorDialogOpen = $state(false);
    let errorDialogMessage = $state("");
    let isLoading = $state(false);

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
            const response = await apiClient.apiV1LetterPost(formData, {responseType: "blob"});
            isLoading = false;
            if (response.status !== 200) {
                showErrorMessage(`API Error: ${response.status} ${response.statusText} (${response.data})`);
            }
            if (response.headers['content-type'] !== 'application/pdf' || !response.data) {
                showErrorMessage('API Error: Invalid response');
            }
            const blob = response.data as Blob;
            downloadURL = URL.createObjectURL(blob);
        } catch (error) {
            showErrorMessage(`API Error: ${error}`);
        }
    }
</script>

<div class="container">
    <h1>Create Letter</h1>

    <div class="header-controls">
        <Select.Root onSelectedChange={(v) => v && (formData = applyTemplate(v.value, formData))}>
            <Select.Trigger class="w-[180px]">
                <Select.Value placeholder="Select a template" />
            </Select.Trigger>
            <Select.Content>
                <Select.Group>
                    <Select.Item value="Langenbach">Langenbach</Select.Item>
                    <Select.Item value="Freising">Freising</Select.Item>
                    <Select.Item value="Custom">None</Select.Item>
                </Select.Group>
            </Select.Content>
        </Select.Root>
        <Drawer bind:formData={formData} />
    </div>

    <!-- Form fields -->
    <form onsubmit={submitForm}>
        <Input placeholder="Titel" bind:value={formData.title} />
        <Textarea placeholder="Inhalt" bind:value={formData.content} />

        <div class="form-checkbox">
            <Checkbox id="singup" bind:checked={formData.includeSignUp} aria-labelledby="signup-label" />
            <Label id="signup-label" for="signup">Anmeldung anfügen</Label>
        </div>

        <Separator />
        <div class="button-group">
            <div class="left-buttons">
                <Button type="submit">Submit</Button>
                <Button type="button" on:click={() => {
                    if (downloadURL) {
                        const a = document.createElement('a');
                        a.href = downloadURL
                        a.download = 'letter.pdf';
                        a.click();
                    }
                    downloadURL = undefined;
                }}
                disabled={!downloadURL}
                >Download PDF</Button>
            </div>
        </div>
        <Separator />
        <Help />
    </form>
</div>

<AlertDialog.Root open={isLoading} preventScroll={true} closeOnEscape={false} closeOnOutsideClick={false}>
    <AlertDialog.Content class="loading-dialog">
        <AlertDialog.Header>
            <AlertDialog.Title>Loading...</AlertDialog.Title>
            <AlertDialog.Description class="loading-circle">
                <Circle color="#000000" size="30"/>
            </AlertDialog.Description>
        </AlertDialog.Header>
    </AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root open={errorDialogOpen} onOpenChange={() => {errorDialogOpen=!errorDialogOpen}}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Ein Fehler ist aufgetreten:</AlertDialog.Title>
            <AlertDialog.Description>
                {errorDialogMessage}
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel>Close</AlertDialog.Cancel>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
