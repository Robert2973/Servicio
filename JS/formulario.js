document.getElementById('carbonFootprintForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // --- Helper para rangos de km ---
    function kmRangeToValue(range, tipo) {
        const kmMap = {
            'km_auto': {
                "0-100": 50,
                "101-300": 200,
                "301-500": 400,
                "501-1000": 750,
                "mas-1000": 1200
            },
            'km_moto': {
                "0-100": 50,
                "101-200": 150,
                "201-300": 250,
                "mas-300": 350
            }
        };
        return kmMap[tipo][range] || 0;
    }

    // --- Valores seleccionados ---
    const kmAuto = kmRangeToValue(document.getElementById('km_auto').value, 'km_auto');
    const kmMoto = kmRangeToValue(document.getElementById('km_moto').value, 'km_moto');
    const combustible = document.getElementById('combustible_auto').value;

    const calefaccion = document.getElementById('calefaccion_tipo').value;
    const chimenea = document.getElementById('chimenea').value;
    const generador = document.getElementById('generador').value;
    const maquinaria = document.getElementById('maquinaria').value;
    const recreativas = document.getElementById('actividades_recreativas').value;
    const aire = document.getElementById('aire_refrigeracion').value;

    const consumoElectricidad = document.getElementById('consumo_electricidad').value;
    const otrosUsuarios = document.getElementById('otros_usuarios').value;
    const fuenteEnergia = document.getElementById('fuente_energia').value;

    const transportePublico = document.getElementById('transporte_publico').value;
    const vuelos = document.getElementById('vuelos_comerciales').value;
    const empaques = document.getElementById('productos_empaques').value;
    const consumoComida = document.getElementById('consumo_comida').value;
    const ropaNueva = document.getElementById('ropa_nueva').value;
    const productosElectronicos = document.getElementById('productos_electronicos').value;
    const segundaMano = document.getElementById('segunda_mano').value;
    const residuos = document.getElementById('residuos').value;

    // --- Cálculos ---

    // Auto
    let factorAuto = 0;
    if (combustible === 'gasolina') factorAuto = 0.192;
    else if (combustible === 'diesel') factorAuto = 0.171;
    else if (combustible === 'gas') factorAuto = 0.15;
    else if (combustible === 'electrico' || combustible === 'hibrido') factorAuto = 0; // para simplificar
    else factorAuto = 0;

    const co2Auto = kmAuto * factorAuto;
    const co2Moto = kmMoto * 0.103;

    // Calefacción
    let co2Calefaccion = 0;
    if (calefaccion === 'gas') co2Calefaccion = 5;
    else if (calefaccion === 'madera') co2Calefaccion = 3;
    else if (calefaccion === 'otro_combustible') co2Calefaccion = 6;

    // Chimenea
    const chimeneaMap = { no: 0, ocasional: 2, frecuente: 5 };
    const co2Chimenea = chimeneaMap[chimenea] || 0;

    // Generador
    const generadorMap = { no: 0, ocasional: 3, frecuente: 7 };
    const co2Generador = generadorMap[generador] || 0;

    // Maquinaria
    const maquinariaMap = { no: 0, ocasional: 4, frecuente: 10 };
    const co2Maquinaria = maquinariaMap[maquinaria] || 0;

    // Recreativas
    const recreativasMap = { no: 0, ocasional: 1.5, frecuente: 4 };
    const co2Recreativas = recreativasMap[recreativas] || 0;

    // Aire acondicionado
    let co2Aire = 0;
    if (aire === 'no') co2Aire = 0;
    else if (aire === 'si_uso') co2Aire = 3;
    else if (aire === 'si_fugas') co2Aire = 8;

    // Electricidad
    const consumoMap = {
        "0-100": 50,
        "101-200": 150,
        "201-400": 300,
        "401-600": 500,
        "mas-600": 700
    };
    let consumoKwh = consumoMap[consumoElectricidad] || 0;
    let factorElectricidad = 0.12; // kg CO2 por kWh

    if (fuenteEnergia === "renovable_total") {
        factorElectricidad = 0.012; // 10% de huella
    } else if (fuenteEnergia === "mixta") {
        factorElectricidad = 0.06; // 50% huella
    }

    let co2Electricidad = consumoKwh * factorElectricidad;

    // Compartir electricidad
    if (otrosUsuarios === "2-3") {
        co2Electricidad /= 2.5;
    } else if (otrosUsuarios === "mas-3") {
        co2Electricidad /= 4;
    }

    // Transporte público
    const transporteMap = {
        no: 0,
        "1-2": 4,
        "3-5": 8,
        diario: 12
    };
    const co2Transporte = transporteMap[transportePublico] || 0;

    // Vuelos (promedio mensual)
    const vuelosMap = {
        "0": 0,
        "1-2": 50,
        "3-5": 120,
        "mas-5": 200
    };
    const co2Vuelos = vuelosMap[vuelos] || 0;

    // Empaques plásticos
    const empaquesMap = { no: 0, ocasional: 2, frecuente: 5 };
    const co2Empaques = empaquesMap[empaques] || 0;

    // Consumo comida animal
    const comidaMap = { no: 0, ocasional: 6, regular: 15 };
    const co2Comida = comidaMap[consumoComida] || 0;

    // Ropa nueva
    const ropaMap = { no: 0, ocasional: 1.5, frecuente: 3.5 };
    const co2Ropa = ropaMap[ropaNueva] || 0;

    // Electrónicos
    const electronicosMap = { no: 0, ocasional: 2, frecuente: 5 };
    const co2Electronicos = electronicosMap[productosElectronicos] || 0;

    // Segunda mano (ahorro)
    const segundaManoMap = { no: 0, ocasional: -1, frecuente: -3 };
    const co2SegundaMano = segundaManoMap[segundaMano] || 0;

    // Residuos (ahorro)
    const residuosMap = { no: 0, parcial: -1, si: -3 };
    const co2Residuos = residuosMap[residuos] || 0;

    // Total
    const totalCO2 = co2Auto + co2Moto + co2Calefaccion + co2Chimenea + co2Generador + co2Maquinaria + co2Recreativas + co2Aire + co2Electricidad + co2Transporte + co2Vuelos + co2Empaques + co2Comida + co2Ropa + co2Electronicos + co2SegundaMano + co2Residuos;

    // Mostrar resultado en texto
    document.getElementById('resultado').textContent = totalCO2.toFixed(2) + ' kg CO₂ mensual';

    // Mostrar gráfico
    const ctx = document.getElementById('carbonChart').getContext('2d');

    if(window.barChartInstance) {
        window.barChartInstance.destroy();
    }

    window.barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                'Auto', 'Moto', 'Calefacción', 'Chimenea', 'Generador',
                'Maquinaria', 'Recreativas', 'Aire acondicionado', 'Electricidad',
                'Transp. público', 'Vuelos', 'Empaques', 'Comida animal',
                'Ropa', 'Electrónicos', 'Segunda mano', 'Residuos'
            ],
            datasets: [{
                label: 'kg CO₂',
                data: [
                    co2Auto.toFixed(2), co2Moto.toFixed(2), co2Calefaccion.toFixed(2),
                    co2Chimenea.toFixed(2), co2Generador.toFixed(2), co2Maquinaria.toFixed(2),
                    co2Recreativas.toFixed(2), co2Aire.toFixed(2), co2Electricidad.toFixed(2),
                    co2Transporte.toFixed(2), co2Vuelos.toFixed(2), co2Empaques.toFixed(2),
                    co2Comida.toFixed(2), co2Ropa.toFixed(2), co2Electronicos.toFixed(2),
                    co2SegundaMano.toFixed(2), co2Residuos.toFixed(2)
                ],
                backgroundColor: 'rgba(46, 125, 50, 0.7)',
                borderColor: 'rgba(46, 125, 50, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(56, 142, 60, 0.9)'
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#2e7d32',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: '#2e7d32',
                    titleColor: '#e6f2e6',
                    bodyColor: '#f1f8e9',
                    cornerRadius: 6,
                    displayColors: false,
                    padding: 10,
                    mode: 'nearest',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#c8e6c9'
                    },
                    ticks: {
                        color: '#2e7d32',
                        font: {
                            size: 13
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#2e7d32',
                        font: {
                            size: 13
                        },
                        maxRotation: 45,
                        minRotation: 30
                    }
                }
            }
        }
    });


    // Función para generar recomendaciones según valores calculados
    function generarRecomendaciones({
                                        co2Auto, co2Moto, combustible, co2Calefaccion, calefaccion, co2Chimenea, chimenea,
                                        co2Generador, generador, co2Maquinaria, maquinaria, co2Recreativas, recreativas,
                                        co2Aire, aire, co2Electricidad, consumoElectricidad, fuenteEnergia,
                                        co2Transporte, transportePublico, co2Vuelos, vuelos, co2Empaques, empaques,
                                        co2Comida, consumoComida, co2Ropa, ropaNueva, co2Electronicos, productosElectronicos,
                                        co2SegundaMano, segundaMano, co2Residuos, residuos
                                    }) {
        let recomendaciones = [];

        // Auto y Moto
        if (co2Auto > 100) {
            recomendaciones.push("🚗 Reduce el uso del auto, considera transporte público, bicicleta o caminar. También, usar autos híbridos o eléctricos ayuda.");
        }
        if (co2Moto > 50) {
            recomendaciones.push("🏍️ Disminuye el uso de motocicleta y evita recorridos innecesarios.");
        }
        if (combustible === 'gasolina' || combustible === 'diesel' || combustible === 'gas') {
            recomendaciones.push("⛽ Cambia a combustibles más limpios o vehículos eléctricos para reducir emisiones.");
        }

        // Calefacción
        if (co2Calefaccion > 4) {
            recomendaciones.push("🔥 Optimiza el uso de calefacción, usa equipos eficientes o fuentes renovables.");
        }
        if (calefaccion === 'madera') {
            recomendaciones.push("🌳 Asegúrate que la madera provenga de fuentes sostenibles o considera alternativas menos contaminantes.");
        }

        // Chimenea, Generador, Maquinaria y Recreativas
        if (co2Chimenea > 2) {
            recomendaciones.push("🪵 Reduce el uso frecuente de chimenea o cambia a métodos más limpios.");
        }
        if (co2Generador > 3) {
            recomendaciones.push("⚡ Limita el uso de generadores y busca fuentes de energía renovable.");
        }
        if (co2Maquinaria > 4) {
            recomendaciones.push("🚜 Usa maquinaria eficiente y evita uso innecesario.");
        }
        if (co2Recreativas > 2) {
            recomendaciones.push("🏞️ Opta por actividades recreativas con menor impacto ambiental.");
        }

        // Aire acondicionado
        if (co2Aire > 5) {
            recomendaciones.push("❄️ Revisa fugas y usa el aire acondicionado de forma responsable.");
        }

        // Electricidad
        if (co2Electricidad > 20) {
            recomendaciones.push("💡 Reduce consumo eléctrico, apaga aparatos cuando no los uses y mejora la eficiencia energética.");
        }
        if (fuenteEnergia === "renovable_total") {
            recomendaciones.push("⚡ Excelente que uses energía 100% renovable.");
        } else if (fuenteEnergia === "mixta") {
            recomendaciones.push("⚡ Considera cambiar a fuentes de energía más limpias para disminuir tu huella.");
        }

        // Transporte público y vuelos
        if (co2Transporte > 8) {
            recomendaciones.push("🚌 Usa transporte público de forma eficiente y evita viajes innecesarios.");
        }
        if (co2Vuelos > 50) {
            recomendaciones.push("✈️ Reduce vuelos frecuentes y compensa tus emisiones con proyectos ambientales.");
        }

        // Empaques plásticos
        if (co2Empaques > 2) {
            recomendaciones.push("🛍️ Reduce el uso de plásticos y recicla correctamente los empaques.");
        }

        // Comida
        if (co2Comida > 10) {
            recomendaciones.push("🥦 Reduce consumo de productos animales y opta por dietas basadas en plantas.");
        }

        // Ropa y electrónicos
        if (co2Ropa > 2) {
            recomendaciones.push("👚 Compra ropa de segunda mano o de producción sostenible.");
        }
        if (co2Electronicos > 2) {
            recomendaciones.push("📱 Extiende la vida útil de tus dispositivos electrónicos y recicla adecuadamente.");
        }

        // Segunda mano y residuos (beneficios)
        if (co2SegundaMano < 0) {
            recomendaciones.push("♻️ ¡Bien hecho usando ropa o productos de segunda mano!");
        } else {
            recomendaciones.push("♻️ Considera comprar productos de segunda mano para reducir impacto.");
        }
        if (co2Residuos < 0) {
            recomendaciones.push("🌍 Excelente manejo de residuos, sigue reciclando y compostando.");
        } else {
            recomendaciones.push("🌍 Mejora la separación y reciclaje de residuos para reducir tu huella.");
        }

        return recomendaciones.join("<br>");
    }

    // Mostrar recomendaciones en el div
    const recomendacionesDiv = document.getElementById('recomendaciones');
    recomendacionesDiv.innerHTML = generarRecomendaciones({
        co2Auto, co2Moto, combustible, co2Calefaccion, calefaccion, co2Chimenea, chimenea,
        co2Generador, generador, co2Maquinaria, maquinaria, co2Recreativas, recreativas,
        co2Aire, aire, co2Electricidad, consumoElectricidad, fuenteEnergia,
        co2Transporte, transportePublico, co2Vuelos, vuelos, co2Empaques, empaques,
        co2Comida, consumoComida, co2Ropa, ropaNueva, co2Electronicos, productosElectronicos,
        co2SegundaMano, segundaMano, co2Residuos, residuos
    });

});
