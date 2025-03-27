document.addEventListener("DOMContentLoaded", function() {
    let ctx = document.getElementById("carbonChart").getContext("2d");

    // Inicializar gráfico vacío
    window.carbonChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: [
                "Electricidad", "Televisor", "Computadora", "Laptop", "Consola de videojuegos",
                "Refrigerador", "Lavadora", "Secadora", "Horno microondas", "Transporte",
                "Tiempo de recorrido", "Frecuencia de transporte público", "Comida de Carne",
                "Tipo de residuos", "Sistema de recolección de agua", "Consumo de ropa"
            ],
            datasets: [{
                label: "Emisiones de CO₂ (kg)",
                data: Array(15).fill(0), // Datos iniciales vacíos
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)", "rgba(255, 159, 64, 0.6)",
                    "rgba(199, 199, 199, 0.6)", "rgba(83, 102, 255, 0.6)", "rgba(255, 99, 71, 0.6)",
                    "rgba(34, 193, 195, 0.6)", "rgba(253, 187, 45, 0.6)", "rgba(98, 255, 98, 0.6)",
                    "rgba(255, 174, 255, 0.6)", "rgba(255, 74, 255, 0.6)", "rgba(74, 255, 198, 0.6)"
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

    // Recoger valores de todos los inputs

    // Consumo de electricidad
    let electricidad = parseFloat(document.getElementById("electricidad").value) || 0;

    // Electrodomésticos (tomamos como ejemplo un valor arbitrario de 1 kg de CO2 por dispositivo)
    let electrodomesticos = document.querySelectorAll("input[name='electrodomesticos']:checked");
    let electrodomesticosEmisiones = electrodomesticos.length * 0.5; // Asignamos 0.5 kg de CO2 por electrodoméstico usado

    // Transporte (tomamos un valor estimado de emisiones por tipo de transporte)
    let transporte = document.getElementById("transporte").value;
    let transporteEmisiones = 0;
    switch (transporte) {
        case "Automóvil privado":
            transporteEmisiones = 2; // Suponiendo 2 kg CO2 por kilómetro recorrido
            break;
        case "Motocicleta":
            transporteEmisiones = 1.5; // Motocicleta emite menos CO2
            break;
        case "Transporte público":
            transporteEmisiones = 1; // El transporte público tiene menos emisiones
            break;
        case "Bicicleta":
            transporteEmisiones = 0.2; // Casi nula emisión de CO2
            break;
        case "A pie":
            transporteEmisiones = 0; // No emite CO2
            break;
        default:
            transporteEmisiones = 1; // Si es otro, asumimos un valor promedio
    }

    // Tiempo de recorrido
    let tiempo = document.getElementById("tiempo").value;
    let tiempoEmisiones = 0;
    switch (tiempo) {
        case "Menos de 15 minutos":
            tiempoEmisiones = 0.2;
            break;
        case "15-30 minutos":
            tiempoEmisiones = 0.5;
            break;
        case "30-60 minutos":
            tiempoEmisiones = 1;
            break;
        case "Más de 60 minutos":
            tiempoEmisiones = 1.5;
            break;
    }

    // Comida de carne
    let carne = document.getElementById("carne").value;
    let carneEmisiones = 0;
    if (carne === "Res") carneEmisiones = 3; // Res emite más CO2
    if (carne === "Cerdo") carneEmisiones = 2;
    if (carne === "Pollo") carneEmisiones = 1;
    if (carne === "Pescado") carneEmisiones = 0.8;

    // Tipo de residuos
    let residuos = document.getElementById("residuos").value;
    let residuosEmisiones = (residuos === "Basura general") ? 1 : 0.5; // Basura general tiene mayor huella

    // Sistema de recolección de agua
    let agua = document.getElementById("agua").value;
    let aguaEmisiones = (agua === "No") ? 0.5 : 0;

    // Consumo de ropa
    let ropa = document.getElementById("ropa").value;
    let ropaEmisiones = (ropa === "Compro nueva") ? 1 : 0.5;

    // Calcular la huella de carbono total
    let huellaTotal = electricidad * 0.5 + electrodomesticosEmisiones + transporteEmisiones + tiempoEmisiones + carneEmisiones + residuosEmisiones + aguaEmisiones + ropaEmisiones;

    // Actualizar el gráfico con el resultado
    window.carbonChartInstance.data.datasets[0].data = [
        electricidad * 0.5, electrodomesticosEmisiones, transporteEmisiones, tiempoEmisiones, carneEmisiones,
        residuosEmisiones, aguaEmisiones, ropaEmisiones
    ];
    window.carbonChartInstance.update();

    // Mostrar el resultado
    document.getElementById("resultado").innerHTML = `Tu huella de carbono estimada es de ${huellaTotal.toFixed(2)} kg de CO₂ al mes.`;
});
