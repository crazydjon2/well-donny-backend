import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import { validateEnvironment } from 'src/validations/validate-environment.helper';

export const config: ConfigModuleOptions = {
  isGlobal: true,
  validate: validateEnvironment,
};
