import { transporter } from '@/lib/mail'

export const sendVerificationEmail = async (
  email: string,
  username: string,
  token: string,
) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify?token=${token}`

  return await transporter.sendMail({
    from: `"BLACKWALL_OPS" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `[SYSTEM_UPLINK] CONFIRM_ACCESS_FOR_${username.toUpperCase()}`,
    html: `
      <div style="background:#09090B; color:#10B981; font-family:monospace; padding:60px; border:2px solid #27272A;">
        <h2 style="border-bottom:1px solid #27272A; padding-bottom:10px;">> ACCESS_AUTHORIZATION_REQUIRED</h2>
        <p>Operative: <strong>${username}</strong></p>
        <p>A new record has been detected. Synchronize your credentials with the Blackwall mainframe.</p>

        <div style="margin:40px 0;">
          <a href="${confirmLink}" style="color:#09090B; display: inline-block; background: #10B981; padding:15px; text-decoration:none; outline: none; font-weight:bold; border:1px solid #10B981;">
            [ AUTHORIZE_ACCESS ]
          </a>
        </div>

        <p style="font-size:12px; color:#A1A1AA;">
          TRACE_ID: ${token}<br>
          STATUS: PENDING_SYNC<br>
          TIMESTAMP: ${new Date().toISOString()}
        </p>
      </div>
    `,
  })
}
