# tienda-html-js-paypal-integration
Tienda HTML integración con botón de PayPal. Diseño de página de Inicio y producto con semántica y sin uso de divs.

# Reemplazar Sandox Key para probar integración con PayPal la versión SDK

  ```HTML
  <!-- Script de PAYPAL SDK -->
    <script
        src="https://www.paypal.com/sdk/js?client-id=SANDBOX_KEY&currency=EUR&disable-funding=sofort"></script>

```

# Reemplazar Sandox Key para probar integración con PayPal la versión SDK
En esta parte:



```JavaScript
paypal.Button.render({
    // Configurar el entorno
    env: 'sandbox',
    client: {
        sandbox: 'SANDOX_KEY',
        production: ''
    },

```

