<script lang="ts">
    import type { Inflation } from "#lib/fire-calculator/calc.ts";
    import { percent } from "#lib/fire-calculator/format.ts";

    let { inflation, officialRate }: { inflation: Inflation; officialRate: number } = $props();

    const GAUGE_MAX_RATE = 10;

    const isEmpty = $derived(inflation.totalSpend <= 0);
    const difference = $derived(inflation.personal - officialRate);

    function gaugeLeft(rate: number): string {
        const position = Math.min(100, Math.max(0, (rate / GAUGE_MAX_RATE) * 100));
        return `calc(${position}% - 1px)`;
    }
</script>

<div class="panel" aria-live="polite">
    <h2 class="section-label">Your inflation</h2>
    <p class="rate">{isEmpty ? "–" : percent(inflation.personal)}</p>
    <dl class="key-value-list">
        <div><dt>Official CPI</dt><dd>{percent(officialRate)}</dd></div>
        <div><dt>National basket, same method</dt><dd>{percent(inflation.national)}</dd></div>
        <div>
            <dt>Your rate minus official CPI</dt>
            <dd>{isEmpty ? "–" : `${difference >= 0 ? "+" : ""}${difference.toFixed(2)} points`}</dd>
        </div>
    </dl>
    <div class="gauge" aria-hidden="true">
        <span class="marker official" style:left={gaugeLeft(officialRate)}></span>
        {#if !isEmpty}
            <span class="marker personal" style:left={gaugeLeft(inflation.personal)}></span>
        {/if}
    </div>
    <div class="gauge-legend" aria-hidden="true">
        <span>0%</span><span>Grey: official. Blue: you.</span><span>{GAUGE_MAX_RATE}%</span>
    </div>
    {#if isEmpty}
        <p class="empty">Enter your monthly spending to see your rate.</p>
    {/if}
</div>

<style>
    h2 {
        margin-bottom: 0.5rem;
    }

    .rate {
        margin: 0 0 1rem;
        font-size: 2.75rem;
        font-weight: 700;
        line-height: 1;
        letter-spacing: -0.02em;
        color: var(--color-accent);
    }

    .gauge {
        position: relative;
        height: 8px;
        margin: 1.25rem 0 0.4rem;
        background-color: var(--color-border);
        border-radius: 4px;
    }

    .marker {
        position: absolute;
        top: -4px;
        width: 3px;
        height: 16px;
        border-radius: 2px;
    }

    .official {
        background-color: var(--color-text-muted);
    }

    .personal {
        background-color: var(--color-accent);
    }

    .gauge-legend {
        display: flex;
        justify-content: space-between;
        font-size: 0.75rem;
        color: var(--color-text-muted);
    }

    .empty {
        margin: 0.75rem 0 0;
        font-size: 0.85rem;
        color: var(--color-danger);
    }
</style>
