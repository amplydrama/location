"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Camera } from "lucide-react" 
import { cn } from "@/lib/utils"
import axiosInstance from "@/utils/axios" // Your Axios instance
import { isAxiosError } from "axios"; // <--- IMPORT isAxiosError DIRECTLY FROM 'axios'


interface ImageUploadProps {
  images: string 
  onImagesChange: (images: string) => void
  className?: string
}

export function ImageUpload({ images, onImagesChange, className }: ImageUploadProps) {
  const maxImages = 1 
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0] 
    
    const isImage = file.type.startsWith("image/")
    const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB max

    if (!isImage || !isValidSize) {
      alert("Veuillez sélectionner une image valide (PNG, JPG, WEBP, max 5MB)")
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await axiosInstance.post("car/upload/vehicle-images/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });

      if (response.status !== 201) { 
        throw new Error(`Erreur lors de l'upload: Statut ${response.status}`);
      }

      const data = response.data; 
      onImagesChange(data.url);
      console.log(data.url)
    } catch (error) {
      console.error("Erreur upload:", error);
      // --- MODIFICATION ICI: Utiliser isAxiosError directement ---
      if (isAxiosError(error) && error.response) { 
        alert(`Erreur lors de l'upload: ${error.response.data?.detail || error.response.statusText || error.message}`);
      } else {
        alert("Erreur lors de l'upload de l'image.");
      }
    } finally {
      setUploading(false);
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

  const removeImage = () => { 
    onImagesChange("") 
  }

  const currentImage = images

  return (
    <div className={cn("space-y-4", className)}>
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
          uploading && "opacity-50 cursor-not-allowed",
          currentImage && "hidden" 
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
                    Glissez votre image ici ou cliquez pour sélectionner
                  </p>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP jusqu'à 5MB • Une seule image</p>
                </div>
                <Button variant="outline" type="button">
                  <Camera className="mr-2 h-4 w-4" />
                  Choisir une image
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
        multiple={false} 
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
        disabled={uploading}
      />

      {currentImage && ( 
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Image sélectionnée (1/1)
            </h4>
            <Badge variant="outline" className="text-xs">
              Image principale
            </Badge>
          </div>
          <div className="grid grid-cols-1"> 
            <Card className="relative group overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={currentImage || "/placeholder.svg"} 
                  alt="Image du véhicule"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage() 
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Badge className="absolute top-2 left-2 text-xs bg-blue-600">Principale</Badge>
              </div>
            </Card>
          </div>
          <p className="text-xs text-gray-500">
            Cliquez sur X pour supprimer l'image
          </p>
        </div>
      )}
    </div>
  )
}