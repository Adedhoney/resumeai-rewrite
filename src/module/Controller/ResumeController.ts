import { IResumeService } from '@module/Service';

export class ResumeController {
    constructor(private service: IResumeService) {
        this.service = service;
    }
}
