<script lang="ts">
import {Input} from "$lib/components/ui/input/index.js";
import {Label} from "$lib/components/ui/label/index.js";
import {Checkbox} from "$lib/components/ui/checkbox/index.js";
import {Button} from "$lib/components/ui/button/index.js";
import {Separator} from "$lib/components/ui/separator/index.js";
import {ScrollArea} from "$lib/components/ui/scroll-area";

import * as Select from "$lib/components/ui/select/index.js";
import * as Sheet from "$lib/components/ui/sheet/index.js";
import {type LetterConfigModel} from "../api";
import {LetterConfigModelLogoEnum} from "../api";
import Vorstand from "$lib/Vorstand.svelte";
import DatePicker from "$lib/components/DatePicker.svelte";
import BankingInformation from "$lib/BankingInformation.svelte";


let { formData = $bindable() }: {formData: LetterConfigModel} = $props();

function getLogo(v: string | unknown): LetterConfigModelLogoEnum {
    if (typeof v !== "string") return "DPSG";
    switch (v) {
        case "Langenbach": return "Langenbach";
        case "DPSG": return "DPSG";
        default: return "DPSG";
    }
}
</script>

<Sheet.Root>
    <Sheet.Trigger asChild let:builder>
        <Button builders={[builder]} variant="secondary">Show More</Button>
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
                    <Select.Root selected={{
                    value: formData.logo,
                    label: formData.logo
                }} onSelectedChange={(v) => v && (formData.logo = getLogo(v.value))}>
                        <Select.Trigger class="w-[180px]">
                            <Select.Value placeholder="Logo" />
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Group>
                                {#each Object.values(LetterConfigModelLogoEnum) as logo}
                                    <Select.Item value={logo}>{logo}</Select.Item>
                                {/each}
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
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
                <Vorstand bind:formData={formData} />
                <Separator />
                <BankingInformation bind:formData={formData} />
            </form>
            <Sheet.Footer>
                <Sheet.Close asChild let:builder>
                    <Button builders={[builder]}>Close</Button>
                </Sheet.Close>
            </Sheet.Footer>
        </ScrollArea>
    </Sheet.Content>
</Sheet.Root>
