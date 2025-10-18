import { type NextRequest, NextResponse } from "next/server"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

// Maximum file sizes (in bytes)
const MAX_PHOTO_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error("[v0] Missing Telegram credentials")
      return NextResponse.json({ error: "Configuración del servidor incompleta" }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    // Validate file size
    const maxSize = type === "photo" ? MAX_PHOTO_SIZE : MAX_VIDEO_SIZE
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `El archivo es demasiado grande. Máximo: ${maxSize / 1024 / 1024}MB` },
        { status: 400 },
      )
    }

    // Prepare form data for Telegram
    const telegramFormData = new FormData()
    telegramFormData.append("chat_id", TELEGRAM_CHAT_ID)

    if (type === "photo") {
      telegramFormData.append("photo", file)
      telegramFormData.append("caption", "📸 Nueva foto del evento")
    } else {
      telegramFormData.append("video", file)
      telegramFormData.append("caption", "🎥 Nuevo video del evento")
    }

    // Send to Telegram
    const telegramEndpoint = type === "photo" ? "sendPhoto" : "sendVideo"
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${telegramEndpoint}`

    console.log(telegramUrl)
    console.log("[v0] Sending to Telegram:", { type, fileSize: file.size, fileName: file.name })

    const response: any = await fetch(telegramUrl, {
      method: "POST",
      body: telegramFormData,
    })

    const result = await response.json()

    if (!response.ok) {
      console.error("[v0] Telegram API error:", result)
      return NextResponse.json(
        { error: "Error al enviar a Telegram: " + (result.description || "Error desconocido") },
        { status: response.status },
      )
    }

    console.log("[v0] Successfully sent to Telegram")

    return NextResponse.json({ success: true, message: "Archivo enviado correctamente" })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}