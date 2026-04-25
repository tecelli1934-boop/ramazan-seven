import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import secrets
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    def __init__(self):
        self.host = os.environ.get('EMAIL_HOST')
        self.port = int(os.environ.get('EMAIL_PORT', 587))
        self.user = os.environ.get('EMAIL_USER')
        self.password = os.environ.get('EMAIL_PASS')
        self.from_email = f"SVN PROFIL ARMATUR <{self.user}>"
        self.frontend_url = os.environ.get('FRONTEND_URL', 'https://ramazan-seven.web.app')

    def send_email(self, to_email, subject, html_content):
        msg = MIMEMultipart()
        msg['From'] = self.from_email
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(html_content, 'html'))

        try:
            with smtplib.SMTP(self.host, self.port) as server:
                server.starttls()
                server.login(self.user, self.password)
                server.send_message(msg)
            return True
        except Exception as e:
            print(f"Email sending failed: {e}")
            return False

    def generate_token(self):
        return secrets.token_hex(32)

    def send_verification_email(self, name, email, token):
        verification_url = f"{self.frontend_url}/email-dogrula/{token}"
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">SVN PROFIL ARMATUR</div>
                <h1>Hoş Geldiniz!</h1>
            </div>
            <div style="background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px;">
                <h2>Merhaba {name},</h2>
                <p>SVN PROFIL ARMATUR platformuna kaydolduğunuz için teşekkür ederiz!</p>
                <p>Hesabınızı aktive etmek için lütfen aşağıdaki butona tıklayın:</p>
                <a href="{verification_url}" target="_blank" style="display: inline-block; background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Email Adresimi Doğrula</a>
                <p style="font-size: 12px; color: #666;">Eğer buton çalışmıyorsa aşağıdaki linki tarayıcınıza kopyalayıp yapıştırabilirsiniz:</p>
                <p style="font-size: 12px; color: #2563eb; word-break: break-all;">{verification_url}</p>
                <p>Bu link 24 saat boyunca geçerlidir.</p>
            </div>
            <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
                <p>© 2024 SVN PROFIL ARMATUR. Tüm hakları saklıdır.</p>
            </div>
        </body>
        </html>
        """
        return self.send_email(email, "Email Adresinizi Doğrulayın", html)

    def send_password_reset_email(self, name, email, token):
        reset_url = f"{self.frontend_url}/sifre-sifirla/{token}"
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">SVN PROFIL ARMATUR</div>
                <h1>Şifre Sıfırlama</h1>
            </div>
            <div style="background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px;">
                <h2>Merhaba {name},</h2>
                <p>Şifrenizi sıfırlama talebinde bulundunuz.</p>
                <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
                <a href="{reset_url}" target="_blank" style="display: inline-block; background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Şifremi Sıfırla</a>
                <p>Bu link 1 saat boyunca geçerlidir.</p>
            </div>
            <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
                <p>© 2024 SVN PROFIL ARMATUR. Tüm hakları saklıdır.</p>
            </div>
        </body>
        </html>
        """
        return self.send_email(email, "Şifre Sıfırlama Talebi", html)

    def send_order_confirmation(self, order_data):
        # Port order confirmation email logic
        pass

email_service = EmailService()
