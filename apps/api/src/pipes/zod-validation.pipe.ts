import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

/**
 * ZodValidationPipe is a custom NestJS pipe that validates incoming data using Zod schemas.
 * It implements PipeTransform to transform incoming data before it reaches the controller.
 */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        // 3. If validation fails, format the error messages
        const errorMessages = error.errors.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));

        // 4. Throw a 400 Bad Request exception with the detailed errors
        throw new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: errorMessages,
        });
      }
      // Re-throw any other errors
      throw new BadRequestException(error);
    }
  }
}
