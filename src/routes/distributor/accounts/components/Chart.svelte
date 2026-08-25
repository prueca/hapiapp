<script lang="ts">
    import { Pie } from 'svelte-chartjs'
    import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

    ChartJS.register(ArcElement, Tooltip, Legend)

    const labels = ['Distributor', 'Dealer', 'Franchisee']
    const colors = ['#e16660', '#ff9671', '#ffc75f']

    const data = {
        labels,
        datasets: [
            {
                data: [60, 25, 15],
                backgroundColor: colors
            }
        ]
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'bottom' as const,
                labels: {
                    boxWidth: 12,
                    padding: 15,
                    font: {
                        size: 12
                    }
                }
            }
        }
    }
</script>

<div class="chart">
    <div class="mb-2">Graphical Chart</div>
    <div class="rounded-lg bg-white p-4">
        <div class="chart-wrapper">
            <Pie {data} {options} />
        </div>
        <div class="legend">
            {#each data.labels as label, i}
                <div class="legend-item">
                    <span class="dot" style={`background-color: ${colors[i]}`}></span>
                    <span>{label}</span>
                </div>
            {/each}
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .chart {
        @apply mb-6 px-4;
    }

    .chart-wrapper {
        @apply mx-auto mb-4 h-40 w-40;
    }

    .legend {
        @apply flex flex-row flex-nowrap items-center justify-center gap-4 text-sm whitespace-nowrap;
    }

    .legend-item {
        @apply flex flex-row items-center gap-1.5;
    }

    .dot {
        @apply -mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full;
    }
</style>
