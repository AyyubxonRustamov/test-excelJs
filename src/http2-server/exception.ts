export class Exception {
  constructor(
    public message: string,
    public data: any,
    public success: boolean = false,
    public time = new Date()
  ) {}

  public static unauthorized(data) {
    return new Exception("Unauthorized", data);
  }

  public static notEnoughPermisson(data) {
    return new Exception("Not enough pemission", data);
  }
}
