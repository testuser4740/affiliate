type SchemaObject = Record<string, unknown>;

const dateStr = { type: "string", format: "date-time" } as SchemaObject;
const dateOnly = { type: "string", format: "date" } as SchemaObject;

export const swaggerSchemas: Record<string, SchemaObject> = {
  Applicant: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      phone: { type: "string" },
      whatsapp: { type: "string", nullable: true },
      email: { type: "string" },
      college: { type: "string" },
      city: { type: "string" },
      state: { type: "string" },
      year: { type: "string", nullable: true },
      instagram: { type: "string", nullable: true },
      linkedin: { type: "string", nullable: true },
      clubInvolvement: { type: "string", nullable: true },
      commissionPct: { type: "integer" },
      appliedOn: dateOnly,
      status: { type: "string" },
      duplicate: { type: "boolean" },
      comments: { type: "string" },
      createdAt: dateStr,
    },
  },

  Ambassador: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      college: { type: "string" },
      city: { type: "string" },
      state: { type: "string" },
      email: { type: "string" },
      phone: { type: "string" },
      avatar: { type: "string", nullable: true },
      tier: { type: "string" },
      rank: { type: "integer" },
      commissionPct: { type: "integer" },
      revenue: { type: "number" },
      orders: { type: "integer" },
      createdAt: dateStr,
    },
  },

  Announcement: {
    type: "object",
    properties: {
      id: { type: "string" },
      title: { type: "string" },
      body: { type: "string" },
      audience: { type: "string" },
      sentOn: dateStr,
      reads: { type: "integer" },
      total: { type: "integer" },
      priority: { type: "string" },
      sendToAmbassadors: { type: "boolean" },
      createdAt: dateStr,
    },
  },

  AffiliateUrl: {
    type: "object",
    properties: {
      id: { type: "string" },
      ambassador: { type: "string" },
      college: { type: "string" },
      label: { type: "string" },
      url: { type: "string" },
      campaign: { type: "string", nullable: true },
      channel: { type: "string" },
      clicks: { type: "integer" },
      signups: { type: "integer" },
      orders: { type: "integer" },
      revenue: { type: "number" },
      commission: { type: "number" },
      ctr: { type: "number", nullable: true },
      lastClick: { ...dateStr, nullable: true },
      createdOn: { ...dateOnly, nullable: true },
      createdAt: dateStr,
    },
  },

  CommissionOverride: {
    type: "object",
    properties: {
      id: { type: "string" },
      label: { type: "string" },
      appliesTo: { type: "string" },
      originalPct: { type: "number" },
      overridePct: { type: "number" },
      startDate: dateOnly,
      endDate: dateOnly,
      status: { type: "string" },
      createdAt: dateStr,
    },
  },

  Task: {
    type: "object",
    properties: {
      id: { type: "string" },
      title: { type: "string" },
      description: { type: "string" },
      deadline: { ...dateOnly, nullable: true },
      reward: { type: "integer" },
      assignedCount: { type: "integer" },
      completedCount: { type: "integer" },
      status: { type: "string" },
      createdAt: dateStr,
    },
  },

  TaskSubmission: {
    type: "object",
    properties: {
      id: { type: "integer" },
      submissionId: { type: "string" },
      ambassador: { type: "string" },
      college: { type: "string" },
      task: { type: "string" },
      submittedOn: { type: "string", nullable: true },
      proof: { type: "string", nullable: true },
      status: { type: "string" },
      rejectReason: { type: "string", nullable: true },
      createdAt: dateStr,
    },
  },

  Poc: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      role: { type: "string" },
      region: { type: "string" },
      email: { type: "string", nullable: true },
      phone: { type: "string", nullable: true },
      whatsapp: { type: "string", nullable: true },
      avatar: { type: "string", nullable: true },
      linkedAffiliates: { type: "array", items: { type: "string" }, nullable: true },
      workingHours: { type: "string", nullable: true },
      createdAt: dateStr,
    },
  },

  ActivityLog: {
    type: "object",
    properties: {
      id: { type: "integer" },
      date: dateOnly,
      clicks: { type: "integer" },
      signups: { type: "integer" },
      orders: { type: "integer" },
      revenue: { type: "number" },
      createdAt: dateStr,
    },
  },

  // --- DTOs ---
  CreateApplicantInput: {
    type: "object",
    required: ["name", "phone", "email", "college", "city", "state"],
    properties: {
      name: { type: "string" },
      phone: { type: "string" },
      whatsapp: { type: "string", nullable: true },
      email: { type: "string" },
      college: { type: "string" },
      city: { type: "string" },
      state: { type: "string" },
      year: { type: "string", nullable: true },
      instagram: { type: "string", nullable: true },
      linkedin: { type: "string", nullable: true },
      clubInvolvement: { type: "string", nullable: true },
      commissionPct: { type: "integer" },
      appliedOn: { type: "string", format: "date" },
      status: { type: "string" },
      comments: { type: "string" },
    },
  },

  UpdateApplicantInput: {
    type: "object",
    properties: {
      name: { type: "string" },
      phone: { type: "string" },
      whatsapp: { type: "string", nullable: true },
      email: { type: "string" },
      college: { type: "string" },
      city: { type: "string" },
      state: { type: "string" },
      year: { type: "string", nullable: true },
      instagram: { type: "string", nullable: true },
      linkedin: { type: "string", nullable: true },
      clubInvolvement: { type: "string", nullable: true },
      commissionPct: { type: "integer" },
      status: { type: "string" },
      comments: { type: "string" },
    },
  },

  ApplicantActionInput: {
    type: "object",
    properties: {
      comment: { type: "string" },
    },
  },

  ConvertApplicantInput: {
    type: "object",
    required: ["password"],
    properties: {
      password: { type: "string" },
      name: { type: "string" },
      email: { type: "string" },
      phone: { type: "string" },
      college: { type: "string" },
      city: { type: "string" },
      state: { type: "string" },
      commissionPct: { type: "integer" },
    },
  },

  CreateAnnouncementInput: {
    type: "object",
    required: ["title"],
    properties: {
      title: { type: "string" },
      body: { type: "string" },
      audience: { type: "string", enum: ["All Ambassadors", "Gold + Platinum tiers", "Silver tier", "Bronze tier", "Specific city", "Specific state"] },
      priority: { type: "string", enum: ["High", "Medium", "Low"] },
      tier: { type: "string", nullable: true },
      city: { type: "string", nullable: true },
      state: { type: "string", nullable: true },
    },
  },

  UpdateAnnouncementInput: {
    type: "object",
    properties: {
      title: { type: "string" },
      body: { type: "string" },
      audience: { type: "string" },
      priority: { type: "string", enum: ["High", "Medium", "Low"] },
      tier: { type: "string", nullable: true },
      city: { type: "string", nullable: true },
      state: { type: "string", nullable: true },
    },
  },

  CreateAffiliateUrlInput: {
    type: "object",
    required: ["url"],
    properties: {
      url: { type: "string" },
      ambassador: { type: "string" },
      college: { type: "string" },
      label: { type: "string" },
      campaign: { type: "string" },
      channel: { type: "string" },
    },
  },

  UpdateAffiliateUrlInput: {
    type: "object",
    properties: {
      url: { type: "string" },
      ambassador: { type: "string" },
      college: { type: "string" },
      label: { type: "string" },
      campaign: { type: "string" },
      channel: { type: "string" },
    },
  },

  CreateCommissionOverrideInput: {
    type: "object",
    required: ["label"],
    properties: {
      label: { type: "string" },
      appliesTo: { type: "string" },
      overridePct: { type: "integer" },
      originalPct: { type: "integer" },
      startDate: { type: "string", format: "date" },
      endDate: { type: "string", format: "date" },
      status: { type: "string", enum: ["Scheduled", "Active", "Expired"] },
    },
  },

  UpdateCommissionOverrideInput: {
    type: "object",
    properties: {
      label: { type: "string" },
      appliesTo: { type: "string" },
      overridePct: { type: "integer" },
      originalPct: { type: "integer" },
      startDate: { type: "string", format: "date" },
      endDate: { type: "string", format: "date" },
      status: { type: "string", enum: ["Scheduled", "Active", "Expired"] },
    },
  },

  CreateTaskInput: {
    type: "object",
    required: ["title"],
    properties: {
      title: { type: "string" },
      description: { type: "string" },
      deadline: { type: "string", format: "date" },
      reward: { type: "integer" },
      status: { type: "string", enum: ["Active", "Closed"] },
    },
  },

  UpdateTaskInput: {
    type: "object",
    properties: {
      title: { type: "string" },
      description: { type: "string" },
      deadline: { type: "string", format: "date" },
      reward: { type: "integer" },
      status: { type: "string", enum: ["Active", "Closed"] },
    },
  },

  AssignTaskInput: {
    type: "object",
    required: ["ambassador"],
    properties: {
      ambassador: { type: "string" },
      college: { type: "string" },
    },
  },

  ReviewSubmissionInput: {
    type: "object",
    required: ["status"],
    properties: {
      status: { type: "string", enum: ["Pending Review", "Approved", "Rejected", "Under Review", "Resubmitted"] },
      rejectReason: { type: "string" },
    },
  },

  CreatePocInput: {
    type: "object",
    required: ["name", "role"],
    properties: {
      name: { type: "string" },
      role: { type: "string" },
      region: { type: "string" },
      email: { type: "string" },
      phone: { type: "string" },
      whatsapp: { type: "string" },
      workingHours: { type: "string" },
    },
  },

  UpdatePocInput: {
    type: "object",
    properties: {
      name: { type: "string" },
      role: { type: "string" },
      region: { type: "string" },
      email: { type: "string" },
      phone: { type: "string" },
      whatsapp: { type: "string" },
      avatar: { type: "string" },
      workingHours: { type: "string" },
    },
  },

  LoginInput: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string" },
      password: { type: "string" },
    },
  },

  Tier: {
    type: "object",
    properties: {
      id: { type: "integer" },
      name: { type: "string" },
      min: { type: "number" },
      max: { type: "number" },
      color: { type: "string", nullable: true },
      icon: { type: "string", nullable: true },
      commission: { type: "string" },
      perks: { type: "array", items: { type: "string" }, nullable: true },
      createdAt: dateStr,
    },
  },

  ReferralCode: {
    type: "object",
    properties: {
      code: { type: "string" },
      type: { type: "string" },
      value: { type: "string" },
      cap: { type: "string", nullable: true },
      uses: { type: "integer" },
      gmv: { type: "number" },
      commission: { type: "number" },
      status: { type: "string" },
      createdAt: dateStr,
    },
  },

  CommissionHistory: {
    type: "object",
    properties: {
      id: { type: "string" },
      date: { type: "string" },
      product: { type: "string" },
      category: { type: "string" },
      urlLabel: { type: "string", nullable: true },
      orderValue: { type: "number" },
      commissionPct: { type: "number" },
      commission: { type: "number" },
      status: { type: "string" },
      payoutStatus: { type: "string" },
      createdAt: dateStr,
    },
  },

  Payout: {
    type: "object",
    properties: {
      id: { type: "string" },
      period: { type: "string" },
      month: { type: "string" },
      amount: { type: "number" },
      status: { type: "string" },
      date: { type: "string", nullable: true },
      createdAt: dateStr,
    },
  },

  InboxMessage: {
    type: "object",
    properties: {
      id: { type: "string" },
      from: { type: "string" },
      subject: { type: "string" },
      preview: { type: "string", nullable: true },
      body: { type: "text" },
      receivedOn: { type: "string" },
      read: { type: "boolean" },
      priority: { type: "string" },
      createdAt: dateStr,
    },
  },
};
