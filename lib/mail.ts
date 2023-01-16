// // creating a transporter : allows us to hook up to a smtp API & send out emails
// // using Ethereal for email trapping in Dev - no account needed

import { createTransport, getTestMessageUrl } from 'nodemailer';

const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// this is a stripped down email.  For something more fancy look for services that template out HTML emails
function makeANiceEmail(text: string) {
  return `
    <div className="email" style="
      border: 1px solid black;
      padding: 20px;
      font-family: sans-serif;
      line-height: 2;
      font-size: 20px;
    ">
      <h2>Hello There!</h2>
      <p>${text}</p>
      <p>😘, Felix Jarvis</p>
    </div>
  `;
}

// so you take the response (see example at very bottom) that you get back in the cli when you log it and paste it in https://jvilk.com/MakeTypes/ where you give it JSON and it gives back the Type.  First, in the dev console, on a new line type JSON.stringify()  then paste in the response including the {}. Wrap the entire thing in copy().  Paste it into the MakeTypes site in the Input: JSON Examples box and here we want to name the response in the smaller top input field MailResponse.  Envelope came back when we generated the types.  It's looks like it is just a sub-type of MailResponse.

export interface MailResponse {
  accepted?: string[] | null;
  rejected?: null[] | null;
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: Envelope;
  messageId: string;
}
export interface Envelope {
  from: string;
  to?: string[] | null;
}

export async function sendPasswordResetEmail(
  resetToken: string,
  to: string
): Promise<void> {
  // email the user a token
  const info = (await transport.sendMail({
    // sendMail() returns Promise<any> which Typescript does not like so we create a custom type with this interface MailResponse
    to,
    from: 'felix@example.com',
    subject: 'Your password reset token!',
    html: makeANiceEmail(`Your Password Reset Token is here!
      <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click Here to reset</a>
    `),
  })) as MailResponse;
  console.log(info); // look in the cli
  // get back a direct link to the sent email for Dev - make life easier
  if (process.env.MAIL_USER.includes('ethereal.email')) {
    console.log(`💌 Message Sent!  Preview it at ${getTestMessageUrl(info)}`);
  }
}

// example response logged in the cli when we log out info
// {
//     accepted: [ 'chrisyoung0101@gmail.com' ],
//     rejected: [],
//     envelopeTime: 514,
//     messageTime: 396,
//     messageSize: 773,
//     response: '250 Accepted [STATUS=new MSGID=Y8VdF8h3AqQaF12HY8VqleCSOiIUYoiYAAAABMnNR8JW9clZp89FmZ8ho8E]',
//     envelope: { from: 'billybohb@email.com', to: [ 'chrisyoung0101@gmail.com' ] },
//     messageId: '<a55d0323-9ab5-1857-34ab-d19764c352e2@email.com>'
//   }
