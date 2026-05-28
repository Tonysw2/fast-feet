import { HashComparer } from 'src/core/cryptography/hash-comparer'
import { HashGenerator } from 'src/core/cryptography/hash-generator'

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return `hashed-${plain}`
  }

  async comparer(plain: string, hash: string): Promise<boolean> {
    return hash === `hashed-${plain}`
  }
}
