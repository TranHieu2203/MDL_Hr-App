export class ApproveTemplateSetup {
    id?: number;
    seProcessTemplateId?: number;
    seProcessTemplateName?: string;
    seProcessTypeId?: number;
    seProcessTypeName?: string;
    orgId?: number;
    orgName?: string;
    effectDate?: Date;
    expireDate?: Date;
    dayFrom?: number;
    dayTo?: number;
    employees?: Array<number>;
}