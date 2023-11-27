import * as nodemailer from 'nodemailer';

export const sendMail = async (destination: any, subject: string, html: any) => {

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_API_APP_PASSWORD,
            },
        });

        const mailOptions: nodemailer.SendMailOptions = {
            from: process.env.EMAIL,
            to: destination,
            subject: subject,
            html: html,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error:', error.message);
            } else {
                console.log('Email sent:', info.response);
            }
        });
    } catch (error) {
        console.error(error);
    }
}

