# Roboto Font Usage Guide

## Fuentes Disponibles

Tu app de soccer ahora tiene configuradas las siguientes variantes de Roboto:

### Fuentes Principales

- `font-roboto` - Roboto Regular (400)
- `font-roboto-light` - Roboto Light (300)
- `font-roboto-medium` - Roboto Medium (500)
- `font-roboto-bold` - Roboto Bold (700)
- `font-roboto-black` - Roboto Black (900)

### Fuentes Condensadas

- `font-roboto-condensed` - Roboto Condensed Regular
- `font-roboto-condensed-bold` - Roboto Condensed Bold

### Fuentes Semi-Condensadas

- `font-roboto-semicondensed` - Roboto Semi-Condensed Regular
- `font-roboto-semicondensed-bold` - Roboto Semi-Condensed Bold

## Ejemplos de Uso

### Títulos Principales

```jsx
<Text className='text-4xl font-roboto-black text-white'>Soccer App</Text>
```

### Subtítulos

```jsx
<Text className='text-2xl font-roboto-bold text-white'>Player Statistics</Text>
```

### Nombres de Jugadores

```jsx
<Text className='text-xl font-roboto-medium text-white'>Lionel Messi</Text>
```

### Estadísticas y Datos

```jsx
<Text className='text-sm font-roboto-light text-gray-300'>Goals: 25</Text>
```

### Marcador de Partido

```jsx
<Text className='text-3xl font-roboto-black text-white'>2 - 1</Text>
```

### Timeline de Partido (usando condensada)

```jsx
<Text className='text-sm font-roboto-condensed text-gray-400'>15&apos;</Text>
```

### Información de Partido (usando semi-condensada)

```jsx
<Text className='text-lg font-roboto-semicondensed-bold text-white'>
  Barcelona vs Real Madrid
</Text>
```

## Recomendaciones para tu App de Soccer

### Para Estadísticas de Jugadores:

- **Nombres**: `font-roboto-medium`
- **Números**: `font-roboto-bold`
- **Etiquetas**: `font-roboto-light`

### Para Streaming en Tiempo Real:

- **Marcador**: `font-roboto-black`
- **Tiempo**: `font-roboto-condensed`
- **Eventos**: `font-roboto-semicondensed`

### Para Datos Numéricos:

- **Estadísticas**: `font-roboto-light`
- **Porcentajes**: `font-roboto-medium`
- **Récords**: `font-roboto-bold`

## Ventajas de Roboto para tu App

1. **Excelente legibilidad** en pantallas pequeñas
2. **Optimizada para datos numéricos** - perfecta para estadísticas
3. **Variantes condensadas** - ideal para información densa
4. **Profesional y moderna** - perfecta para una app deportiva
5. **Muy legible** en streaming en tiempo real

## Configuración Técnica

Las fuentes están configuradas en:

- `tailwind.config.js` - Definición de clases CSS
- `app/global.css` - Declaraciones @font-face
- `assets/fonts/Roboto/` - Archivos de fuentes

Todas las fuentes están optimizadas para React Native y funcionan perfectamente con NativeWind.
