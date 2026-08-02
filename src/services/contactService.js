import { contactRecord } from "../mocks/contact.js";

export function getContactData() {
  return {
    phone: contactRecord.phone,
    phoneHref: `tel:${contactRecord.phone.replace(/\D/g, "")}`,
    socialLinks: contactRecord.socialLinks.map((link) => ({
      ...link,
      target: "_blank",
      rel: "noopener noreferrer",
    })),
  };
}
