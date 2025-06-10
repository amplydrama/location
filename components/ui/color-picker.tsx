"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  className?: string
}

export function ColorPicker({ color, onChange, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentColor, setCurrentColor] = useState(color)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setCurrentColor(color)
  }, [color])

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setCurrentColor(newColor)
    onChange(newColor)
  }

  const predefinedColors = [
    "#000000",
    "#ffffff",
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#795548",
    "#607d8b",
    "#0f766e",
    "#f97316",
    "#0ea5e9",
    "#007a5e",
    "#ce1126",
    "#fcd116",
  ]

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "w-8 h-8 rounded-md border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
            className,
          )}
          style={{ backgroundColor: currentColor }}
          aria-label="Choisir une couleur"
        />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-3">
          <div>
            <label htmlFor="color-input" className="text-sm font-medium">
              Sélectionner une couleur
            </label>
            <div className="flex mt-1">
              <input
                ref={inputRef}
                type="color"
                id="color-input"
                value={currentColor}
                onChange={handleColorChange}
                className="w-full h-8 cursor-pointer"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Couleurs prédéfinies</label>
            <div className="grid grid-cols-8 gap-1 mt-1">
              {predefinedColors.map((presetColor) => (
                <button
                  key={presetColor}
                  type="button"
                  className={cn(
                    "w-6 h-6 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary",
                    currentColor === presetColor && "ring-2 ring-offset-1 ring-primary",
                  )}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => {
                    setCurrentColor(presetColor)
                    onChange(presetColor)
                  }}
                  aria-label={`Couleur ${presetColor}`}
                />
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="hex-input" className="text-sm font-medium">
              Code hexadécimal
            </label>
            <input
              type="text"
              id="hex-input"
              value={currentColor}
              onChange={(e) => {
                setCurrentColor(e.target.value)
                onChange(e.target.value)
              }}
              className="w-full mt-1 px-3 py-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
