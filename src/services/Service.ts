export default abstract class Service<T> {
  private name: string

  constructor(name: string) {
    this.name = name
  }

  public getName() {
    return this.name
  }

  public abstract start(): Promise<T>
}