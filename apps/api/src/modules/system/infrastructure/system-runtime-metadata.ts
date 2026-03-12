import { Injectable } from '@nestjs/common';
import { parseAppEnvironment } from '../../../config/app-environment';

@Injectable()
export class SystemRuntimeMetadata {
  getAppName() {
    return parseAppEnvironment(process.env).APP_NAME;
  }
}
