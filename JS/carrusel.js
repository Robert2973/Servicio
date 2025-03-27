
    const carruselContenedor = document.querySelector('.carrusel-contenedor');
    const carruselItems = document.querySelectorAll('.carrusel-item');
    let indice = 0;

    function cambiarSlide() {
    indice = (indice + 1) % carruselItems.length; // Avanza automáticamente al siguiente slide
    actualizarCarrusel();
}

    function actualizarCarrusel() {
    const translateX = -indice * 100; // Se mueve al siguiente slide
    carruselContenedor.style.transform = `translateX(${translateX}%)`;
}

    // Intervalo automático (cada 3 segundos)
    setInterval(cambiarSlide, 3000);
