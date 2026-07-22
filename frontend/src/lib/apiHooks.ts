// Typed accessors for the Gajab backend API.
// Each returns the raw backend shape; pages fall back to mockData on error.
import { api, get, post, put, del, ApiList } from "./api";
import { CreateCommissionOverrideInput, UpdateCommissionOverrideInput } from "./dto/commission-override.dto";
import { CreateAnnouncementInput, UpdateAnnouncementInput } from "./dto/announcement.dto";

export interface Applicant {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string;
  email: string;
  college: string;
  city: string;
  state: string;
  commissionPct: number;
  appliedOn: string;
  status: string;
  duplicate: boolean;
  comments: string;
}

export interface Ambassador {
  id: string;
  name: string;
  college: string;
  city: string;
  state: string;
  email: string;
  phone: string;
  avatar?: string;
  tier: string;
  rank: number;
  commissionPct: number;
  revenue: number;
  orders: number;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: string;
  sentOn: string;
  priority: string;
  reads?: number;
  total?: number;
}

export interface InboxMessage {
  id: string;
  from: string;
  subject: string;
  preview?: string;
  body: string;
  receivedOn: string;
  read: boolean;
  priority: string;
}

export interface CommissionOverride {
  id: string;
  label: string;
  appliesTo: string;
  originalPct: number;
  overridePct: number;
  startDate: string;
  endDate: string;
  status: string;
}

export interface Payout {
  id: string;
  period: string;
  month: string;
  amount: number;
  status: string;
  date?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  reward: number;
  assignedCount: number;
  completedCount: number;
  status: string;
  rejectReason?: string;
  submission?: string;
}

export interface AffiliateUrl {
  id: string;
  ambassadorId: string;
  ambassador?: {
    id: string;
    name: string;
    college: string;
    city: string;
    state: string;
    email: string;
    phone: string;
    affiliateLink: string;
    rank: number;
    commissionPct: number;
    revenue: string;
    orders: number;
  };
  college: string;
  label: string;
  url: string;
  campaign?: string | null;
  channel: string;
  clicks: number;
  signups: number;
  orders: number;
  revenue: string;
  commission: string;
  ctr?: number | null;
  lastClick?: string | null;
  createdOn?: string | null;
  createdAt: string;
}

export const backend = {
  checkDuplicate: (email?: string, phone?: string) =>
    get<{ exists: boolean; duplicate: boolean }>("/apply/check", { email, phone }),
  submitApplication: (body: unknown) => post<Applicant>("/apply", body),

  // Admin
  listApplicants: (q?: string, status?: string, state?: string, city?: string) =>
    get<ApiList<Applicant>>("/admin/applicants", { q, status, state, city }),
  approveApplicant: (id: string) => post<Applicant>(`/admin/applicants/${id}/approve`),
  rejectApplicant: (id: string, comment?: string) =>
    post<Applicant>(`/admin/applicants/${id}/reject`, { comment }),
  getApplicant: (id: string) => get<Applicant>(`/admin/applicants/${id}`),
  convertApplicant: (id: string, body: { password: string; name?: string; email?: string; phone?: string; college?: string; city?: string; state?: string; commissionPct?: number }) =>
    post<Ambassador>(`/admin/applicants/${id}/convert`, body),
  listAmbassadors: (tier?: string, state?: string, city?: string, q?: string) =>
    get<ApiList<Ambassador>>("/admin/ambassadors", { tier, state, city, q }),
  masterLeaderboard: (state?: string) =>
    get<ApiList<Ambassador>>("/admin/ambassadors/leaderboard", { state }),
  analyticsKpis: () => get<Record<string, number>>("/admin/analytics/kpis"),
  analyticsTrend: () => get<any[]>("/admin/analytics/trend"),
  listAnnouncements: (audience?: string, priority?: string) =>
    get<ApiList<Announcement>>("/admin/announcements", { audience, priority }),
  createAnnouncement: (body: CreateAnnouncementInput) =>
    post<Announcement>("/admin/announcements", body),
  updateAnnouncement: (id: string, body: UpdateAnnouncementInput) =>
    put<Announcement>(`/admin/announcements/${id}`, body),
  deleteAnnouncement: (id: string) =>
    del<void>(`/admin/announcements/${id}`),
  listCommissionOverrides: (status?: string, q?: string) =>
    get<ApiList<CommissionOverride>>("/admin/commission-overrides", { status, q }),
  createCommissionOverride: (body: CreateCommissionOverrideInput) =>
    post<CommissionOverride>("/admin/commission-overrides", body),
  updateCommissionOverride: (id: string, body: UpdateCommissionOverrideInput) =>
    put<CommissionOverride>(`/admin/commission-overrides/${id}`, body),
  deleteCommissionOverride: (id: string) =>
    del<void>(`/admin/commission-overrides/${id}`),
  listAffiliateUrls: (ambassadorId?: string, channel?: string, q?: string) =>
    get<ApiList<AffiliateUrl>>("/admin/affiliate-urls", { ambassadorId, channel, q }),

  // Ambassador
  ambassadorHome: (id: string) => get<{ ambassador: Ambassador; stats: any; urls: any[]; recentOrders: any[] }>(`/ambassador/${id}/home`),
  ambassadorTier: (id: string) => get<any>(`/ambassador/${id}/tier`),
  ambassadorInbox: (id: string, unread?: boolean) =>
    get<InboxMessage[]>(`/ambassador/${id}/inbox`, { unread }),
  markRead: (id: string, msgId: string) =>
    post<InboxMessage>(`/ambassador/${id}/inbox/${msgId}/read`),
  ambassadorAnnouncements: (id: string, audience?: string) =>
    get<Announcement[]>(`/ambassador/${id}/announcements`, { audience }),
  ambassadorPayouts: (id: string, month?: string) =>
    get<Payout[]>(`/ambassador/${id}/payouts`, { month }),
  publicLeaderboard: (state?: string) =>
    get<Ambassador[]>("/ambassador/leaderboard", { state }),
  listTasks: (ambassadorId: string) =>
    get<Task[]>(`/ambassador/${ambassadorId}/tasks`),
  sendMessage: (ambassadorId: string, body: { from: string; subject: string; body: string }) =>
    post<InboxMessage>(`/admin/ambassadors/${ambassadorId}/inbox`, body),
};

export { api };
