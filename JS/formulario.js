document.addEventListener("DOMContentLoaded", function() {
    let ctx = document.getElementById("carbonChart").getContext("2d");

    if (!ctx) {
        console.error("Elemento 'carbonChart' no encontrado.");
        return;
    }

    // Inicializar gráfico vacío
    window.carbonChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: [
                "Alcance 1 (Directo)", "Alcance 2 (Electricidad)", "Alcance 3 (Indirecto)"
            ],
            datasets: [{
                label: "Emisiones de CO₂ (kg)",
                data: Array(3).fill(0), // Datos iniciales vacíos para los tres alcances
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)", // Alcance 1
                    "rgba(54, 162, 235, 0.6)", // Alcance 2
                    "rgba(255, 206, 86, 0.6)"  // Alcance 3
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
        let carne = document.getElementById("carne")?.value || "";
        let residuos = document.getElementById("residuos")?.value || "";
        let agua = document.getElementById("agua")?.value || "";
        let ropa = document.getElementById("ropa")?.value || "";

        // Alcance 1: Emisiones directas por transporte
        let transporteEmisiones = {
            "Automóvil privado": 2.5,
            "Motocicleta": 1.8,
            "Transporte público": 1.2,
            "Bicicleta": 0,
            "A pie": 0
        }[transporte] || 0;

        let alcance1 = transporteEmisiones * 1;  // Ajustar según la distancia recorrida si es necesario

        // Alcance 2: Emisiones indirectas por electricidad
        let alcance2 = electricidad * 0.4;  // Ajusta este valor según el tipo de electricidad

        // Alcance 3: Emisiones indirectas por carne, residuos, agua y ropa
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

        // Alcance 3: Otras emisiones indirectas (carne, residuos, agua, ropa)
        let alcance3 = carneEmisiones + residuosEmisiones + aguaEmisiones + ropaEmisiones;

        // Calcular la huella de carbono total (alcances 1, 2 y 3)
        let huellaTotal = alcance1 + alcance2 + alcance3;

        // Actualizar el gráfico con los resultados
        if (window.carbonChartInstance) {
            window.carbonChartInstance.data.datasets[0].data = [
                alcance1, // Alcance 1
                alcance2, // Alcance 2
                alcance3  // Alcance 3
            ];
            window.carbonChartInstance.update();
        } else {
            console.error("Gráfico no inicializado.");
        }

        // Mostrar el resultado de la huella de carbono total
        let resultadoElem = document.getElementById("resultado");
        if (resultadoElem) {
            resultadoElem.textContent = `${huellaTotal.toFixed(2)} kg CO₂`;
        } else {
            console.error("Elemento de resultado no encontrado.");
        }
    });
});
