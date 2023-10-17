export class MailSetting {
  id?: number;
  code?: string;
  name?: string;
  subjectMail?: string;
  mailCC?: string;
  mailBCC?: string;
  body?: string;
  moduleId?: number;
  createBy?: string;
  updatedBy?: string;
  createDate?: Date;
  updatedDate?: Date;
  elements: any[] = [];
}
