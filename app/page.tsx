"use client"

import { useState } from "react"
import { Camera, Video, Heart, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import MediaCapture from "@/components/media-capture"

export default function WeddingPhotoApp() {
  const [showCapture, setShowCapture] = useState(false)
  const [captureMode, setCaptureMode] = useState<"photo" | "video">("photo")
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleStartCapture = (mode: "photo" | "video") => {
    setCaptureMode(mode)
    setShowCapture(true)
    setUploadStatus("idle")
  }

  const handleMediaCaptured = async (file: File) => {
    setUploadStatus("uploading")

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", captureMode)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al subir el archivo")
      }

      setUploadStatus("success")
      setTimeout(() => {
        setShowCapture(false)
        setUploadStatus("idle")
      }, 2000)
    } catch (error) {
      console.error("[v0] Upload error:", error)
      setUploadStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Error desconocido")
    }
  }

  const handleCancel = () => {
    setShowCapture(false)
    setUploadStatus("idle")
    setErrorMessage("")
  }

  if (showCapture) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-6 bg-white/80 backdrop-blur-sm border-rose-100">
          <MediaCapture
            mode={captureMode}
            onCapture={handleMediaCaptured}
            onCancel={handleCancel}
            uploadStatus={uploadStatus}
            errorMessage={errorMessage}
          />
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <Heart className="w-16 h-16 text-rose-400 fill-rose-400 animate-pulse" />
            </div>
            <h1 className="font-serif text-5xl md:text-6xl text-balance text-gray-800">Comparte tus momentos con Benja y Dani</h1>
            <p className="text-lg md:text-xl text-gray-600 text-pretty leading-relaxed">
              Captura y comparte las memorias más especiales de este día inolvidable
            </p>
          </div>

          {/* Status Messages */}
          {uploadStatus === "success" && (
            <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg border border-green-200">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">¡Archivo enviado con éxito!</span>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="flex items-center justify-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
              <XCircle className="w-5 h-5" />
              <span className="font-medium">Error al enviar: {errorMessage}</span>
            </div>
          )}

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Card
              className="p-8 bg-white/80 backdrop-blur-sm border-rose-100 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleStartCapture("photo")}
            >
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center group-hover:bg-rose-200 transition-colors">
                    <Camera className="w-10 h-10 text-rose-600" />
                  </div>
                </div>
                <h2 className="font-serif text-2xl text-gray-800">Tomar Foto</h2>
                <p className="text-gray-600 leading-relaxed">Captura momentos especiales con tu cámara</p>
                <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white">Abrir Cámara</Button>
              </div>
            </Card>

            <Card
              className="p-8 bg-white/80 backdrop-blur-sm border-amber-100 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleStartCapture("video")}
            >
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                    <Video className="w-10 h-10 text-amber-600" />
                  </div>
                </div>
                <h2 className="font-serif text-2xl text-gray-800">Grabar Video</h2>
                <p className="text-gray-600 leading-relaxed">Graba un video corto de hasta 20 segundos</p>
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">Abrir Cámara</Button>
              </div>
            </Card>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span>Todos los archivos se compartirán en nuestro álbum privado</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
