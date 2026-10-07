<script lang="ts">
    import { GROUPS, RATE_SETS } from "#lib/fire-calculator/data.ts";
    import type { Inflation } from "#lib/fire-calculator/calc.ts";
    import { nationalSpend, officialRates, type CalculatorForm } from "#lib/fire-calculator/form.ts";

    let { form = $bindable(), inflation }: { form: CalculatorForm; inflation: Inflation } = $props();

    const largestContribution = $derived(Math.max(0, ...Object.values(inflation.contributions).map(Math.abs)));

    function barWidth(contribution: number): number {
        return largestContribution > 0 ? (Math.max(0, contribution) / largestContribution) * 100 : 0;
    }
</script>

<section aria-label="Your spending basket">
    <div class="controls">
        <div class="segmented" role="group" aria-label="Price data">
            {#each RATE_SETS as rateSet}
                <button type="button" aria-pressed={form.rateSet === rateSet.id} onclick={() => (form.rateSet = rateSet.id)}>
                    {rateSet.label}
                </button>
            {/each}
        </div>
        <div class="actions">
            <button type="button" onclick={() => (form.spend = nationalSpend())}>Use national basket</button>
            <button type="button" onclick={() => (form.rates = officialRates())}>Reset price changes</button>
        </div>
    </div>

    <div class="row head section-label" aria-hidden="true">
        <span>Group</span><span>Your spending</span><span>Price change</span><span>Adds to your inflation</span>
    </div>
    {#each GROUPS as group (group.id)}
        <div class="row">
            <div class="name">
                <strong>{group.name}</strong>
                <span>{group.vietnameseName}{#if group.calculated}&nbsp;<small>(calculated)</small>{/if}</span>
            </div>
            <label class="field spend" data-label="Spending">
                <input
                    type="number"
                    inputmode="decimal"
                    min="0"
                    step="0.1"
                    bind:value={form.spend[group.id]}
                    aria-label="{group.name} monthly spending in million VND"
                />
                <span>M</span>
            </label>
            <label class="field rate" data-label="Price change">
                <input
                    type="number"
                    inputmode="decimal"
                    step="0.01"
                    bind:value={form.rates[form.rateSet][group.id]}
                    aria-label="{group.name} price change in percent"
                />
                <span>%</span>
            </label>
            <div class="contribution">
                <span class="bar"><span style:width="{barWidth(inflation.contributions[group.id])}%"></span></span>
                <output>{inflation.contributions[group.id].toFixed(2)}</output>
            </div>
        </div>
    {/each}
    <div class="total">
        <span>Total monthly spending</span>
        <span>{inflation.totalSpend.toFixed(2)} million VND</span>
    </div>
</section>

<style>
    .controls {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem 1rem;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.5rem;
    }

    .segmented {
        display: inline-flex;
        padding: 2px;
        border: 1px solid var(--color-border);
        border-radius: var(--radius);
    }

    .segmented button {
        color: var(--color-text-muted);
        border-color: transparent;
        border-radius: var(--radius-sm);
    }

    .segmented button:hover {
        color: var(--color-accent);
    }

    .segmented button[aria-pressed="true"] {
        font-weight: 600;
        color: var(--color-accent);
        background-color: var(--color-accent-soft);
    }

    .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .row {
        display: grid;
        grid-template-columns: minmax(0, 1.6fr) 6.5rem 5.5rem minmax(0, 1fr);
        gap: 0.75rem;
        align-items: center;
        padding: 0.6rem 0;
        border-top: 1px solid var(--color-border);
    }

    .head {
        align-items: end;
        padding-top: 0;
        border-top: 0;
    }

    .name strong {
        display: block;
        font-size: 0.95rem;
        font-weight: 600;
    }

    .name span {
        display: block;
        font-size: 0.8rem;
        color: var(--color-text-muted);
    }

    .field {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .field input {
        width: 100%;
        min-width: 0;
    }

    .field span {
        font-size: 0.8rem;
        color: var(--color-text-muted);
    }

    .contribution {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.85rem;
    }

    .bar {
        flex: 1;
        height: 6px;
        overflow: hidden;
        background-color: var(--color-accent-soft);
        border-radius: 3px;
    }

    .bar span {
        display: block;
        height: 100%;
        background-color: var(--color-accent);
    }

    output {
        min-width: 2.75rem;
        text-align: right;
    }

    .total {
        display: flex;
        justify-content: space-between;
        padding-top: 0.75rem;
        font-weight: 600;
        border-top: 1px solid var(--color-border);
    }

    @media (max-width: 600px) {
        .row {
            grid-template-columns: 1fr 1fr;
            grid-template-areas: "name name" "spend rate" "contribution contribution";
            gap: 0.5rem 0.75rem;
        }

        .name {
            grid-area: name;
        }

        .spend {
            grid-area: spend;
        }

        .rate {
            grid-area: rate;
        }

        .contribution {
            grid-area: contribution;
        }

        .head {
            display: none;
        }

        .field::before {
            content: attr(data-label);
            margin-right: 0.35rem;
            font-size: 0.75rem;
            white-space: nowrap;
            color: var(--color-text-muted);
        }
    }
</style>
