import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'
import { HashComparer } from 'src/core/cryptography/hash-comparer'
import { HashGenerator } from 'src/core/cryptography/hash-generator'

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  hash(plain: string) {
    return hash(plain, 8)
  }

  compare(plain: string, hash: string) {
    return compare(plain, hash)
  }
}
