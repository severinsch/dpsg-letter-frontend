<script>
import {Button} from "$lib/components/ui/button";
import * as Popover from "$lib/components/ui/popover";
import * as Accordion from "$lib/components/ui/accordion";
</script>

<Accordion.Root type="single" class="w-full">
    <Accordion.Item value="item-1">
        <Accordion.Trigger>Formatierungsregeln anzeigen</Accordion.Trigger>
        <Accordion.Content>
            <div class="help-content">
                <table class="markdown-table">
                    <thead>
                    <tr>
                        <th>Code</th>
                        <th>Result</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td><code>**bold** and *italic*<br>__bold__ and _italic_</code></td>
                        <td><strong>bold</strong> and <em>italic</em></td>
                    </tr>
                    <tr>
                        <td>
                            <code>- Item one<br>- Item two</code>
                            <small>Note: Leave a blank line before and after lists.</small>
                        </td>
                        <td>
                            <ul style="list-style-type: disc; padding-left: 1.2rem;">
                                <li>Item one</li>
                                <li>Item two</li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>
                                ```table<br>
                                Item:&nbsp;Value<br>
                                Something:&nbsp;Else<br>
                                ```<br>
                            </code>
                        </td>
                        <td>
                            <table class="latex-table" style="width: 100%; border-collapse: collapse; border: none;">
                                <tbody>
                                <tr style="border: none;">
                                    <td style="width: 30%; padding: 0; vertical-align: top; border: none;">Item:</td>
                                    <td style="padding: 0; vertical-align: top; font-weight: bold; border: none;">Value</td>
                                </tr>
                                <tr style="border: none;">
                                    <td style="width: 30%; padding: 0; vertical-align: top; border: none;">Something:&nbsp;&nbsp;</td>
                                    <td style="padding: 0; vertical-align: top; font-weight: bold; border: none;">Else</td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>## Zwischenüberschrift &#123-&#125</code>
                            <small>Different levels from # down to ###</small>
                        </td>
                        <td><h2>Zwischenüberschrift</h2></td>
                    </tr>
                    <tr>
                        <td>
                            <code>@sev und @Max_Mustermann</code>
                            <small>Gleiche Namen erhalten gleiche Farbe.</small>
                        </td>
                        <td><span style="background-color:rgba(33,220,229,0.7)">sev</span> und <span style="background-color:rgba(229,89,184,0.7)">Max Mustermann</span></td>
                    </tr>
                    <tr>
                        <td>
                            <code>[toc]</code> oder <code>[agenda]</code>
                            <small>Nur wenn „Tagesordnung generieren" aktiviert ist.</small>
                        </td>
                        <td>Wird durch eine Tagesordnung ersetzt, die aus allen Hauptüberschriften (# ...) im Inhalt generiert wird.</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </Accordion.Content>
    </Accordion.Item>
</Accordion.Root>
