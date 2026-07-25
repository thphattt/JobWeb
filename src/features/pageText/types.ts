export type SectionText = { eyebrow?: string; title?: string; lead?: string };

export type PageTextContent = {
  projects?: {
    eyebrow?: string;
    title?: string;
    directorTitle?: string;
    directorLead?: string;
    producerTitle?: string;
    producerLead?: string;
  };
  about?: SectionText;
  services?: SectionText;
  news?: SectionText;
  careers?: SectionText;
  contact?: SectionText;
};
