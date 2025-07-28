import { onMount } from 'svelte';

   export onMount(() => {
        // Ensure jQuery and DataTables are loaded globally
        const scriptJquery = document.createElement('script');
        scriptJquery.src = "https://code.jquery.com/jquery-3.7.1.js";
        document.body.appendChild(scriptJquery);

        const scriptMoment = document.createElement('script');
        scriptMoment.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.2/moment.min.js";
        document.body.appendChild(scriptMoment);

        const scriptDataTables = document.createElement('script');
        scriptDataTables.src = "https://cdn.datatables.net/2.3.2/js/dataTables.js";
        document.body.appendChild(scriptDataTables);

        scriptDataTables.onload = () => {
            // Wait for jQuery and DataTables to be loaded before initializing
            if (window.$ && window.$.fn.dataTable) {
                window.$(document).ready(function () {
                    window.$('#parlayStats').DataTable({
                        ajax: 'https://script.google.com/macros/s/AKfycby5KreWSmrrF-c9py6W7d5wLNrkvRceOEN7-b2udD4afUJ622vVs55vef-FgshR4CO2/exec',
                        columns: [
                            { data: 'GM Name' },
                            { data: 'GM Team' },
                            { data: 'Date' },
                            { data: 'Week' },
                            { data: 'Group Parlay Bet' },
                            { data: 'Odds' },
                            { data: 'Group Parlay Win' },
                            { data: 'Bet Category 1' },
                            { data: 'Bet Category 2' }
                        ]
                    });
                });
            }
        };
    });




