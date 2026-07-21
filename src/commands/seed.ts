import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { createDataSource } from '../loaders/typeormLoader';
import { Ambassador } from '../api/models/ambassadors';
import { Tier } from '../api/models/tiers';
import { AffiliateUrl } from '../api/models/affiliate-urls';
import { CommissionHistory } from '../api/models/commission-history';
import { ActivityLog } from '../api/models/activity-logs';
import { Task } from '../api/models/tasks';
import { TaskSubmission } from '../api/models/task-submissions';
import { Payout } from '../api/models/payouts';
import { ReferralCode } from '../api/models/referral-codes';
import { Announcement } from '../api/models/announcements';
import { Poc } from '../api/models/pocs';
import { InboxMessage } from '../api/models/inbox-messages';
import { Applicant } from '../api/models/applicants';
import { CommissionOverride } from '../api/models/commission-overrides';
import { OrderUtilizationLog } from '../api/models/order-utilization-logs';
import { User } from '../api/models/users';
import { hashPassword } from '../api/lib/auth';

const MONTHS: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

function parseDate(value?: string): Date | undefined {
    if (!value || value === '—') return undefined;
    const slash = value.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})\s*(AM|PM))?/i);
    if (slash) {
        const [, dd, mm, yyyy, hh, min, ap] = slash;
        let hour = hh ? parseInt(hh, 10) : 0;
        const minute = min ? parseInt(min, 10) : 0;
        if (ap) {
            const isPm = ap.toUpperCase() === 'PM';
            if (isPm && hour !== 12) hour += 12;
            if (!isPm && hour === 12) hour = 0;
        }
        return new Date(Number(yyyy), Number(mm) - 1, Number(dd), hour, minute);
    }
    const word = value.match(/([A-Za-z]{3})\w*\s+(\d{1,2}),\s*(\d{4})(?:\s+(\d{1,2}):(\d{2})\s*(AM|PM))?/i);
    if (word) {
        const [, mon, dd, yyyy, hh, min, ap] = word;
        const month = MONTHS[mon.toLowerCase().slice(0, 3)];
        if (month === undefined) return undefined;
        let hour = hh ? parseInt(hh, 10) : 0;
        const minute = min ? parseInt(min, 10) : 0;
        if (ap) {
            const isPm = ap.toUpperCase() === 'PM';
            if (isPm && hour !== 12) hour += 12;
            if (!isPm && hour === 12) hour = 0;
        }
        return new Date(Number(yyyy), month, Number(dd), hour, minute);
    }
    return undefined;
}

const db: DataSource = createDataSource();

async function clearAll(): Promise<void> {
    const repos = [
        OrderUtilizationLog, CommissionHistory, ActivityLog, AffiliateUrl,
        ReferralCode, TaskSubmission, Task, Payout, Announcement,
        Poc, InboxMessage, Applicant, CommissionOverride, Ambassador, Tier, User,
    ];
    for (const r of repos) {
        const repo = db.getRepository(r);
        await repo.query(`TRUNCATE TABLE "${repo.metadata.tableName}" RESTART IDENTITY CASCADE;`);
    }
}

