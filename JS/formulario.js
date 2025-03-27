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
    let electricidad = parseFloat(document.getElementById("electricidad").value) || 0;
    let transporte = document.getElementById("transporte").value;
    let carne = document.getElementById("carne").value;
    let residuos = document.getElementById("residuos").value;

    let consumo = electricidad * 0.5; // Ejemplo de cálculo para electricidad

    // Actualizar el gráfico con el resultado
    window.carbonChartInstance.data.datasets[0].data[0] = consumo;  // Esto es solo un ejemplo
    window.carbonChartInstance.update();

    // Mostrar el resultado
    document.getElementById("resultado").innerHTML = `Tu huella de carbono estimada es de ${consumo} kg de CO₂ al mes.`;
});
