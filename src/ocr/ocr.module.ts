import { Module } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { OcrController } from './ocr.controller';
import { TextractService } from './textract.service';

@Module({
  controllers: [OcrController],
  providers: [OcrService, TextractService],
  exports: [OcrService],
})
export class OcrModule {}
