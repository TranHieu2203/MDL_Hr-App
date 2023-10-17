export class TalentSetting {
  id?: number;
  name?: string;
  createBy?: string;
  updatedBy?: string;
  createDate?: Date;
  updatedDate?: Date;
  positionId?: number;
  positionName?: string;
  exepFrom?: number;
  exepTo?: number;
  objectTalent?: number[];
  objectTalentName?: number[];
  positionList?: number[];
  positionListName?: string;
  genderName?:string;

  ageFrom?: number;
  ageTo?: number;
  gender?: number[];
  seniorFrom?: number;
  seniorTo?: number;
  learningLevelDk?: string;
  learningLevelId?: number;
  learningLevelName?: string;
  certificate?: number[];
  trainingId?: string;
  trainingName?: string;

  year?: number;
  periodId?: number;
  periodName?: string;
  resultId?: string;
  compentenceId1?: number;
  compentenceDk1?: string;
  compentenceResult1?: number;

  compentenceId2?: number;
  compentenceDk2?: string;
  compentenceResult2?: number;

  compentenceId3?: number;
  compentenceDk3?: string;
  compentenceResult3?: number;

  compentenceId4?: number;
  compentenceDk4?: string;
  compentenceResult4?: number;

  compentenceId5?: number;
  compentenceDk5?: string;
  compentenceResult5?: number;
  isCommend?: boolean;

  yearCommend?: number;
  isDiscipline?: boolean;
  

}
