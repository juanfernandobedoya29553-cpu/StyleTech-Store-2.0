# StyleTech Store — versión corregida

Prototipo de tienda virtual desarrollado con HTML5, CSS3 y JavaScript. Esta versión reemplaza las imágenes ilustradas por ocho fotografías de producto y elimina los emojis y los grupos de iconos decorativos de la interfaz.

## Productos incluidos

1. Camiseta Urban
2. Sudadera Tech
3. Gorra StyleTech
4. Audífonos Bluetooth
5. Cargador USB
6. Funda Premium
7. Smartwatch Fit
8. Cable reforzado

Todas las imágenes se encuentran en:

```text
assets/images/productos/
```

## Funciones

- Diseño responsive.
- Catálogo de ocho productos.
- Filtro por categoría.
- Buscador.
- Carrito guardado en el navegador.
- Pedido preparado para WhatsApp.
- Formulario de consulta.
- Pago en efectivo contra entrega.
- Tarjeta y transferencia indicadas como opciones futuras.

## Configurar WhatsApp

Abre:

```text
assets/js/app.js
```

Busca:

```javascript
const STORE_WHATSAPP = "";
```

Escribe el número con indicativo de país, sin el signo más, espacios ni guiones. Ejemplo:

```javascript
const STORE_WHATSAPP = "573001234567";
```

## Publicar en GitHub Pages

1. Crea un repositorio nuevo.
2. Sube todo el contenido de esta carpeta.
3. Verifica que `index.html` quede en la raíz.
4. Abre `Settings`.
5. Entra a `Pages`.
6. Selecciona `Deploy from a branch`.
7. Elige la rama `main` y la carpeta `/ (root)`.
8. Guarda los cambios.
