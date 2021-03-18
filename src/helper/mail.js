const nodemailer = require('nodemailer');
const secrets = require('./../core/secrets')

class Mail {
    static sendMail(email, subject, content) {
        try {
            let mailOptions = {
                from: secrets.SMTP.FROM,
                to: email,
                subject: subject,
                html: content
            };
    
            const transporter = nodemailer.createTransport({
                host: secrets.SMTP.HOST,
                port: secrets.SMTP.PORT,
                secure: false,
                auth: {
                    user: secrets.SMTP.USER,
                    pass: secrets.SMTP.PWD
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
    
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return { error: true, message: error.message };
                } else {
                    return { error: false, message: 'E-mail sent!'};
                }
            });
            return { error: false, message: 'E-mail sent!' };
        } catch (e) {
            console.log(e)
            return { error: true, message: e.message };
        }
    }


}

module.exports = Mail