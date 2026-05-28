export abstract class HashComparer {
  abstract comparer(plain: string, hash: string): Promise<boolean>
}
