import { Module } from '@nestjs/common';
import { SystemService } from './application/system.service';
import { SystemRuntimeMetadata } from './infrastructure/system-runtime-metadata';
import { SystemController } from './presentation/controllers/system.controller';

@Module({
  controllers: [SystemController],
  providers: [SystemRuntimeMetadata, SystemService],
})
export class SystemModule {}
