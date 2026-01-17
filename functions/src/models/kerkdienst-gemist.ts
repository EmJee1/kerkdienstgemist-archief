export interface IServiceEnclosure {
  length: number;
  type: string;
  url: string;
}

export interface IServiceItunes {
  summary: string;
  duration: string;
  author?: string;
}

export interface IKDGService {
  title: string;
  link: string;
  pubDate: string;
  enclosure: IServiceEnclosure;
  content: string;
  contentSnippet: string;
  guid: string;
  isoDate: string;
  itunes: IServiceItunes;
}

/**
 * The service as it is stored in Firestore
 */
export interface IService {
  title: string;
  file: string;
  /**
   * This is populated only if the service has a pastor (empty for 'leesdiensten').
   * This field has been stored since January 2026, all services before that time do not have this field.
   */
  pastor?: string;
  /**
   * The date that the service was HELD; NOT the date it was uploaded to Firestore.
   */
  createdAt: Date;
}
