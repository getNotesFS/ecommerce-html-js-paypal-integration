
// ======== GALERÍA DE IMÁGENES ========
function changeImage(imgs) {
    var expandImg = document.getElementById("expandedImg");
    //var imgText = document.getElementById("imgtext");
    expandImg.src = imgs.src;
    //  imgText.textContent = imgs.alt;
    expandImg.parentElement.style.display = "block";
    document.querySelectorAll('.g-image').forEach((element) => {
        element.classList.remove("bordered");
    });
    imgs.parentElement.classList.add("bordered");
}

document.addEventListener('DOMContentLoaded', (event) => {
    changeImage(document.querySelector('.g-container .g-image img'));
});


// ======== TABS ========


function tabChange(pageName, elmnt, color) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");

    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
        tablinks[i].classList.remove('current');

    }
    document.getElementById(pageName).style.display = "block";
    elmnt.classList.add('current');
    // elmnt.style.backgroundColor = color;
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();




// ======= PayPal

// Recuepera el precio del producto y la cantidad

var productPrice = document.getElementById('product-price').innerText;
var quantity = document.querySelector('.qt-value').value;
var base_price = productPrice ?? 0.01;

var productName = document.querySelector('.product-title').textContent.trim();
var productDescription = document.querySelector('.product-description').textContent.trim();
var productSKU = document.querySelector('.product-sku').textContent.trim();

var productShipping = '0.00';

quantity = quantity ?? 1;
productPrice = base_price * quantity;
var productTax = (productPrice * 0.21).toFixed(2);



console.log("productPrice: ", productPrice);
console.log("quantity: ", quantity);
console.log("productName: ", productName);
console.log("productDescription: ", productDescription);
console.log("productQuantity: ", quantity);
console.log("productSKU: ", productSKU);
console.log("productTax: ", productTax);
console.log("productShipping: ", productShipping);



// Actualizar el precio del producto cuando se cambia la cantidad
document.querySelector('.qt-value').addEventListener('change', function (e) {
    quantity = e.target.value;
    productPrice = base_price * quantity;
    // limitar el precio a dos decimales

    productPrice = productPrice.toFixed(2);
    productTax = (productPrice * 0.21).toFixed(2);
});

function updatePrice() {
    var quantity = document.querySelector('.qt-value').value;
    productPrice = base_price * quantity;
    // limitar el precio a dos decimales
    productPrice = productPrice.toFixed(2);
    productTax = (productPrice * 0.21).toFixed(2);
}

function increaseQuantity(e) {
    var quantity = document.querySelector('.qt-value');
    quantity.value = parseInt(quantity.value) - 1;
    if (quantity.value < 1) {
        quantity.value = 1;
    }
    updatePrice();
}

function decreaseQuantity(e) {
    var quantity = document.querySelector('.qt-value');
    quantity.value = parseInt(quantity.value) + 1;
    updatePrice();
}



// Abrir el modal  
function openModalTransaction(modalId, product, message) {
    document.getElementById(modalId).showModal();
}
// Cerrar el modal 
function closeModalTransaction(modalId) {
    document.getElementById(modalId).close();
    // refresh the page
    location.reload();
}


// Cerrar el modal al hacer clic fuera de él 
const modals = document.querySelectorAll('dialog.modal-container');
modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.close();
        }
    });
});

