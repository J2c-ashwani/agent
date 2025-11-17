"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
  onFileRemove: () => void
}

export function FileUploadZone({ onFileSelect, selectedFile, onFileRemove }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      validateAndSelect(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelect(e.target.files[0])
    }
  }

  const validateAndSelect = (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    const maxSize = 2 * 1024 * 1024 // 2MB

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF and Word documents are allowed")
      return
    }

    if (file.size > maxSize) {
      alert("File size must be less than 2MB")
      return
    }

    onFileSelect(file)
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-gray-400"
      }`}
    >
      {selectedFile ? (
        <div className="space-y-3">
          <div className="text-green-600">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Upload size={24} />
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-900">{selectedFile.name}</p>
            <p className="text-sm text-gray-600">{(selectedFile.size / 1024).toFixed(2)} KB</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onFileRemove} className="gap-2">
            <X size={16} />
            Remove File
          </Button>
        </div>
      ) : (
        <>
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <Upload size={24} className="text-blue-600" />
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-1">Drag and drop your document</p>
          <p className="text-sm text-gray-600 mb-4">or click to browse from your computer</p>
          <p className="text-xs text-gray-500 mb-4">Supported formats: PDF, Word (max 2MB)</p>
          <Button onClick={() => fileInputRef.current?.click()} variant="outline">
            Browse Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileInput}
            className="hidden"
          />
        </>
      )}
    </div>
  )
}