async function seed(): Promise<void> {
    const tiers = [
        { name: 'Bronze', min: 0, max: 50000, color: '#B5651D', icon: '🥉', commission: '8%', perks: ['8% commission on all orders', 'Access to ambassador community', 'Monthly newsletter & tips', 'Welcome digital kit'] },
        { name: 'Silver', min: 50000, max: 150000, color: '#7B8794', icon: '🥈', commission: '10%', perks: ['10% commission on all orders', 'Monthly performance bonus eligibility', 'Exclusive task pool access', 'Quarterly swag drops'] },
        { name: 'Gold', min: 150000, max: 400000, color: '#D69E2E', icon: '🥇', commission: '12%', perks: ['12% commission on all orders', 'Priority bi-weekly payouts', 'Premium swag box (₹2K value)', 'Early access to new products', 'Featured on Gajab Insta Spotlight'] },
        { name: 'Platinum', min: 400000, max: 999999999, color: '#5B21B6', icon: '💎', commission: '15%', perks: ['15% commission on all orders', 'Weekly payouts (no minimum)', 'Dedicated ambassador manager', 'Quarterly cash bonuses (up to ₹25K)', 'All-expenses-paid Gajab HQ trip', 'Co-branding opportunities'] },
    ];
    await db.getRepository(Tier).save(tiers.map((t) => db.getRepository(Tier).create(t)));
    const tierIdByName: Record<string, number> = {};
    for (const t of tiers) { tierIdByName[t.name] = (await db.getRepository(Tier).findOne({ where: { name: t.name } }))!.id; }

    const leaderboard = [
        { rank: 1, name: 'Aarav Mehta', college: 'IIT Bombay', city: 'Mumbai', state: 'Maharashtra', revenue: 684200, orders: 412 },
        { rank: 2, name: 'Sneha Iyer', college: 'VIT Vellore', city: 'Vellore', state: 'Tamil Nadu', revenue: 612400, orders: 388 },
        { rank: 3, name: 'Karan Singh', college: 'DTU Delhi', city: 'Delhi', state: 'Delhi', revenue: 548900, orders: 351 },
        { rank: 4, name: 'Priya Nair', college: 'St. Xavier\'s', city: 'Mumbai', state: 'Maharashtra', revenue: 482300, orders: 312 },
        { rank: 5, name: 'Rohan Patel', college: 'NIT Trichy', city: 'Trichy', state: 'Tamil Nadu', revenue: 421800, orders: 287 },
        { rank: 6, name: 'Ananya Reddy', college: 'BITS Pilani', city: 'Pilani', state: 'Rajasthan', revenue: 388100, orders: 254 },
        { rank: 7, name: 'Riya Sharma', college: 'Delhi University', city: 'New Delhi', state: 'Delhi', revenue: 248650, orders: 184 },
        { rank: 8, name: 'Aditya Verma', college: 'IIM Bangalore', city: 'Bangalore', state: 'Karnataka', revenue: 224500, orders: 168 },
        { rank: 9, name: 'Meera Joshi', college: 'Pune University', city: 'Pune', state: 'Maharashtra', revenue: 198200, orders: 142 },
        { rank: 10, name: 'Vikram Rao', college: 'Anna University', city: 'Chennai', state: 'Tamil Nadu', revenue: 184700, orders: 131 },
    ];
    const ambRepo = db.getRepository(Ambassador);
    const ambassadors = leaderboard.map((l, i) => {
        const tierName = l.revenue >= 150000 ? 'Platinum' : l.revenue >= 100000 ? 'Gold' : l.revenue >= 50000 ? 'Silver' : 'Bronze';
        const commissionPct = tierName === 'Platinum' ? 15 : tierName === 'Gold' ? 12 : tierName === 'Silver' ? 10 : 8;
        return ambRepo.create({
            id: `amb_${String(i + 1).padStart(3, '0')}`,
            name: l.name, college: l.college, city: l.city, state: l.state,
            email: `${l.name.toLowerCase().replace(/[^a-z]/g, '')}@gajab.com`,
            phone: '+91 98765 43210',
            avatar: `https://images.unsplash.com/photo-${1000000000000 + i}?w=120&h=120&fit=crop`,
            tierId: tierIdByName[tierName], rank: l.rank, commissionPct, revenue: l.revenue, orders: l.orders,
        } as Partial<Ambassador>);
    });
    await ambRepo.insert(ambassadors.map((a) => ({
        id: a.id, name: a.name, college: a.college, city: a.city, state: a.state, email: a.email,
        phone: a.phone, avatar: a.avatar, tierId: a.tierId, rank: a.rank,
        commissionPct: a.commissionPct, revenue: a.revenue, orders: a.orders,
    })));

    // Name -> ambassador id map (for linking related tables via FK).
    const ambIdByName: Record<string, string> = {};
    ambassadors.forEach((a) => { ambIdByName[a.name] = a.id; });
    const ambIds = ambassadors.map((a) => a.id);

    const adminAffiliateUrls = [
        { id: 'URL-A001', ambassador: 'Aarav Mehta', college: 'IIT Bombay', label: 'Master Link', url: 'https://gajab.com/r/AARAV-IITB', channel: 'All', clicks: 6240, signups: 482, orders: 412, revenue: 684200, commission: 68420, lastClick: 'Dec 14, 2026 2:22 PM' },
        { id: 'URL-A002', ambassador: 'Aarav Mehta', college: 'IIT Bombay', label: 'Insta Story', url: 'https://gajab.com/r/AARAV-IITB?utm=insta', channel: 'Instagram', clicks: 3140, signups: 218, orders: 188, revenue: 312400, commission: 31240, lastClick: 'Dec 14, 2026 1:14 PM' },
        { id: 'URL-A003', ambassador: 'Sneha Iyer', college: 'VIT Vellore', label: 'Master Link', url: 'https://gajab.com/r/SNEHA-VIT', channel: 'All', clicks: 5820, signups: 412, orders: 388, revenue: 612400, commission: 61240, lastClick: 'Dec 14, 2026 1:58 PM' },
        { id: 'URL-A004', ambassador: 'Karan Singh', college: 'DTU Delhi', label: 'Master Link', url: 'https://gajab.com/r/KARAN-DTU', channel: 'All', clicks: 4980, signups: 384, orders: 351, revenue: 548900, commission: 54890, lastClick: 'Dec 14, 2026 12:42 PM' },
        { id: 'URL-A005', ambassador: 'Riya Sharma', college: 'Delhi University', label: 'Master Link', url: 'https://gajab.com/r/RIYA-DU24', channel: 'All', clicks: 2847, signups: 312, orders: 184, revenue: 248650, commission: 24865, lastClick: 'Dec 14, 2026 2:14 PM' },
        { id: 'URL-A006', ambassador: 'Riya Sharma', college: 'Delhi University', label: 'WhatsApp Hostel', url: 'https://gajab.com/r/RIYA-DU24?utm=wa', channel: 'WhatsApp', clicks: 824, signups: 98, orders: 58, revenue: 78200, commission: 7820, lastClick: 'Dec 14, 2026 11:02 AM' },
        { id: 'URL-A007', ambassador: 'Priya Nair', college: 'St. Xavier\'s', label: 'Master Link', url: 'https://gajab.com/r/PRIYA-SXC', channel: 'All', clicks: 3120, signups: 248, orders: 312, revenue: 482300, commission: 48230, lastClick: 'Dec 14, 2026 10:18 AM' },
        { id: 'URL-A008', ambassador: 'Rohan Patel', college: 'NIT Trichy', label: 'Master Link', url: 'https://gajab.com/r/ROHAN-NITT', channel: 'All', clicks: 2980, signups: 224, orders: 287, revenue: 421800, commission: 42180, lastClick: 'Dec 13, 2026 9:48 PM' },
    ];
    const urlRepo = db.getRepository(AffiliateUrl);
    await urlRepo.save(adminAffiliateUrls.map((u) => urlRepo.create({
        id: u.id, ambassadorId: ambIdByName[u.ambassador] ?? null, college: u.college, label: u.label, url: u.url,
        channel: u.channel, clicks: u.clicks, signups: u.signups, orders: u.orders,
        revenue: u.revenue, commission: u.commission, lastClick: parseDate(u.lastClick)!,
    } as Partial<AffiliateUrl>)));

    const commissionHistory = [
        { id: 'GJ20485', date: '14/12/2026 02:14 PM', product: 'RC Drift Car 1:18', category: 'Toys & Games', urlLabel: 'Insta Bio', orderValue: 1066, commissionPct: 10, commission: 106, status: 'Confirmed', payoutStatus: 'Pending' },
        { id: 'GJ20471', date: '14/12/2026 11:02 AM', product: 'Glass Container Pack of 4', category: 'Home & Garden', urlLabel: 'WhatsApp Hostel', orderValue: 581, commissionPct: 10, commission: 58, status: 'Confirmed', payoutStatus: 'Pending' },
        { id: 'GJ20458', date: '13/12/2026 06:48 PM', product: 'Kids Instant Print Camera', category: 'Electronics', urlLabel: 'Insta Bio', orderValue: 1761, commissionPct: 10, commission: 176, status: 'Placed', payoutStatus: 'Locked' },
        { id: 'GJ20442', date: '13/12/2026 04:12 PM', product: 'Foldable Art Board - Pink', category: 'Arts & Crafts', urlLabel: 'Master Link', orderValue: 1167, commissionPct: 10, commission: 117, status: 'Confirmed', payoutStatus: 'Pending' },
        { id: 'GJ20429', date: '12/12/2026 11:24 AM', product: 'Diecast Rolls Royce 1:24', category: 'Toys & Games', urlLabel: 'Freshers Reel', orderValue: 1534, commissionPct: 10, commission: 153, status: 'Cancelled', payoutStatus: 'Reversed' },
        { id: 'GJ20418', date: '11/12/2026 09:38 PM', product: 'Korean Skincare Combo', category: 'Beauty', urlLabel: 'Insta Bio', orderValue: 2244, commissionPct: 12, commission: 269, status: 'Confirmed', payoutStatus: 'Paid' },
        { id: 'GJ20407', date: '10/12/2026 02:55 PM', product: 'Stationery Mega Box', category: 'Stationery', urlLabel: 'Master Link', orderValue: 489, commissionPct: 8, commission: 39, status: 'Confirmed', payoutStatus: 'Paid' },
        { id: 'GJ20407b', date: '09/12/2026 05:14 PM', product: 'Wireless Earbuds Pro', category: 'Electronics', urlLabel: 'Notice Board QR', orderValue: 1899, commissionPct: 10, commission: 190, status: 'Confirmed', payoutStatus: 'Paid' },
        { id: 'GJ20381', date: '08/12/2026 10:02 AM', product: 'Foldable Camping Chair', category: 'Sporting Goods', urlLabel: 'WhatsApp Hostel', orderValue: 1325, commissionPct: 10, commission: 132, status: 'Confirmed', payoutStatus: 'Paid' },
        { id: 'GJ20364', date: '06/12/2026 03:45 PM', product: 'Sling Bag - Brown', category: 'Luggage & Bags', urlLabel: 'Insta Bio', orderValue: 749, commissionPct: 10, commission: 75, status: 'Confirmed', payoutStatus: 'Paid' },
    ];
    const chRepo = db.getRepository(CommissionHistory);
    await chRepo.save(commissionHistory.map((c, i) => chRepo.create({
        id: c.id, date: c.date, product: c.product, category: c.category, urlLabel: c.urlLabel,
        ambassadorId: ambIds[i % ambIds.length] ?? null,
        orderValue: c.orderValue, commissionPct: c.commissionPct, commission: c.commission,
        status: c.status, payoutStatus: c.payoutStatus,
    } as Partial<CommissionHistory>)));

    const activityLog = [
        { date: '14/12/2026', clicks: 427, signups: 41, orders: 18, revenue: 30850 },
        { date: '13/12/2026', clicks: 480, signups: 38, orders: 24, revenue: 38900 },
        { date: '12/12/2026', clicks: 610, signups: 52, orders: 31, revenue: 52400 },
        { date: '11/12/2026', clicks: 520, signups: 44, orders: 26, revenue: 41200 },
        { date: '10/12/2026', clicks: 380, signups: 32, orders: 19, revenue: 28800 },
        { date: '09/12/2026', clicks: 410, signups: 36, orders: 22, revenue: 32500 },
        { date: '08/12/2026', clicks: 320, signups: 28, orders: 14, revenue: 24000 },
    ];
    const alRepo = db.getRepository(ActivityLog);
    await alRepo.save(activityLog.map((a) => alRepo.create({
        date: parseDate(a.date)!, clicks: a.clicks, signups: a.signups, orders: a.orders, revenue: a.revenue,
    } as Partial<ActivityLog>)));

    const tasks = [
        { id: 'T-101', title: 'Post Instagram Reel about Gajab Bargains', description: '30-sec reel showing 3 bargain hauls.', deadline: '18/12/2026', reward: 500, assignedCount: 248, completedCount: 142, status: 'Active' },
        { id: 'T-102', title: 'Refer 5 friends from your hostel', description: 'Get 5 hostel-mates to sign up.', deadline: '22/12/2026', reward: 1000, assignedCount: 312, completedCount: 88, status: 'Active' },
        { id: 'T-099', title: 'Campus Bulletin Board Poster', description: 'Print & put up the Gajab poster.', deadline: '15/12/2026', reward: 300, assignedCount: 180, completedCount: 124, status: 'Active' },
        { id: 'T-097', title: 'Library QR Sticker Drive', description: 'Stick QR poster at 3 library entry points.', deadline: '10/12/2026', reward: 250, assignedCount: 95, completedCount: 71, status: 'Closed' },
        { id: 'T-095', title: 'WhatsApp Status Campaign', description: '7-day WhatsApp status streak.', deadline: '08/12/2026', reward: 400, assignedCount: 312, completedCount: 287, status: 'Closed' },
    ];
    const taskRepo = db.getRepository(Task);
    await taskRepo.save(tasks.map((t) => taskRepo.create({
        id: t.id, title: t.title, description: t.description, deadline: parseDate(t.deadline)!,
        reward: t.reward, assignedCount: t.assignedCount, completedCount: t.completedCount, status: t.status,
    } as Partial<Task>)));

    const adminPendingTasks = [
        { id: 'TS-4421', ambassador: 'Riya Sharma', college: 'Delhi University', task: 'Campus Bulletin Board Poster', submittedOn: '2h ago', proof: 'https://drive.google.com/poster-photo', status: 'Pending Review' },
        { id: 'TS-4420', ambassador: 'Vikram Rao', college: 'Anna University', task: 'Instagram Reel Post', submittedOn: '5h ago', proof: 'https://instagram.com/p/abc123', status: 'Pending Review' },
        { id: 'TS-4419', ambassador: 'Meera Joshi', college: 'Pune University', task: 'WhatsApp Status Streak', submittedOn: '1d ago', proof: 'Submitted via app', status: 'Pending Review' },
        { id: 'TS-4418', ambassador: 'Karan Singh', college: 'DTU Delhi', task: 'Refer 5 hostel friends', submittedOn: '1d ago', proof: '5 referrals tracked', status: 'Pending Review' },
        { id: 'TS-4416', ambassador: 'Aditya Verma', college: 'IIM Bangalore', task: 'Library QR Sticker Drive', submittedOn: 'Resubmitted 2h ago', proof: 'https://drive.google.com/qr-photos-v2', status: 'Resubmitted' },
    ];
    const tsRepo = db.getRepository(TaskSubmission);
    await tsRepo.save(adminPendingTasks.map((s) => tsRepo.create({
        submissionId: s.id, ambassadorId: ambIdByName[s.ambassador] ?? null, college: s.college, task: s.task,
        submittedOn: s.submittedOn, proof: s.proof, status: s.status,
    } as Partial<TaskSubmission>)));

    const payouts = [
        { id: 'PO-2026-12', period: 'Dec 1-15, 2026', month: '2026-12', amount: 8420, status: 'Processing', date: 'Expected Dec 20' },
        { id: 'PO-2026-11', period: 'Nov 16-30, 2026', month: '2026-11', amount: 7240, status: 'Paid', date: 'Dec 05, 2026' },
        { id: 'PO-2026-10', period: 'Nov 1-15, 2026', month: '2026-11', amount: 5680, status: 'Paid', date: 'Nov 20, 2026' },
        { id: 'PO-2026-09', period: 'Oct 16-31, 2026', month: '2026-10', amount: 3525, status: 'Paid', date: 'Nov 05, 2026' },
        { id: 'PO-2026-08', period: 'Oct 1-15, 2026', month: '2026-10', amount: 4150, status: 'Paid', date: 'Oct 20, 2026' },
        { id: 'PO-2026-07', period: 'Sep 16-30, 2026', month: '2026-09', amount: 2980, status: 'Paid', date: 'Oct 05, 2026' },
    ];
    const payoutRepo = db.getRepository(Payout);
    await payoutRepo.save(payouts.map((p, i) => payoutRepo.create({
        ...p, ambassadorId: ambIds[i % ambIds.length] ?? null,
    } as Partial<Payout>)));

    const myReferralCodes = [
        { code: 'RIYA10', type: 'Percentage', value: '10%', cap: '₹150', uses: 142, gmv: 184200, commission: 18420, status: 'Active' },
        { code: 'RIYAWELCOME', type: 'Fixed', value: '₹100', cap: '—', uses: 87, gmv: 92400, commission: 9240, status: 'Active' },
        { code: 'RIYAFEST', type: 'Percentage', value: '15%', cap: '₹250', uses: 24, gmv: 38900, commission: 3890, status: 'Expired' },
    ];
    const rcRepo = db.getRepository(ReferralCode);
    await rcRepo.save(myReferralCodes.map((c) => rcRepo.create(c)));

    const announcements = [
        { id: 'ANN-008', title: 'Year-End Bonus: +5% commission on all orders!', body: 'From Dec 20 - Jan 5, every order placed through your link gets an extra 5% commission boost on top of your regular rate. Push hard this week!', audience: 'All Ambassadors', sentOn: '14/12/2026 10:30 AM', reads: 287, total: 312, priority: 'High' },
        { id: 'ANN-007', title: 'New Task Released: Insta Reel Challenge', body: 'We just dropped a fresh task with ₹500 reward. Go check your Tasks tab.', audience: 'All Ambassadors', sentOn: '12/12/2026 04:00 PM', reads: 298, total: 312, priority: 'Medium' },
        { id: 'ANN-006', title: 'Payout Schedule Update — January 2027', body: 'Starting January, payouts will be every Monday instead of bi-monthly. Min payout reduced to ₹250.', audience: 'Gold + Platinum tiers', sentOn: '08/12/2026 11:15 AM', reads: 124, total: 158, priority: 'High' },
        { id: 'ANN-005', title: 'Welcome 24 new ambassadors!', body: 'We just onboarded 24 new ambassadors this week — say hi in the Gajab community group.', audience: 'All Ambassadors', sentOn: '05/12/2026 09:00 AM', reads: 268, total: 312, priority: 'Low' },
    ];
    const annRepo = db.getRepository(Announcement);
    await annRepo.save(announcements.map((a) => annRepo.create({
        id: a.id, title: a.title, body: a.body, audience: a.audience,
        sentOn: parseDate(a.sentOn)!, reads: a.reads, total: a.total, priority: a.priority, sendToAmbassadors: true,
    } as Partial<Announcement>)));

    const pocList = [
        { id: 'POC-001', name: 'Aanya Kapoor', role: 'North Zone Lead', region: 'North India (Delhi, UP, Punjab, Rajasthan)', email: 'aanya@gajab.com', phone: '+91 99887 12345', whatsapp: '+91 99887 12345', linkedAffiliates: ['Riya Sharma', 'Karan Singh', 'Sara Khan', 'Ishaan Kapoor'], workingHours: 'Mon–Sat, 10 AM – 7 PM' },
        { id: 'POC-002', name: 'Rahul Menon', role: 'South Zone Lead', region: 'South India (TN, KA, KL, AP, TS)', email: 'rahul@gajab.com', phone: '+91 99887 67890', whatsapp: '+91 99887 67890', linkedAffiliates: ['Sneha Iyer', 'Rohan Patel', 'Aditya Verma', 'Vikram Rao'], workingHours: 'Mon–Sat, 10 AM – 7 PM' },
        { id: 'POC-003', name: 'Neha Gupta', role: 'West Zone Lead', region: 'West India (MH, GJ, MP, GA)', email: 'neha@gajab.com', phone: '+91 99887 22334', whatsapp: '+91 99887 22334', linkedAffiliates: ['Aarav Mehta', 'Priya Nair', 'Meera Joshi'], workingHours: 'Mon–Sat, 10 AM – 7 PM' },
        { id: 'POC-004', name: 'Ankit Verma', role: 'Tech Support', region: 'Pan India · Tech queries', email: 'tech@gajab.com', phone: '+91 99887 99887', whatsapp: '+91 99887 99887', linkedAffiliates: ['Ananya Reddy'], workingHours: 'All days, 9 AM – 9 PM' },
    ];
    const pocRepo = db.getRepository(Poc);
    await pocRepo.save(pocList.map((p) => pocRepo.create(p as Partial<Poc>)));

    const inboxMessages = [
        { id: 'MSG-014', from: 'Aanya Kapoor (North Zone Lead)', subject: 'Great work last week!', preview: 'Hi Riya, loved your Insta reel campaign. Could you also try targeting hostel groups this week?', body: 'Hi Riya,\n\nLoved your Insta reel campaign last week — really clean storytelling. Could you also try targeting hostel WhatsApp groups this week? They tend to convert at 2x the rate.\n\nLet me know if you need any creative assets.\n\nCheers,\nAanya', receivedOn: '14/12/2026 11:42 AM', read: false, priority: 'Normal' },
        { id: 'MSG-013', from: 'Gajab Admin', subject: 'Reminder: Submit your pending task', preview: 'Your task \'Campus Bulletin Board Poster\' is due in 2 days. Submit photos by Dec 15.', body: 'Reminder: Your task \'Campus Bulletin Board Poster\' is due in 2 days. Submit clear photos by Dec 15 to claim your ₹300 reward.', receivedOn: '13/12/2026 09:00 AM', read: false, priority: 'High' },
        { id: 'MSG-012', from: 'Gajab Admin', subject: 'Your November payout has been processed', preview: '₹7,240 was transferred to your registered UPI on Dec 5. Check your bank statement.', body: 'Your November 16-30 payout of ₹7,240 has been processed to your registered UPI on Dec 5, 2026. If not received, contact support.', receivedOn: '05/12/2026 02:30 PM', read: true, priority: 'Normal' },
        { id: 'MSG-011', from: 'Aanya Kapoor', subject: 'Welcome to Gold tier 🥇', preview: 'Congrats Riya — you just crossed ₹1.5L in lifetime revenue! You\'re now in the Gold tier (12% commission).', body: 'Huge congrats Riya — you just crossed ₹1.5L in lifetime revenue. You\'re now in the Gold tier with 12% commission on all future orders. Keep going!', receivedOn: '28/11/2026 06:15 PM', read: true, priority: 'Normal' },
    ];
    const inboxRepo = db.getRepository(InboxMessage);
    await inboxRepo.save(inboxMessages.map((m) => inboxRepo.create({
        id: m.id, ambassadorId: ambIdByName['Riya Sharma'] ?? null, from: m.from, subject: m.subject,
        preview: m.preview, body: m.body, receivedOn: m.receivedOn, read: m.read, priority: m.priority,
    } as Partial<InboxMessage>)));

    const applicants = [
        { id: 'AP-2026-0142', name: 'Ishaan Kapoor', phone: '+91 98123 45678', email: 'ishaan@iitd.ac.in', college: 'IIT Delhi', city: 'Delhi', state: 'Delhi', commissionPct: 10, appliedOn: 'Dec 12, 2026', status: 'Pending', duplicate: false, comments: '' },
        { id: 'AP-2026-0141', name: 'Pooja Banerjee', phone: '+91 98987 12345', email: 'pooja.b@jadavpuru.ac.in', college: 'Jadavpur University', city: 'Kolkata', state: 'West Bengal', commissionPct: 10, appliedOn: 'Dec 12, 2026', status: 'Pending', duplicate: false, comments: '' },
        { id: 'AP-2026-0140', name: 'Arjun Reddy', phone: '+91 99887 65432', email: 'arjun@iith.ac.in', college: 'IIT Hyderabad', city: 'Hyderabad', state: 'Telangana', commissionPct: 8, appliedOn: 'Dec 11, 2026', status: 'Partially Approved', duplicate: true, comments: 'Approved for 8% (Bronze tier) since reach is limited; can re-evaluate after 30 days of activity.' },
        { id: 'AP-2026-0139', name: 'Sara Khan', phone: '+91 97654 32109', email: 'sara@du.ac.in', college: 'Delhi University', city: 'Delhi', state: 'Delhi', commissionPct: 10, appliedOn: 'Dec 11, 2026', status: 'Pending', duplicate: false, comments: '' },
        { id: 'AP-2026-0138', name: 'Yash Gupta', phone: '+91 98765 11223', email: 'yash@vit.ac.in', college: 'VIT Vellore', city: 'Vellore', state: 'Tamil Nadu', commissionPct: 12, appliedOn: 'Dec 10, 2026', status: 'Approved', duplicate: false, comments: '' },
        { id: 'AP-2026-0137', name: 'Tanvi Desai', phone: '+91 91234 56789', email: 'tanvi@nitt.edu', college: 'NIT Trichy', city: 'Trichy', state: 'Tamil Nadu', commissionPct: 0, appliedOn: 'Dec 10, 2026', status: 'Rejected', duplicate: false, comments: 'Insufficient social media presence — please re-apply after building your Instagram audience.' },
        { id: 'AP-2026-0136', name: 'Kabir Malhotra', phone: '+91 99887 65432', email: 'kabir@iith.ac.in', college: 'IIT Hyderabad', city: 'Hyderabad', state: 'Telangana', commissionPct: 10, appliedOn: 'Dec 09, 2026', status: 'Pending', duplicate: true, comments: '' },
    ];
    const appRepo = db.getRepository(Applicant);
    await appRepo.save(applicants.map((a) => appRepo.create({
        id: a.id, name: a.name, phone: a.phone, email: a.email, college: a.college, city: a.city,
        state: a.state, commissionPct: a.commissionPct, appliedOn: parseDate(a.appliedOn)!,
        status: a.status, duplicate: a.duplicate, comments: a.comments,
    } as Partial<Applicant>)));

    const commissionOverrides = [
        { id: 'CO-001', label: 'Diwali Festive Boost', appliesTo: 'All ambassadors', overridePct: 15, originalPct: 10, startDate: '15/10/2026', endDate: '10/11/2026', status: 'Expired' },
        { id: 'CO-002', label: 'Year-End Mega Sale', appliesTo: 'Gold + Platinum tiers', overridePct: 18, originalPct: 12, startDate: '20/12/2026', endDate: '05/01/2027', status: 'Active' },
        { id: 'CO-003', label: 'Republic Day Campaign', appliesTo: 'All ambassadors', overridePct: 14, originalPct: 10, startDate: '22/01/2027', endDate: '31/01/2027', status: 'Scheduled' },
    ];
    const coRepo = db.getRepository(CommissionOverride);
    await coRepo.save(commissionOverrides.map((c) => coRepo.create({
        id: c.id, label: c.label, appliesTo: c.appliesTo, overridePct: c.overridePct, originalPct: c.originalPct,
        startDate: parseDate(c.startDate)!, endDate: parseDate(c.endDate)!, status: c.status,
    } as Partial<CommissionOverride>)));

    const referralUtilization = [
        { code: 'AARAV15', orderId: 'GJ20485', customerId: 'C-882341', orderValue: 1185, date: 'Dec 14, 2026 2:14 PM', discount: 178, commissionPct: 10, commissionValue: 119 },
        { code: 'SNEHA10', orderId: 'GJ20484', customerId: 'C-882340', orderValue: 2244, date: 'Dec 14, 2026 1:55 PM', discount: 200, commissionPct: 10, commissionValue: 224 },
        { code: 'RIYA10', orderId: 'GJ20483', customerId: 'C-882339', orderValue: 1066, date: 'Dec 14, 2026 1:42 PM', discount: 107, commissionPct: 10, commissionValue: 107 },
        { code: 'KARAN100', orderId: 'GJ20482', customerId: 'C-882338', orderValue: 1534, date: 'Dec 14, 2026 1:28 PM', discount: 100, commissionPct: 8, commissionValue: 123 },
        { code: 'AARAV15', orderId: 'GJ20481', customerId: 'C-882337', orderValue: 581, date: 'Dec 14, 2026 1:15 PM', discount: 87, commissionPct: 10, commissionValue: 58 },
        { code: 'SNEHA10', orderId: 'GJ20480', customerId: 'C-882336', orderValue: 1761, date: 'Dec 14, 2026 12:58 PM', discount: 176, commissionPct: 10, commissionValue: 176 },
    ];
    const ouRepo = db.getRepository(OrderUtilizationLog);
    await ouRepo.save(referralUtilization.map((o, i) => ouRepo.create({
        code: o.code, orderId: o.orderId, customerId: o.customerId, ambassadorId: ambIds[i % ambIds.length] ?? null,
        orderValue: o.orderValue, usedAt: parseDate(o.date)!, discount: o.discount,
        commissionPct: o.commissionPct, commissionValue: o.commissionValue,
    } as Partial<OrderUtilizationLog>)));

    const dummyPassword = hashPassword('123456');
    const users = [
        { email: 'admin@gajab.com', passwordHash: dummyPassword, role: 'admin' as const, ambassadorId: null, name: 'Gajab Admin' },
        { email: 'riya@du.ac.in', passwordHash: dummyPassword, role: 'ambassador' as const, ambassadorId: 'amb_007', name: 'Riya Sharma' },
    ];
    const userRepo = db.getRepository(User);
    await userRepo.save(users.map((u) => userRepo.create(u)));

    // eslint-disable-next-line no-console
    console.log('Seed complete.');
}

db.initialize()
    .then(async () => {
        // eslint-disable-next-line no-console
        console.log('Connected. Clearing existing data...');
        await clearAll();
        await seed();
        await db.destroy();
    })
    .catch((err: unknown) => {
        // eslint-disable-next-line no-console
        console.error('Seed failed:', err);
        process.exit(1);
    });
