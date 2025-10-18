# Wedding Photo & Video Sharing App

Una aplicación web elegante para eventos de boda que permite a los invitados capturar y compartir fotos y videos directamente a un canal de Telegram.

## Características

- 📸 Captura de fotos con la cámara del dispositivo
- 🎥 Grabación de videos cortos (hasta 20 segundos)
- 🔄 Cambio entre cámara frontal y trasera
- 👁️ Vista previa antes de enviar
- ⬆️ Subida directa a Telegram
- 📱 Diseño responsive y optimizado para móviles
- 💝 Tema elegante de boda con colores suaves

## Configuración

### 1. Crear un Bot de Telegram

1. Abre Telegram y busca [@BotFather](https://t.me/botfather)
2. Envía `/newbot` y sigue las instrucciones
3. Guarda el token que te proporciona (ej: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Obtener el Chat ID

**Para un canal:**
1. Crea un canal en Telegram
2. Añade tu bot como administrador del canal
3. Envía un mensaje al canal
4. Visita: `https://api.telegram.org/bot<TU_BOT_TOKEN>/getUpdates`
5. Busca el `chat.id` en la respuesta (será un número negativo como `-1001234567890`)

**Para un grupo:**
1. Crea un grupo y añade tu bot
2. Sigue los mismos pasos anteriores

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

\`\`\`env
TELEGRAM_BOT_TOKEN=tu_token_aqui
TELEGRAM_CHAT_ID=tu_chat_id_aqui
\`\`\`

### 4. Instalar y Ejecutar

\`\`\`bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
npm start
\`\`\`

## Despliegue en Vercel

1. Sube tu código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Añade las variables de entorno en la configuración del proyecto
4. Despliega

## Tecnologías

- **Next.js 15** - Framework React con App Router
- **React Webcam** - Captura de fotos y videos
- **Telegram Bot API** - Integración con Telegram
- **Tailwind CSS v4** - Estilos
- **shadcn/ui** - Componentes UI

## Límites

- Fotos: Máximo 10MB
- Videos: Máximo 50MB, 20 segundos de duración
- Formatos: JPEG para fotos, WebM para videos

## Soporte

Para problemas o preguntas, contacta al administrador del evento.