// Renderizar el botón de PayPal y capturar el evento de compra  con SDK de PayPal

 
paypal.Buttons({
    createOrder: function (data, actions) {
        return actions.order.create({

            purchase_units: [{
                reference_id: 'order_' + Date.now(),
                description: "Compra en Mobiliaria",
                custom_id: 'CUST-' + productName,
                soft_descriptor: 'ECHI' + Math.floor(Math.random() * 1000000),
                amount: {
                    currency_code: 'EUR',
                    value: (parseFloat(productPrice) + parseFloat(productTax)+ parseFloat(productShipping)).toFixed(2),
                    breakdown: {
                        item_total: {
                            currency_code: 'EUR',
                            value: productPrice
                        },
                        shipping: {
                            currency_code: 'EUR',
                            value: productShipping
                        },
                        handling: {
                            currency_code: 'EUR',
                            value: '0.00'
                        },
                        tax_total: {
                            currency_code: 'EUR',
                            value: productTax
                        },
                        shipping_discount: {
                            currency_code: 'EUR',
                            value: '0.00'
                        }
                    }
                },
                items: [{
                    name: productName,
                    description: productDescription,
                    sku: productSKU,
                    unit_amount: {
                        currency_code: 'EUR',
                        value: base_price
                    },
                    tax: {
                        currency_code: 'EUR',
                        value: parseFloat(base_price * 0.21).toFixed(2)
                    },
                    quantity: quantity,
                    category: 'PHYSICAL_GOODS'
                }],
                shipping: {
                    method: 'Standard Shipping',
                    name: {
                        full_name: "Sebastián Marmol"
                    },
                    address: {

                        address_line_1: 'Marina Martínez N #12',
                        address_line_2: '',
                        admin_area_2: 'Oviedo',
                        admin_area_1: 'AS',
                        postal_code: '33099',
                        country_code: 'ES'
                    }
                }
            }]
        });
    },
    onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
            openModalTransaction('successModal');
            document.querySelector('#successModal .message').textContent = 'Transacción completada, order ID: ' + data.orderID;
            // Aquí podrías llamar a tu servidor para guardar la transacción

        });
    },
    onError(err) {
        // Mostrar un mensaje de error 
        console.error(err);
        openModalTransaction('errorModal');
        document.querySelector('#errorModal .message').textContent = err.message;
    }
}).render('#paypal-button-container');
 
 

// Configurar el botón de PayPal con la información del producto con Checkout.js de PayPal
/*
paypal.Button.render({
    // Configurar el entorno
    env: 'sandbox',
    client: {
        sandbox: 'SANDOX_KEY',
        production: ''
    },
    // Personalizar
    locale: 'es_ES',
    style: {
        layout:  'vertical',
        color:   'gold',
        shape:   'rect',
        label:   'buynow'
    },
    // Habilitar el flujo de pago ahora (opcional)
    commit: true,
    // Configurar un pago
    payment: function (data, actions) {
        return actions.payment.create({
            transactions: [{
                amount: {
                    total: parseFloat(productPrice + productTax + productShipping).toFixed(2),
                    currency: 'EUR',
                    details: {
                        subtotal: productPrice,
                        tax: '0.00',
                        shipping: '0.00',
                        handling_fee: '0.00',
                        shipping_discount: '0.00',
                        insurance: '0.00'
                    }
                },
                description: "Compra en Mobiliaria",
                custom: 'order_' + Date.now(),
                payment_options: {
                    allowed_payment_method: 'INSTANT_FUNDING_SOURCE'
                },
                soft_descriptor: 'ECHI' + Math.floor(Math.random() * 1000000),
                item_list: {
                    items: [{
                        name: productName,
                        description: productDescription,
                        quantity: quantity,
                        price: base_price,
                        tax: '0.21',
                        sku: productSKU,
                        currency: 'EUR'
                    }],
                    shipping_address: {
                        recipient_name: 'Sebastián Mármol',
                        line1: 'Marina Martínez N #12',
                        line2: '',
                        city: 'Oviedo',
                        country_code: 'ES',
                        postal_code: '33099',
                        phone: '600889922',
                        state: 'AS'
                    }
                }
            }],
            note_to_payer: 'Contáctanos si tienes alguna pregunta sobre tu pedido.'
        });
    }, 
    // Ejecutar el pago
    onAuthorize: function (data, actions) {
        return actions.payment.execute().then(function () {
            // Mostrar un mensaje de confirmación al comprador
           // window.alert('¡Gracias por tu compra!');
            openModalTransaction('successModal'); 
            document.querySelector('#successModal .message').textContent = 'Transacción completada, order ID: ' + data.orderID;

        });
    } 
}, '#paypal-button');

*/


// SHORT VERSION
/*

paypal.Buttons({
    createOrder: function (data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    "currency_code": "EUR",
                    value: productPrice
                }
            }]
        });
    },
    onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
            //alert('Transacción completada por ' + details.payer.name.given_name);
            openModalTransaction('successModal');
            document.querySelector('#successModal .message').textContent = 'Transacción completada por ' + details.payer.name.given_name;
        });
    },
    onError(err) {
        // Mostrar un mensaje de error 
        console.error(err);
        openModalTransaction('errorModal');
        document.querySelector('#errorModal .message').textContent = err.message;
    }
}).render('#paypal-button-container');

*/



