export interface GenerateCoverDTO {
    employer: string;
    jobTitle: string;
    jobDescription: string;
    infoType: string;
    resumeId?: string;
    manualInfo?: string;
}

export enum InfoType {
    RESUME = 'RESUME',
    MANUAL = 'MANUAL',
}
