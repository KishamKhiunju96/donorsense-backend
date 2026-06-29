import { PrismaClient, DonationStatus, DonationType, PaymentMethod, Frequency, CampaignStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Organization
  const org = await prisma.organization.create({
    data: {
      id: 'org-001',
      name: 'Hope Foundation',
      ein: '12-3456789',
      email: 'admin@hopefoundation.org',
      passwordHash: await bcrypt.hash('password123', 10),
      country: 'US',
      state: 'TX',
      isActive: true,
    },
  });

  // Campaigns
  const camp1 = await prisma.campaign.create({
    data: {
      id: 'camp-001',
      orgId: org.id,
      name: 'Annual Fund 2025',
      description: 'Our annual fundraising campaign',
      goal: 50000,
      status: CampaignStatus.ACTIVE,
    },
  });
  const camp2 = await prisma.campaign.create({
    data: {
      id: 'camp-002',
      orgId: org.id,
      name: 'Capital Campaign',
      description: 'Building our new community center',
      goal: 200000,
      status: CampaignStatus.ACTIVE,
    },
  });

  // Donors
  const donor1 = await prisma.donor.create({
    data: {
      id: 'donor-001',
      orgId: org.id,
      firstName: 'Sarah',
      lastName: 'Mitchell',
      email: 'sarah.mitchell@email.com',
      phone: '(555) 234-5678',
      address: '142 Maple Street',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      country: 'US',
      tags: ['Major Donor', 'Monthly'],
      notes: 'Prefers email communication. Major annual gala donor.',
      isAnonymous: false,
      createdAt: new Date('2024-01-15T10:00:00Z'),
    },
  });
  const donor2 = await prisma.donor.create({
    data: {
      id: 'donor-002',
      orgId: org.id,
      firstName: 'James',
      lastName: 'Okafor',
      email: 'james.okafor@company.com',
      phone: '(555) 876-5432',
      address: '87 Corporate Blvd',
      city: 'Dallas',
      state: 'TX',
      zip: '75201',
      country: 'US',
      tags: ['Corporate', 'Major Donor'],
      notes: 'Corporate matching available. Contact via email only.',
      createdAt: new Date('2024-02-20T09:00:00Z'),
    },
  });
  const donor3 = await prisma.donor.create({
    data: {
      id: 'donor-003',
      orgId: org.id,
      firstName: 'Emily',
      lastName: 'Chen',
      email: 'emily.chen@email.com',
      phone: '(555) 345-6789',
      city: 'Houston',
      state: 'TX',
      country: 'US',
      tags: ['Monthly'],
      createdAt: new Date('2024-03-10T08:00:00Z'),
    },
  });

  // Donations
  const don1 = await prisma.donation.create({
    data: {
      id: 'don-001',
      orgId: org.id,
      donorId: donor1.id,
      campaignId: camp1.id,
      amount: 500,
      currency: 'USD',
      status: DonationStatus.CLEARED,
      type: DonationType.RECURRING,
      method: PaymentMethod.ACH_BANK_TRANSFER,
      frequency: Frequency.MONTHLY,
      nextExpectedDate: new Date('2025-07-01T00:00:00Z'),
      transactionId: 'TXN-2025-00142',
      receiptNumber: 'RCP-001-2025',
      createdAt: new Date('2025-06-01T14:32:00Z'),
    },
  });
  const don2 = await prisma.donation.create({
    data: {
      id: 'don-002',
      orgId: org.id,
      donorId: donor2.id,
      campaignId: camp2.id,
      amount: 5000,
      currency: 'USD',
      status: DonationStatus.CLEARED,
      type: DonationType.ONE_TIME,
      method: PaymentMethod.CHECK,
      checkNumber: 'CHK-4892',
      transactionId: 'TXN-2025-00143',
      receiptNumber: 'RCP-002-2025',
      createdAt: new Date('2025-05-28T10:15:00Z'),
    },
  });
  await prisma.donation.create({
    data: {
      id: 'don-003',
      orgId: org.id,
      donorId: donor3.id,
      campaignId: camp1.id,
      amount: 150,
      currency: 'USD',
      status: DonationStatus.RECEIVED,
      type: DonationType.RECURRING,
      method: PaymentMethod.CREDIT_CARD,
      frequency: Frequency.MONTHLY,
      nextExpectedDate: new Date('2025-07-10T00:00:00Z'),
      transactionId: 'TXN-2025-00144',
      receiptNumber: 'RCP-003-2025',
      createdAt: new Date('2025-06-10T09:00:00Z'),
    },
  });

  // Receipts (only for don-001 and don-002; don-003 intentionally missing for "pending" test)
  await prisma.receipt.create({
    data: {
      id: 'rec-001',
      orgId: org.id,
      donorId: donor1.id,
      donationId: don1.id,
      receiptNumber: 'RCP-001-2025',
      sentAt: new Date('2025-06-01T14:35:00Z'),
      sentTo: 'sarah.mitchell@email.com',
      sentVia: 'email',
      createdAt: new Date('2025-06-01T14:34:00Z'),
    },
  });
  await prisma.receipt.create({
    data: {
      id: 'rec-002',
      orgId: org.id,
      donorId: donor2.id,
      donationId: don2.id,
      receiptNumber: 'RCP-002-2025',
      sentAt: new Date('2025-05-28T10:20:00Z'),
      sentTo: 'james.okafor@company.com',
      sentVia: 'email',
      createdAt: new Date('2025-05-28T10:19:00Z'),
    },
  });

  console.log('✅ Seed complete');
}

main().catch(console.error).finally(() => prisma.$disconnect());
