import { BadRequestException, PipeTransform } from '@nestjs/common'
import type { ZodType } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value)

    if (!result.success) {
      const messages = result.error.issues.map((e) => e.message).join(', ')
      throw new BadRequestException(messages)
    }

    return result.data
  }
}
