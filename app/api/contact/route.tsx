import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend("re_bxJ5KUoi_EydJ7JwMYGJgMQAPC6hpRVvW")

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] API de contacto - Procesando petición POST")

    // Validar content-type
    const contentType = request.headers.get("content-type")
    if (!contentType?.includes("application/json")) {
      console.log("[v0] Content-type inválido:", contentType)
      return NextResponse.json({ success: false, error: "Content-Type debe ser application/json" }, { status: 400 })
    }

    // Parsear datos
    let body
    try {
      body = await request.json()
      console.log("[v0] Datos parseados correctamente:", {
        name: body.name,
        email: body.email,
        messageLength: body.message?.length,
      })
    } catch (error) {
      console.log("[v0] Error parseando JSON:", error)
      return NextResponse.json({ success: false, error: "JSON inválido" }, { status: 400 })
    }

    const { name, email, message } = body

    // Validar campos requeridos
    if (!name || !email || !message) {
      console.log("[v0] Campos faltantes:", { name: !!name, email: !!email, message: !!message })
      return NextResponse.json({ success: false, error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("[v0] Email con formato inválido:", email)
      return NextResponse.json({ success: false, error: "Formato de email inválido" }, { status: 400 })
    }

    // Enviar email con Resend
    console.log("[v0] Enviando email con Resend...")
    const emailResult = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["wienerwilliam31@gmail.com"], // Email del usuario registrado en Resend
      subject: `New Contact Message from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>New Contact Message</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <h1 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            New Contact Message
          </h1>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #374151; margin-top: 0;">Contact Information</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #374151; margin-top: 0;">Message</h2>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${email}?subject=Re: Your message from my music website" 
               style="background: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block;">
              Reply to ${name}
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            Sent from your music website contact form<br>
            ${new Date().toLocaleString()}
          </p>
          
        </body>
        </html>
      `,
    })

    console.log("[v0] Resultado de Resend:", emailResult)

    if (emailResult.error) {
      console.log("[v0] Error de Resend:", emailResult.error)
      const errorMessage = emailResult.error.message || emailResult.error.error || "Error desconocido de Resend"
      return NextResponse.json(
        {
          success: false,
          error: `Error enviando email: ${errorMessage}`,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Email enviado exitosamente, ID:", emailResult.data?.id)

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully! I'll contact you soon.",
        emailId: emailResult.data?.id,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("[v0] Error general en API de contacto:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: "Método no permitido. Use POST para enviar mensajes." }, { status: 405 })
}
