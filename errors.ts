
export
class ErrorWithCode extends Error {
  public code: number;

  constructor(code_: number, message: string) {
    super(message);
    this.code = code_;
  }
}
