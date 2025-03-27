document.addEventListener("DOMContentLoaded", function() {
    let ctx = document.getElementById("carbonChart").getContext("2d");

    // Inicializar gráfico vacío
    window.carbonChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: [
                "Electricidad", "Transporte", "Gas",
                "Vuelos", "Transporte Público", "Plásticos",
                "Ropa", "Alimentos", "Productos"
            ],
            datasets: [{
                label: "Emisiones de CO₂ (kg)",
                data: Array(9).fill(0), // Datos iniciales vacíos
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                    "rgba(199, 199, 199, 0.6)",
                    "rgba(83, 102, 255, 0.6)",
                    "rgba(255, 99, 71, 0.6)"
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});

// Manejo del formulario y cálculos
document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevenir el envío del formulario

    // Recoger valores (se asegura de que no sean undefined o vacíos)
    let electricidad = parseFloat(document.getElementById("electricidad").value) || 0;
    let transporte = parseFloat(document.getElementById("transporte").value) || 0;
    let gas = parseFloat(document.getElementById("gas").value) || 0;
    let flights = Math.max(1, parseInt(document.getElementById("flights").value) || 1);
    let transportation = Math.max(1, parseInt(document.getElementById("transportation").value) || 1);
    let plasticUse = Math.max(1, parseInt(document.getElementById("plasticUse").value) || 1);
    let clothes = Math.max(1, parseInt(document.getElementById("clothes").value) || 1);
    let foodPurchases = Math.max(1, parseInt(document.getElementById("foodPurchases").value) || 1);
    let productType = Math.max(1, parseInt(document.getElementById("productType").value) || 1);

    // Factores de emisión (kgCO2 por unidad)
    const EMISSION_FACTORS = {
        electricidad: 0.233, // kgCO2/kWh
        transporte: 0.24, // kgCO2/km
        gas: 1.9, // kgCO2/m³
        vuelos: [0, 200, 500, 1200], // kgCO2 por vuelo anual
        transportePublico: [400, 300, 100, 50, 0], // kgCO2 por tipo de transporte
        plastic: [0, 10, 50, 100], // kgCO2 anuales por plásticos
        ropa: [5, 10, 20], // kgCO2 anuales por compras de ropa
        alimentos: [50, 100, 150], // kgCO2 anuales por alimentos
        productos: [20, 50, 80, 30] // kgCO2 anuales por tipo de productos
    };

    // Asegurar índices válidos
    let emisiones = {
        electricidad: electricidad * EMISSION_FACTORS.electricidad,
        transporte: transporte * EMISSION_FACTORS.transporte,
        gas: gas * EMISSION_FACTORS.gas,
        vuelos: EMISSION_FACTORS.vuelos[Math.min(flights - 1, EMISSION_FACTORS.vuelos.length - 1)],
        transportePublico: EMISSION_FACTORS.transportePublico[Math.min(transportation - 1, EMISSION_FACTORS.transportePublico.length - 1)],
        plastic: EMISSION_FACTORS.plastic[Math.min(plasticUse - 1, EMISSION_FACTORS.plastic.length - 1)],
        ropa: EMISSION_FACTORS.ropa[Math.min(clothes - 1, EMISSION_FACTORS.ropa.length - 1)],
        alimentos: EMISSION_FACTORS.alimentos[Math.min(foodPurchases - 1, EMISSION_FACTORS.alimentos.length - 1)],
        productos: EMISSION_FACTORS.productos[Math.min(productType - 1, EMISSION_FACTORS.productos.length - 1)]
    };

    // Sumar total de emisiones
    let totalEmissions = Object.values(emisiones).reduce((acc, val) => acc + val, 0);

    // Mostrar resultado
    document.getElementById("resultado").textContent = `Tu huella de carbono es: ${totalEmissions.toFixed(2)} kg CO₂`;

    // Actualizar gráfico con nuevos datos
    window.carbonChartInstance.data.datasets[0].data = Object.values(emisiones);
    window.carbonChartInstance.update();
});
