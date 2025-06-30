import emailjs from "@emailjs/browser";

export const sendWelcomeEmail = (userEmail: string, userName: string): void => {
  const serviceId = "service_xihkwud";
  const templateId = "template_x10c248";
  const publicKey = "uV_eNfycQQZAsWQ88";

  const templateParams = {
    to_email: userEmail,
    to_name: userName,
  };

  emailjs.send(serviceId, templateId, templateParams, publicKey)
    .then(() => {
      console.log("Welcome email sent successfully!");
    })
    .catch((error) => {
      console.error("Failed to send email:", error);
    });
};
