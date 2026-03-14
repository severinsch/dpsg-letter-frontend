<script lang="ts">
    import CalendarIcon from "lucide-svelte/icons/calendar";
    import { cn } from "$lib/utils.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Calendar } from "$lib/components/ui/calendar/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import {
        type DateValue,
        getLocalTimeZone,
        today,
        parseDate,
    } from "@internationalized/date";

    let { value = $bindable() }: {value: string | undefined} = $props();
    let date: DateValue | undefined = $state(value ? parseDate(value) : today(getLocalTimeZone()));

    function formatDate(date: DateValue): string {
        // format to DD.MM.YYYY
        return `${date.day}.${date.month}.${date.year}`;
    }
</script>

<Popover.Root>
    <Popover.Trigger>
        {#snippet child({ props })}
            <Button
                {...props}
                variant="outline"
                class={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !value && "text-muted-foreground"
                )}
            >
                <CalendarIcon class="mr-2 h-4 w-4" />
                {date ? formatDate(date) : "Pick a date"}
            </Button>
        {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-auto p-0">
        <Calendar type="single" bind:value={date} onValueChange={(v: typeof date) => v && (value = v.toString())} />
    </Popover.Content>
</Popover.Root>
