interface SendNotificationFunction {
  (message: string): void
}

export interface NotifierInterface {
  sendMarkdown: SendNotificationFunction;
}