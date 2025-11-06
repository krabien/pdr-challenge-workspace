import {Injectable} from '@nestjs/common';
import {shared} from '@pdr-challenge-workspace/shared';

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: `Hello, API! shared is: ${shared()}` };
  }
}
