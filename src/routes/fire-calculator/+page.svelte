<script lang="ts">
    import { onMount } from "svelte";
    import Basket from "#lib/fire-calculator/Basket.svelte";
    import DepositPanel from "#lib/fire-calculator/DepositPanel.svelte";
    import InflationPanel from "#lib/fire-calculator/InflationPanel.svelte";
    import { computeDeposit, computeInflation } from "#lib/fire-calculator/calc.ts";
    import { GROUPS, OFFICIAL_CPI } from "#lib/fire-calculator/data.ts";
    import { defaultForm, loadForm, saveForm } from "#lib/fire-calculator/form.ts";
    import { billion, percent } from "#lib/fire-calculator/format.ts";

    const DESCRIPTION =
        "Enter how much you spend each month in each group. The page weights the official price change of each group by your own spending. Then the page shows the bank deposit you need to live on interest without losing buying power.";

    let form = $state(defaultForm());
    let isLoaded = false;

    const inflation = $derived(computeInflation(GROUPS, form.spend, form.rates[form.rateSet]));
    const deposit = $derived(computeDeposit(inflation, form.bankRate, form.margin, form.monthlyExpense));
    const mobileRate = $derived(inflation.totalSpend > 0 ? percent(inflation.personal) : "–");
    const mobileDeposit = $derived.by(() => {
        if (deposit.kind === "ok") return `Deposit ${billion(deposit.amount, 1)} VND`;
        if (deposit.kind === "negative") return `Real rate ${percent(deposit.realRate)}`;
        return "";
    });

    onMount(() => {
        form = loadForm() ?? form;
        isLoaded = true;
    });

    $effect(() => {
        const snapshot = $state.snapshot(form);
        if (isLoaded) saveForm(snapshot);
    });
</script>

<svelte:head>
    <title>Personal inflation calculator (Vietnam) · thethongngu</title>
    <meta name="description" content={DESCRIPTION} />
    <meta property="og:title" content="Personal inflation calculator (Vietnam)" />
    <meta property="og:description" content={DESCRIPTION} />
</svelte:head>

<main>
    <header>
        <h1>Your own inflation rate</h1>
        <p class="lead">{DESCRIPTION}</p>
    </header>

    <div class="layout">
        <Basket bind:form {inflation} />
        <aside>
            <InflationPanel {inflation} officialRate={OFFICIAL_CPI[form.rateSet]} />
            <DepositPanel bind:form {deposit} />
        </aside>
    </div>

    <section class="sources">
        <h2 class="section-label">How the numbers work</h2>
        <p>
            Your inflation = the sum of (your share of spending in each group × the price change of that group). The official CPI uses a price index with fixed weights, so the national basket on this page gives a result about 0.05 to 0.1 points away from the official number.
        </p>
        <p>
            Deposit = yearly spending ÷ (bank rate − inflation − safety margin). You spend the real interest each year and leave the rest in the bank, so the deposit grows with prices.
        </p>
        <p>
            Weights: Vietnam Statistics Office, CPI basket 2025 to 2030 (base year 2024, 775 items). Price changes: Vietnam Statistics Office, price report for September and 9 months of 2026, published 30 September 2026. The groceries row is calculated from the official food group and eating-out numbers.
        </p>
        <p>
            <a href="https://www.nso.gov.vn/wp-content/uploads/2026/01/DVG_Infographics-CPI-1.pdf">CPI weights 2025 to 2030</a>
            and
            <a href="https://www.nso.gov.vn/wp-content/uploads/2026/10/Tong-quan-CPI-chi-so-gia-vang-do-la-My-thang-9-QIII-va-9-thang-nam-2026.pdf">September 2026 price report</a>.
        </p>
    </section>

    <div class="mobile-bar" aria-hidden="true">
        <span>Your inflation <strong>{mobileRate}</strong></span>
        <span>{mobileDeposit}</span>
    </div>
</main>

<style>
    main {
        font-variant-numeric: tabular-nums;
    }

    header {
        max-width: 42rem;
        margin-bottom: 2.5rem;
    }

    h1 {
        margin-bottom: 0.4rem;
    }

    .lead {
        margin: 0;
        color: var(--color-text-muted);
    }

    .layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 18.5rem;
        gap: 2rem;
        align-items: start;
    }

    aside {
        position: sticky;
        top: 1rem;
        display: grid;
        gap: 1rem;
    }

    .sources {
        max-width: 42rem;
        margin-top: 3rem;
        font-size: 0.85rem;
        color: var(--color-text-muted);
    }

    .sources p {
        margin: 0 0 0.6rem;
    }

    .sources a {
        text-decoration: underline;
        text-decoration-color: color-mix(in srgb, var(--color-accent) 40%, transparent);
        text-underline-offset: 0.15em;
    }

    .sources a:hover {
        text-decoration-color: currentColor;
    }

    .mobile-bar {
        display: none;
    }

    @media (max-width: 860px) {
        .layout {
            grid-template-columns: 1fr;
        }

        aside {
            position: static;
        }

        .mobile-bar {
            position: fixed;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 1;
            display: flex;
            justify-content: space-between;
            gap: 0.75rem;
            padding: 0.6rem 1.25rem;
            font-size: 0.85rem;
            background-color: var(--color-bg);
            border-top: 1px solid var(--color-border);
        }

        .mobile-bar strong {
            color: var(--color-accent);
        }
    }
</style>
