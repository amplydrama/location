"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, X, ImageIcon, Camera } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  className?: string
}

export function ImageUpload({ images, onImagesChange, maxImages = 5, className }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const validFiles = fileArray.filter((file) => {
      const isImage = file.type.startsWith("image/")
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB max
      return isImage && isValidSize
    })

    if (validFiles.length === 0) {
      alert("Veuillez sélectionner des images valides (max 5MB chacune)")
      return
    }

    if (images.length + validFiles.length > maxImages) {
      alert(`Vous ne pouvez ajouter que ${maxImages} images maximum`)
      return
    }

    setUploading(true)

    try {
      const uploadPromises = validFiles.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload/vehicle-images", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Erreur lors de l'upload")
        }

        const data = await response.json()
        return data.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      onImagesChange([...images, ...uploadedUrls])
    } catch (error) {
      console.error("Erreur upload:", error)
      alert("Erreur lors de l'upload des images")
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    onImagesChange(newImages)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Zone d'upload */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
          uploading && "opacity-50 cursor-not-allowed",
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            {uploading ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600">Upload en cours...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <Upload className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Glissez vos images ici ou cliquez pour sélectionner
                  </p>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP jusqu'à 5MB • Maximum {maxImages} images</p>
                </div>
                <Button variant="outline" type="button">
                  <Camera className="mr-2 h-4 w-4" />
                  Choisir des images
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
        disabled={uploading}
      />

      {/* Prévisualisation des images */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Images sélectionnées ({images.length}/{maxImages})
            </h4>
            {images.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {images[0] && "Image principale"}
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <Card key={index} className="relative group overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                      {index > 0 && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation()
                            moveImage(index, 0)
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImage(index)
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {index === 0 && <Badge className="absolute top-2 left-2 text-xs bg-blue-600">Principale</Badge>}
                </div>
              </Card>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Cliquez sur l'icône image pour définir comme image principale • Cliquez sur X pour supprimer
          </p>
        </div>
      )}
    </div>
  )
}
