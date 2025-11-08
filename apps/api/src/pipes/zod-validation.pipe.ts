import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  // The schema is passed to the constructor (e.g., UserSchema)
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      // 1. Attempt to parse the request body using the Zod schema
      this.schema.parse(value);

      // 2. If successful, return the value
      return value;
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
