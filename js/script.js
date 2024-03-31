
// ==== Slider de reviews ====
document.addEventListener('DOMContentLoaded', (event) => {
    const reviews = document.querySelector('.customer-reviews .slider');
    const nextButton = document.querySelector('.customer-reviews .controls .next');
    const prevButton = document.querySelector('.customer-reviews .controls .prev');

    nextButton.addEventListener('click', () => {
        const containerWidth = reviews.clientWidth;
        const totalWidth = reviews.scrollWidth;
        let newScrollLeft = reviews.scrollLeft + containerWidth;

        // Verifica si al desplazar se pasa del total de la anchura del contenedor
        if (newScrollLeft >= totalWidth) {
            // Vuelve al inicio si se ha pasado
            reviews.scrollLeft = 0;
        } else {
            // Si no se ha pasado, desplaza normalmente
            reviews.scrollLeft = newScrollLeft;
        }
    });

    prevButton.addEventListener('click', () => {
        const containerWidth = reviews.clientWidth;
        let newScrollLeft = reviews.scrollLeft - containerWidth;
        reviews.scrollLeft = newScrollLeft;
    });
});


