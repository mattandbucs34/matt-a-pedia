import { setApiKey, send } from "@sendgrid/mail";
setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
    to: 'mattandbucs@gmail.com',
    from: 'mattandbucs@gmail.com',
    subject: 'This is not just a message',
    text: 'This is just flat amazing',
    html: '<strong>Fantastic Dr. Reed</strong>'
};

send(msg);