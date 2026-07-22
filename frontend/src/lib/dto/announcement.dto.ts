export interface CreateAnnouncementInput {
  title?: string;
  body?: string;
  audience?: string;
  priority?: string;
  tier?: string;
  city?: string;
  state?: string;
}

export interface UpdateAnnouncementInput {
  title?: string;
  body?: string;
  audience?: string;
  priority?: string;
  tier?: string;
  city?: string;
  state?: string;
  sendToAmbassadors?: boolean;
}
