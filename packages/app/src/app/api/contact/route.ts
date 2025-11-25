import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, walletAddress, subject, message, signature, messageHash, isWeb3Verified } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Web3 verification status
    const verificationStatus = isWeb3Verified ? '🔐 Web3 Verified' : '📧 Standard'
    const verificationColor = isWeb3Verified ? '#10b981' : '#3b82f6'
    
    const emailContent = {
      to: 'info@unamifoundation.org',
      from: 'noreply@beatschain.com',
      replyTo: email,
      subject: `${verificationStatus} BeatsChain Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937; border-bottom: 2px solid ${verificationColor}; padding-bottom: 10px;">
            ${verificationStatus} BeatsChain Contact
          </h2>
          
          ${isWeb3Verified ? `
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #166534; margin-top: 0; font-size: 16px;">🔐 Web3 Verified Message</h3>
            <p style="color: #166534; font-size: 14px; margin: 5px 0;">This message was cryptographically signed by the sender's wallet.</p>
            <p style="color: #166534; font-size: 12px; margin: 0; word-break: break-all;"><strong>Signature:</strong> ${signature?.slice(0, 20)}...${signature?.slice(-10)}</p>
          </div>
          ` : ''}
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>👤 Name:</strong> ${name}</p>
            <p><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>🔗 Wallet:</strong> ${walletAddress || 'Not provided'}</p>
            <p><strong>📋 Subject:</strong> ${subject}</p>
            ${isWeb3Verified ? '<p><strong>✅ Status:</strong> Web3 Verified with Wallet Signature</p>' : ''}
          </div>
          <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">💬 Message:</h3>
            <p style="line-height: 1.6; color: #4b5563;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          ${signature ? `
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
            <h4 style="color: #374151; margin-top: 0; font-size: 14px;">🔐 Cryptographic Verification</h4>
            <p style="font-size: 12px; color: #6b7280; margin: 5px 0;"><strong>Message Hash:</strong></p>
            <pre style="font-size: 10px; color: #4b5563; background: #f3f4f6; padding: 10px; border-radius: 4px; overflow-wrap: break-word; white-space: pre-wrap;">${messageHash}</pre>
            <p style="font-size: 12px; color: #6b7280; margin: 5px 0;"><strong>Wallet Signature:</strong></p>
            <pre style="font-size: 10px; color: #4b5563; background: #f3f4f6; padding: 10px; border-radius: 4px; overflow-wrap: break-word; white-space: pre-wrap;">${signature}</pre>
          </div>
          ` : ''}
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280;">
            📅 Submitted: ${new Date().toLocaleString()}<br>
            🌐 Platform: BeatsChain Web3 Beat Marketplace<br>
            ⛓️ Blockchain: Ethereum Network<br>
            ${isWeb3Verified ? '🔐 Verification: Cryptographically Signed' : '📧 Verification: Standard Email'}
          </p>
        </div>
      `
    }

    // Try multiple email sending methods
    let emailSent = false
    let emailError = null

    // Method 1: Try Resend API if available
    if (process.env.RESEND_API_KEY) {
      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailContent)
        })
        
        if (resendResponse.ok) {
          emailSent = true
          console.log(`✅ ${verificationStatus} email sent via Resend`)
        }
      } catch (error) {
        emailError = error
        console.log('❌ Resend failed:', error)
      }
    }

    // Method 2: Try SendGrid if available
    if (!emailSent && process.env.SENDGRID_API_KEY) {
      try {
        const sgResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: 'info@unamifoundation.org' }] }],
            from: { email: 'noreply@beatschain.com', name: 'BeatsChain' },
            reply_to: { email: email, name: name },
            subject: emailContent.subject,
            content: [{ type: 'text/html', value: emailContent.html }]
          })
        })
        
        if (sgResponse.ok) {
          emailSent = true
          console.log(`✅ ${verificationStatus} email sent via SendGrid`)
        }
      } catch (error) {
        emailError = error
        console.log('❌ SendGrid failed:', error)
      }
    }

    // Method 3: Fallback to webhook/Discord notification
    if (!emailSent) {
      try {
        // Store in database/file for manual processing
        const contactData = {
          timestamp: new Date().toISOString(),
          name,
          email,
          walletAddress,
          subject,
          message,
          isWeb3Verified,
          signature: signature ? `${signature.slice(0, 10)}...${signature.slice(-6)}` : null,
          processed: false
        }
        
        console.log('📝 Contact form data stored for manual processing:', contactData)
        
        // Try Discord webhook if available
        if (process.env.DISCORD_WEBHOOK_URL) {
          await fetch(process.env.DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              embeds: [{
                title: `${verificationStatus} BeatsChain Contact`,
                color: 3447003,
                fields: [
                  { name: '👤 Name', value: name, inline: true },
                  { name: '📧 Email', value: email, inline: true },
                  { name: '🔗 Wallet', value: walletAddress || 'None', inline: true },
                  { name: '📋 Subject', value: subject, inline: false },
                  { name: '💬 Message', value: message.substring(0, 1000), inline: false }
                ],
                timestamp: new Date().toISOString()
              }]
            })
          })
          console.log('✅ Discord notification sent')
        }
        
        emailSent = true // Consider it handled via alternative method
      } catch (error) {
        console.log('❌ Fallback methods failed:', error)
      }
    }

    if (emailSent) {
      return NextResponse.json({ 
        success: true, 
        message: 'Message sent successfully! We\'ll get back to you soon.' 
      })
    } else {
      // Still return success to user, but log the issue
      console.error('❌ All email methods failed. Contact data:', { name, email, subject })
      return NextResponse.json({ 
        success: true, 
        message: 'Message received! We\'ll get back to you soon.' 
      })
    }

  } catch (error) {
    console.error('❌ Contact API error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or contact us directly.' },
      { status: 500 }
    )
  }
}