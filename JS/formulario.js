document.addEventListener("DOMContentLoaded", function() {
    let ctx = document.getElementById("carbonChart").getContext("2d");

    // Inicializar gráfico vacío
    window.carbonChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: [
                "Electricidad", "Electrodomésticos", "Transporte", "Tiempo de recorrido", "Frecuencia de transporte público",
                "Consumo de carne", "Tipo de residuos", "Recolección de agua", "Consumo de ropa"
            ],
            datasets: [{
                label: "Emisiones de CO₂ (kg)",
                data: Array(9).fill(0), // Datos iniciales vacíos
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)", "rgba(255, 159, 64, 0.6)",
                    "rgba(199, 199, 199, 0.6)", "rgba(83, 102, 255, 0.6)", "rgba(255, 99, 71, 0.6)"
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

    // Recoger valores de todos los inputs y calcular la huella de carbono

    // Consumo de electricidad (Ejemplo: 0.4 kg de CO₂ por kWh)
    let electricidad = parseFloat(document.getElementById("electricidad").value) || 0;

    // Electrodomésticos seleccionados y sus emisiones (Ejemplo: 0.3 kg CO₂ por electrodoméstico)
    let electrodomesticos = document.querySelectorAll("input[name='electrodomesticos']:checked");
    let electrodomesticosEmisiones = electrodomesticos.length * 0.3;

    // Transporte
    let transporte = document.getElementById("transporte").value;
    let transporteEmisiones = 0;
    switch (transporte) {
        case "Automóvil privado":
            transporteEmisiones = 2.5;
            break;
        case "Motocicleta":
            transporteEmisiones = 1.8;
            break;
        case "Transporte público":
            transporteEmisiones = 1.2;
            break;
        case "Bicicleta":
        case "A pie":
            transporteEmisiones = 0;
            break;
    }

    // Tiempo de recorrido
    let tiempo = document.getElementById("tiempo").value;
    let tiempoEmisiones = {
        "Menos de 15 minutos": 0.2,
        "15-30 minutos": 0.5,
        "30-60 minutos": 1,
        "Más de 60 minutos": 1.5
    }[tiempo] || 0;

    // Frecuencia de transporte público
    let frecuencia = document.getElementById("frecuencia").value;
    let frecuenciaEmisiones = {
        "Diario": 1.2,
        "Semanal": 0.8,
        "Mensual": 0.4,
        "Casi nunca": 0.1
    }[frecuencia] || 0;

    // Consumo de carne
    let carne = document.getElementById("carne").value;
    let carneEmisiones = {
        "Res": 3.5,
        "Cerdo": 2.2,
        "Pollo": 1.5,
        "Pescado": 1,
        "Vegetariano": 0.5
    }[carne] || 0;

    // Tipo de residuos
    let residuos = document.getElementById("residuos").value;
    let residuosEmisiones = (residuos === "Basura general") ? 1.2 : 0.6;

    // Sistema de recolección de agua
    let agua = document.getElementById("agua").value;
    let aguaEmisiones = (agua === "No") ? 0.5 : 0;

    // Consumo de ropa
    let ropa = document.getElementById("ropa").value;
    let ropaEmisiones = (ropa === "Compro nueva") ? 1.2 : 0.6;

    // Calcular la huella de carbono total
    let huellaTotal = (electricidad * 0.4) + electrodomesticosEmisiones + transporteEmisiones + tiempoEmisiones + frecuenciaEmisiones + carneEmisiones + residuosEmisiones + aguaEmisiones + ropaEmisiones;

    // Actualizar el gráfico con los resultados
    window.carbonChartInstance.data.datasets[0].data = [
        electricidad * 0.4, electrodomesticosEmisiones, transporteEmisiones, tiempoEmisiones, frecuenciaEmisiones,
        carneEmisiones, residuosEmisiones, aguaEmisiones, ropaEmisiones
    ];
    window.carbonChartInstance.update();

    // Mostrar el resultado de la huella de carbono
    document.getElementById("resultado").innerHTML = `Tu huella de carbono estimada es de ${huellaTotal.toFixed(2)} kg de CO₂ al mes.`;
});
