<script lang="ts">
import {Input} from "$lib/components/ui/input/index.js";
import {Label} from "$lib/components/ui/label/index.js";
import {Checkbox} from "$lib/components/ui/checkbox/index.js";
import {Button} from "$lib/components/ui/button/index.js";
import {Separator} from "$lib/components/ui/separator/index.js";
import {ScrollArea} from "$lib/components/ui/scroll-area";

import * as Select from "$lib/components/ui/select/index.js";
import * as Sheet from "$lib/components/ui/sheet/index.js";
import {DefaultApi, type LetterConfigModel} from "../api";
import {LetterConfigModelLogoEnum} from "../api";
import Vorstand from "$lib/Vorstand.svelte";
import DatePicker from "$lib/components/DatePicker.svelte";
import BankingInformation from "$lib/BankingInformation.svelte";
import {CircleX} from "lucide-svelte";

let { formData = $bindable() }: {formData: LetterConfigModel} = $props();

function getLogo(v: string | unknown): LetterConfigModelLogoEnum {
    if (typeof v !== "string") return "DPSG";
    switch (v) {
        case "Langenbach": return "Langenbach";
        case "DPSG": return "DPSG";
        case "Moosburg": return "Moosburg";
        default: return "DPSG";
    }
}

let logoUrlMap = $state(new Map<string, string>());

let apiClient = new DefaultApi();

// fetch logos once and store them in browser
// for each Drawer open/Select open a blob: URL call to get the cached image is done
$effect(() => {
    const logosToFetch = Object.values(LetterConfigModelLogoEnum);

    const fetchPromises = logosToFetch.map(async (logo) => {
        try {
            const response = await apiClient.apiV1InfoLogoOrgNameGetRaw({ orgName: logo });
            const blob = await response.value()
            const url = URL.createObjectURL(blob);
            return [logo, url];
        } catch (error) {
            console.error(`Failed to fetch logo for ${logo}:`, error);
            return null;
        }
    });

    Promise.all(fetchPromises).then(results => {
        logoUrlMap = new Map(results.filter(r => r !== null) as [string, string][]);
    });

    // return cleanup function
    return () => {
        console.log("Cleaning up logo object URLs...");
        for (const url of logoUrlMap.values()) {
            URL.revokeObjectURL(url);
        }
    };
});

</script>

<Sheet.Root>
    <Sheet.Trigger>
        {#snippet child({ props })}
            <Button {...props} variant="secondary">Show More</Button>
        {/snippet}
    </Sheet.Trigger>
    <Sheet.Content side="right">
        <ScrollArea class="scroll-area">
            <Sheet.Header>
                <Sheet.Title>Zusätzliche Optionen</Sheet.Title>
            </Sheet.Header>
            <form>
                <Separator />
                <div class="input-label">
                    <Label for="place">Ort</Label>
                    <Input placeholder="Ort" bind:value={formData.place} />
                </div>
                <div class="input-label">
                    <Label for="date">Datum</Label>
                    <DatePicker bind:value={formData.date} />
                </div>
                <Separator />
                <div class="form-checkbox">
                    <Checkbox id="frontpage" bind:checked={formData.includeFrontPage} aria-labelledby="frontpage-label" />
                    <Label id="frontpage-label" for="frontpage">Titelseite anfügen</Label>
                </div>
                <div class="form-checkbox">
                    <Checkbox id="holidaylaw" bind:checked={formData.includeHolidayLawPage} aria-labelledby="holidaylaw-label" />
                    <Label id="holidaylaw-label" for="holidaylaw">Urlaubsgesetz anfügen</Label>
                </div>
                <div class="form-checkbox">
                    <Checkbox id="abroad" bind:checked={formData.signUpIncludeAbroadClause} aria-labelledby="abroad-label" />
                    <Label id="abroad-label" for="abroad">Auslandslager?</Label>
                </div>
                <Separator />
                <div class="input-label">
                    <Label for="organizationName">Stammes Name</Label>
                    <Input placeholder="Stammes Name" bind:value={formData.organizationName} />
                </div>
                <div class="input-label">
                    <Label for="address">Addresse</Label>
                    <Input placeholder="Addresse" bind:value={formData.address} />
                </div>

                <div class="input-label">
                    <Label for="logo">Logo</Label>
                    <Select.Root type="single" value={formData.logo} onValueChange={(v: string) => (formData.logo = getLogo(v))}>
                        <Select.Trigger class="w-[180px]">
                            <div class="select-item-content">
                                {#if formData.logo && logoUrlMap.has(formData.logo)}
                                    <img src={logoUrlMap.get(formData.logo)} alt="{formData.logo} Logo" class="select-item-thumbnail" />
                                {/if}
                                {formData.logo || "Logo"}
                            </div>
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Group>
                                {#each Object.values(LetterConfigModelLogoEnum) as logo}
                                    <Select.Item value={logo} label={logo}>
                                        <div class="select-item-content">
                                            {#if logoUrlMap.has(logo)}
                                                <img src={logoUrlMap.get(logo)} alt="{logo} Logo" class="select-item-thumbnail" />
                                            {/if}
                                            <span>{logo}</span>
                                        </div>
                                    </Select.Item>
                                {/each}
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
                </div>
                <div class="input-container">
                    {#if formData.website !== undefined}
                        <div class="input-label">
                            <Label for="website">Website</Label>
                            <div class="input-with-remove">
                                <Input placeholder="Website" bind:value={formData.website} />
                                <Button variant="ghost" size="sm" onclick={() => {formData.website = undefined}} class="remove-button">
                                    <CircleX class="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    {:else}
                        <Button variant="secondary" onclick={() => {formData.website = ""}}>Add website</Button>
                    {/if}
                </div>

                <Separator />
                <Vorstand bind:formData={formData} />
                <Separator />
                <BankingInformation bind:formData={formData} />
            </form>
            <Sheet.Footer>
                <Sheet.Close>
                    {#snippet child({ props })}
                        <Button {...props}>Close</Button>
                    {/snippet}
                </Sheet.Close>
            </Sheet.Footer>
        </ScrollArea>
    </Sheet.Content>
</Sheet.Root>
