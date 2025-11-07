export interface CreateKycSessionDto {
  email: string;
  age: number;
}

export interface DiditWebhookDto {
  id: string;
  event: string;
  data: any;
}
