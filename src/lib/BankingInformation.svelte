<script lang="ts">
    import {type LetterConfigModel, VorstandRoleEnum} from "../api";
    import {Input} from "$lib/components/ui/input";
    import * as Select from "$lib/components/ui/select";
    import * as Collapsible from "$lib/components/ui/collapsible";
    import * as Card from "$lib/components/ui/card";
    import {Button} from "$lib/components/ui/button";
    import {Label} from "$lib/components/ui/label";
    import {ChevronsUpDown, CircleX} from "lucide-svelte";

    let { formData = $bindable() }: {formData: LetterConfigModel} = $props();

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
        <Collapsible.Content>
            <Card.Root>
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
        <div class="h-4"></div>
</Collapsible.Root>