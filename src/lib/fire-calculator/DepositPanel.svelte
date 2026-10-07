<script lang="ts">
    import type { Deposit } from "#lib/fire-calculator/calc.ts";
    import type { CalculatorForm } from "#lib/fire-calculator/form.ts";
    import { billion, percent } from "#lib/fire-calculator/format.ts";

    let { form = $bindable(), deposit }: { form: CalculatorForm; deposit: Deposit } = $props();
</script>

<div class="panel">
    <h2 class="section-label">Deposit to live on interest</h2>
    <div class="inputs">
        <label>
            <span>Bank interest rate (%)<small>12-month certificate at BIDV or VietinBank: 7.4%</small></span>
            <input type="number" inputmode="decimal" step="0.1" min="0" bind:value={form.bankRate} />
        </label>
        <label>
            <span>Safety margin added to inflation (%)</span>
            <input type="number" inputmode="decimal" step="0.1" min="0" bind:value={form.margin} />
        </label>
        <label>
            <span>Monthly spending in retirement (million VND)</span>
            <input type="number" inputmode="decimal" step="1" min="0" bind:value={form.monthlyExpense} />
        </label>
    </div>

    {#if deposit.kind === "empty"}
        <p class="warning">Enter your spending first.</p>
    {:else if deposit.kind === "negative"}
        <p class="warning">No amount works. The bank rate is not above your inflation.</p>
        <p class="note">
            Real rate: {percent(deposit.bankRate)} − {percent(deposit.usedRate)} = {percent(deposit.realRate)}. Your savings lose buying power every year.
        </p>
    {:else}
        <p class="amount">{billion(deposit.amount, 1)} VND</p>
        <p class="note">
            Real rate: {percent(deposit.bankRate)} − {percent(deposit.usedRate)} = {percent(deposit.realRate)}. Deposit = {deposit.yearlySpend.toFixed(0)} million ÷ {percent(deposit.realRate)}.
        </p>
        <dl class="key-value-list">
            <div><dt>Interest in year 1</dt><dd>{billion(deposit.interest, 2)}</dd></div>
            <div><dt>You spend in year 1</dt><dd>{billion(deposit.yearlySpend, 2)}</dd></div>
            <div><dt>You leave in the bank</dt><dd>{billion(deposit.kept, 2)}</dd></div>
        </dl>
    {/if}
</div>

<style>
    h2 {
        margin-bottom: 0.75rem;
    }

    .inputs {
        display: grid;
        gap: 0.6rem;
    }

    label {
        display: grid;
        grid-template-columns: 1fr 5.5rem;
        gap: 0.75rem;
        align-items: center;
        font-size: 0.85rem;
    }

    small {
        display: block;
        font-size: 0.75rem;
        color: var(--color-text-muted);
    }

    input {
        width: 100%;
    }

    .amount {
        margin: 1.25rem 0 0.25rem;
        font-size: 1.9rem;
        font-weight: 700;
        line-height: 1.1;
    }

    .warning {
        margin: 1.25rem 0 0.25rem;
        font-weight: 600;
        color: var(--color-danger);
    }

    .note {
        margin: 0 0 0.75rem;
        font-size: 0.8rem;
        color: var(--color-text-muted);
    }
</style>
