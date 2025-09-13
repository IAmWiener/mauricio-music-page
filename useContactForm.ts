"use client"

import type React from "react"

import { useState } from "react"

interface ContactFormData {
  name: string
  email: string
  message: string
}

interface UseContactFormReturn {
  formData: ContactFormData
  isLoading: boolean
  isSuccess: boolean
  error: string | null
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  resetForm: () => void
}

export function useContactForm(): UseContactFormReturn {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError(null)
    if (isSuccess) setIsSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones básicas
    if (!formData.name.trim()) {
      setError("El nombre es requerido")
      return
    }

    if (!formData.email.trim()) {
      setError("El email es requerido")
      return
    }

    if (!formData.message.trim()) {
      setError("El mensaje es requerido")
      return
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Por favor ingresa un email válido")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const contentType = response.headers.get("content-type")
      let data

      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        // If not JSON, get text content for error message
        const textContent = await response.text()
        throw new Error("El servidor devolvió una respuesta inesperada")
      }

      if (!response.ok) {
        throw new Error(data.error || "Error enviando el mensaje")
      }

      setIsSuccess(true)
      setFormData({ name: "", email: "", message: "" })
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Error de comunicación con el servidor. Inténtalo de nuevo.")
      } else {
        setError(err instanceof Error ? err.message : "Error enviando el mensaje")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: "", email: "", message: "" })
    setError(null)
    setIsSuccess(false)
    setIsLoading(false)
  }

  return {
    formData,
    isLoading,
    isSuccess,
    error,
    handleChange,
    handleSubmit,
    resetForm,
  }
}
