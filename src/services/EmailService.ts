import sgMail, { MailDataRequired } from "@sendgrid/mail";

import { env, sendGridApiKey, supportEmail, urlActivateAccount, urlRecoverPassword } from "../config";

export type EmailType = "recovery" | "activation";

export class EmailService {
  constructor(apiKey = sendGridApiKey) {
    sgMail.setApiKey(apiKey);
  }

  async sendEmailLink(email: string, tokenCode: string, userName: string, type: EmailType): Promise<void> {
    const baseUrl = type === "activation" ? urlActivateAccount : urlRecoverPassword;
    // TODO create handle function to generate the body html and the subject
    const link = `${baseUrl}/${tokenCode}`;

    const message: MailDataRequired = {
      to: email,
      from: supportEmail,
      subject: "Confirmação da Conta Solved",
      html: `<p>Ola ${userName}</p>: <a clicktracking="off"  href=${link}>Clique Aqui</>`,
      mailSettings: {
        sandboxMode: {
          enable: env === "test",
        },
      },
    };

    sgMail.send(message).catch(error => console.error(error));
  }
}
