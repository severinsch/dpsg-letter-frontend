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

    function addPerson() {
        formData.people.push({ name: "", email: "", role: VorstandRoleEnum.Vorstand });
    }
</script>

<Collapsible.Root>
    <div class="flex items-center justify-between space-x-4 px-4">
        <h4 class="text-sm font-semibold">Vorstand</h4>

        <Collapsible.Trigger>
            <Button variant="ghost" size="sm" class="w-9 p-0">
                <ChevronsUpDown class="h-4 w-4" />
                <span class="sr-only">Toggle</span>
            </Button>
        </Collapsible.Trigger>
    </div>
    {#each formData.people as person, index}
        <Collapsible.Content>
            <div class="h-4"></div>
            <Card.Root>
                <Card.Header>
                    <div class="flex items-center justify-between space-x-4 px-4">
                        <Card.Title>Person {index + 1}</Card.Title>
                        <Button variant="ghost" size="sm" on:click={() => formData.people.splice(index, 1)}>
                            <CircleX class="h-4 w-4" />
                        </Button>
                    </div>
                </Card.Header>
                <Card.Content>
                    <div class="input-label">
                        <Label for="name">Name</Label>
                        <Input placeholder="Name" bind:value={person.name} />
                    </div>
                    <div class="input-label">
                        <Label for="email">Email</Label>
                        <Input type="email" placeholder="Email" bind:value={person.email} />
                    </div>
                    <div class="input-label">
                        <Label for="role">Rolle</Label>
                        <Select.Root selected={{
                                value: person.role,
                                label: person.role
                            }} onSelectedChange={(v) => v && (person.role = v.value)}>
                            <Select.Trigger class="w-[180px]">
                                <Select.Value placeholder="Rolle" />
                            </Select.Trigger>
                            <Select.Content>
                                <Select.Group>
                                    {#each Object.values(VorstandRoleEnum) as role}
                                        <Select.Item value={role}>{role}</Select.Item>
                                    {/each}
                                </Select.Group>
                            </Select.Content>
                        </Select.Root>
                    </div>
                    {#if person.phone !== undefined}
                        <div class="input-label">
                            <Label for="phone">Telefon</Label>
                            <div class="input-with-remove">
                                <Input placeholder="Telefon" bind:value={person.phone} />
                                <Button variant="ghost" size="sm" on:click={() => {person.phone = undefined}} class="remove-button">
                                    <CircleX class="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    {:else}
                        <Button variant="secondary" on:click={() => {person.phone = ""}}>Add Phone</Button>
                    {/if}
                </Card.Content>
            </Card.Root>
        </Collapsible.Content>
    {/each}
    {#if formData.people.length < 3}
        <Collapsible.Content>
            <div class="flex justify-center" style="margin-top: 1rem;">
                <Button variant="secondary" on:click={addPerson}>Add</Button>
            </div>
        </Collapsible.Content>
    {/if}
</Collapsible.Root>