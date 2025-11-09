import { BadRequestException } from '@nestjs/common';
import { ZodValidationPipe } from './zod-validation.pipe';
import { z, ZodError } from 'zod';

describe('ZodValidationPipe', () => {
  it('returns the original value when validation succeeds', () => {
    const schema = z.object({ name: z.string() });
    const pipe = new ZodValidationPipe(schema);

    const payload = { name: 'Ada' };
    const result = pipe.transform(payload);

    // Should return an identical object
    expect(result).toEqual(payload);
  });

  it('throws BadRequestException with detailed errors when Zod validation fails', () => {
    const schema = z.object({ name: z.string() });
    const pipe = new ZodValidationPipe(schema);

    const invalidPayload = { name: 123 }; // invalid type

    try {
      pipe.transform(invalidPayload);
      fail('Expected transform to throw BadRequestException');
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      const err = e as BadRequestException;

      // The pipe builds a custom response object
      const response = err.getResponse() as ZodError;
      expect(response).toEqual(
        expect.objectContaining({
          statusCode: 400,
          message: 'Validation failed',
        }),
      );
      expect(Array.isArray(response.errors)).toBe(true);
      // One of the errors should reference the 'name' path
      expect(response.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'name',
            // Zod default message for the wrong type contains 'Expected string'
            message: expect.stringContaining('Expected string'),
          }),
        ]),
      );
    }
  });

  it('maps non-Zod errors to a generic BadRequestException', () => {
    const fakeSchema = {
      parse: jest.fn(() => {
        throw new Error('boom');
      }),
    } as never;

    const pipe = new ZodValidationPipe(fakeSchema);

    try {
      pipe.transform({ any: 'thing' });
      fail('Expected transform to throw BadRequestException');
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
      const err = e as BadRequestException;
      expect(err.getStatus()).toBe(400);
      // Message should be the generic one we pass in the constructor
      expect(String(err.message)).toContain('boom');
    }
  });
});
