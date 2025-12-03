exports.resetPasswordTemplate = (resetUrl) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Password Update Confirmation</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
            a{
                color: #1a73e8;
                text-decoration: underline;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                display:inline-block;
                padding:12px 24px;
                background:#FFD60A;
                color:#FFFFFF;
                font-size:20px;
                font-weight:700;
                font-family:Arial, Helvetica, sans-serif;
                text-decoration:none;
                border-radius:8px;
                letter-spacing:0.5px;
                text-transform:none;
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <a href="#" class="logo">
                StudyNotion
            </a>
            <div class="message">Reset Your Password</div>
            <div class="body">
                <p>Click the link below to reset your password. This link is valid for 1 hour.
                </p>
                <a href="${resetUrl}">Reset Password</a>
                <p>If you did not request this password change, please contact us immediately to secure your account.</p>
            </div>
            <div class="support">If you have any questions or need further assistance, please feel free to reach out to us
                at
                <a href="mailto:info@studynotion.com">info@studynotion.com</a>. We are here to help!
            </div>
        </div>
    </body>
    
    </html>`;
}