"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Camera, Video, RotateCcw, X, Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Webcam from "react-webcam"

interface MediaCaptureProps {
  mode: "photo" | "video"
  onCapture: (file: File) => void
  onCancel: () => void
  uploadStatus: "idle" | "uploading" | "success" | "error"
  errorMessage?: string
}

export default function MediaCapture({ mode, onCapture, onCancel, uploadStatus, errorMessage }: MediaCaptureProps) {
  const webcamRef = useRef<Webcam>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")

  const MAX_RECORDING_TIME = 10 // seconds

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORDING_TIME) {
            handleStopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    } else {
      setRecordingTime(0)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const handleCapture = useCallback(() => {
    if (mode === "photo") {
      const imageSrc = webcamRef.current?.getScreenshot()
      if (imageSrc) {
        setCapturedMedia(imageSrc)
      }
    } else {
      handleStartRecording()
    }
  }, [mode])

  const handleStartRecording = useCallback(() => {
    if (!webcamRef.current?.stream) return

    setIsRecording(true)
    setRecordedChunks([])

    const mediaRecorder = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    })

    mediaRecorderRef.current = mediaRecorder

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data])
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "video/webm" })
      const url = URL.createObjectURL(blob)
      setCapturedMedia(url)
    }

    mediaRecorder.start()
  }, [recordedChunks])

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  const handleRetake = () => {
    setCapturedMedia(null)
    setRecordedChunks([])
    setRecordingTime(0)
  }

  const handleSwitchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
  }

  const handleUpload = async () => {
    if (!capturedMedia) return

    try {
      let file: File

      if (mode === "photo") {
        // Convert base64 to blob
        const response = await fetch(capturedMedia)
        const blob = await response.blob()
        file = new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" })
      } else {
        // Convert video blob to file
        const blob = new Blob(recordedChunks, { type: "video/webm" })
        file = new File([blob], `video-${Date.now()}.webm`, { type: "video/webm" })
      }

      onCapture(file)
    } catch (error) {
      console.error("[v0] Error preparing file:", error)
    }
  }

  if (capturedMedia) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-gray-800">{mode === "photo" ? "Vista Previa" : "Video Grabado"}</h2>
          <Button variant="ghost" size="icon" onClick={onCancel} disabled={uploadStatus === "uploading"}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
          {mode === "photo" ? (
            <img src={capturedMedia || "/placeholder.svg"} alt="Captured" className="w-full h-full object-contain" />
          ) : (
            <video src={capturedMedia} controls className="w-full h-full" />
          )}
        </div>

        {uploadStatus === "error" && errorMessage && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">{errorMessage}</div>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleRetake}
            disabled={uploadStatus === "uploading"}
            className="flex-1 bg-transparent"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Repetir
          </Button>
          <Button
            onClick={handleUpload}
            disabled={uploadStatus === "uploading"}
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
          >
            {uploadStatus === "uploading" ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Enviar
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-gray-800">{mode === "photo" ? "Tomar Foto" : "Grabar Video"}</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <Webcam
          ref={webcamRef}
          audio={mode === "video"}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            facingMode: facingMode,
          }}
          className="w-full h-full object-cover"
        />

        {isRecording && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2 animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full" />
            <span className="font-mono">
              {recordingTime}s / {MAX_RECORDING_TIME}s
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={handleSwitchCamera} disabled={isRecording} className="flex-1 bg-transparent">
          <RotateCcw className="w-4 h-4 mr-2" />
          Cambiar Cámara
        </Button>

        {mode === "photo" ? (
          <Button onClick={handleCapture} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white">
            <Camera className="w-4 h-4 mr-2" />
            Capturar
          </Button>
        ) : (
          <Button
            onClick={isRecording ? handleStopRecording : handleCapture}
            className={`flex-1 ${isRecording ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"} text-white`}
          >
            <Video className="w-4 h-4 mr-2" />
            {isRecording ? "Detener" : "Grabar"}
          </Button>
        )}
      </div>

      {mode === "video" && !isRecording && (
        <p className="text-sm text-gray-500 text-center">Máximo {MAX_RECORDING_TIME} segundos de grabación</p>
      )}
    </div>
  )
}
