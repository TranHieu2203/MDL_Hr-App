export class SysDecision {
  id?: number;
  typeDecision?: string;
  character1?: string;
  character2?: string;
  orgid?: number;
  orgname?: string;
  type1?: string;
  type2?: string;
  type3?: string;
  isOrg?: boolean;
  orgs?: Array<any>;
  constructor() {
    this.orgs = [];
  }
}
