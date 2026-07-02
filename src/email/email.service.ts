import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendReceiptEmail(donation: any, receipt: any): Promise<void> {
    if (process.env.NODE_ENV === 'production' && process.env.SENDGRID_API_KEY) {
      // TODO Phase 2: import @sendgrid/mail and implement
    }
    console.log(
      `[EMAIL STUB] Would send receipt ${receipt.receiptNumber} to ${receipt.sentTo}`,
    );
  }

  async sendYearEndLetter(donor: any, donations: any[]): Promise<void> {
    console.log(
      `[EMAIL STUB] Would send year-end letter to ${donor.email} for ${donations.length} donations`,
    );
  }
}
