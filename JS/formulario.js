    document.addEventListener("DOMContentLoaded", function() {
    let ctx = document.getElementById("carbonChart").getContext("2d");

    // Verificar si el canvas existe antes de inicializar el gráfico
    if (!ctx) {
    console.error("Elemento 'carbonChart' no encontrado.");
    return;
}

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

    // Manejo del formulario y cálculos
    let form = document.querySelector("form");
    if (!form) {
    console.error("Formulario no encontrado.");
    return;
}

    form.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevenir el envío del formulario

    // Recoger valores de todos los inputs y calcular la huella de carbono
    let electricidad = parseFloat(document.getElementById("electricidad")?.value) || 0;
    let electrodomesticos = document.querySelectorAll("input[name='electrodomesticos']:checked").length * 0.3;
    let transporte = document.getElementById("transporte")?.value || "";
    let tiempo = document.getElementById("tiempo")?.value || "";
    let frecuencia = document.getElementById("frecuencia")?.value || "";
    let carne = document.getElementById("carne")?.value || "";
    let residuos = document.getElementById("residuos")?.value || "";
    let agua = document.getElementById("agua")?.value || "";
    let ropa = document.getElementById("ropa")?.value || "";

    // Emisiones basadas en selección
    let transporteEmisiones = {
    "Automóvil privado": 2.5,
    "Motocicleta": 1.8,
    "Transporte público": 1.2,
    "Bicicleta": 0,
    "A pie": 0
}[transporte] || 0;

    let tiempoEmisiones = {
    "Menos de 15 minutos": 0.2,
    "15-30 minutos": 0.5,
    "30-60 minutos": 1,
    "Más de 60 minutos": 1.5
}[tiempo] || 0;

    let frecuenciaEmisiones = {
    "Diario": 1.2,
    "Semanal": 0.8,
    "Mensual": 0.4,
    "Casi nunca": 0.1
}[frecuencia] || 0;

    let carneEmisiones = {
    "Res": 3.5,
    "Cerdo": 2.2,
    "Pollo": 1.5,
    "Pescado": 1,
    "Vegetariano": 0.5
}[carne] || 0;

    let residuosEmisiones = (residuos === "Basura general") ? 1.2 : 0.6;
    let aguaEmisiones = (agua === "No") ? 0.5 : 0;
    let ropaEmisiones = (ropa === "Compro nueva") ? 1.2 : 0.6;

    // Calcular la huella de carbono total
    let huellaTotal = (electricidad * 0.4) + electrodomesticos + transporteEmisiones + tiempoEmisiones + frecuenciaEmisiones + carneEmisiones + residuosEmisiones + aguaEmisiones + ropaEmisiones;

    // Actualizar el gráfico con los resultados
    if (window.carbonChartInstance) {
    window.carbonChartInstance.data.datasets[0].data = [
    electricidad * 0.4, electrodomesticos, transporteEmisiones, tiempoEmisiones, frecuenciaEmisiones,
    carneEmisiones, residuosEmisiones, aguaEmisiones, ropaEmisiones
    ];
    window.carbonChartInstance.update();
} else {
    console.error("Gráfico no inicializado.");
}

    // Mostrar el resultado de la huella de carbono
    let resultadoElem = document.getElementById("resultado");
    if (resultadoElem) {
    resultadoElem.textContent = `${huellaTotal.toFixed(2)} kg CO₂`;
} else {
    console.error("Elemento de resultado no encontrado.");
}
});
});

