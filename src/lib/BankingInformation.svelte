<script lang="ts">
    import {type LetterConfigModel, VorstandRoleEnum} from "../api";
    import {Input} from "$lib/components/ui/input";
    import * as Collapsible from "$lib/components/ui/collapsible";
    import * as Card from "$lib/components/ui/card";
    import {Button} from "$lib/components/ui/button";
    import {Label} from "$lib/components/ui/label";
    import {ChevronsUpDown, CircleX} from "lucide-svelte";

    let { formData = $bindable() }: {formData: LetterConfigModel} = $props();

    function addBankInformation() {
        formData.bankInformation = {bankName: "", orgName: "", iban: ""}
    }
</script>

<Collapsible.Root>
    <div class="flex items-center justify-between space-x-4 px-4">
        <h4 class="text-sm font-semibold">Bank Information</h4>

        <Collapsible.Trigger>
            <Button variant="ghost" size="sm" class="w-9 p-0">
                <ChevronsUpDown class="h-4 w-4" />
                <span class="sr-only">Toggle</span>
            </Button>
        </Collapsible.Trigger>
    </div>
    {#if formData.bankInformation === undefined || formData.bankInformation == null}
        <Collapsible.Content>
            <div class="flex justify-center" style="margin-top: 1rem;">
                <Button variant="secondary" on:click={addBankInformation}>Add</Button>
            </div>
        </Collapsible.Content>
    {:else}
        <Collapsible.Content>
            <Card.Root>
                <Card.Header>
                    <div class="flex items-center justify-between space-x-4 px-4">
                        <Card.Title>Konto</Card.Title>
                        <Button variant="ghost" size="sm" on:click={() => formData.bankInformation = undefined}>
                            <CircleX class="h-4 w-4" />
                        </Button>
                    </div>
                </Card.Header>
                <Card.Content>
                    <div class="input-label">
                        <Label for="orgName">Name Stamm</Label>
                        <Input placeholder="Name Stamm" bind:value={formData.bankInformation.orgName} />
                    </div>
                    <div class="input-label">
                        <Label for="bankName">Bank</Label>
                        <Input placeholder="Bank" bind:value={formData.bankInformation.bankName} />
                    </div>
                    <div class="input-label">
                        <Label for="iban">IBAN</Label>
                        <Input placeholder="IBAN" bind:value={formData.bankInformation.iban} />
                    </div>
                </Card.Content>
            </Card.Root>
        </Collapsible.Content>
    {/if}
        <div class="h-4"></div>
</Collapsible.Root>