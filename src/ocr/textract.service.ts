import { Injectable } from '@nestjs/common';

@Injectable()
export class TextractService {
  async analyzeCheckImage(imageBuffer: Buffer): Promise<{
    donorName?: string;
    amount?: number;
    date?: string;
    checkNumber?: string;
  }> {
    // TODO Phase 2: Call AWS Textract
    console.log('[TEXTRACT STUB] Would analyze check image');
    return {};
  }
}
