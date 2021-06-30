import { Member } from '../Member';
import { User } from '../user';

export class Project {
    public id: string;
    public name: string;
    public description: string;
    public owner: string;
    public isArchived: Boolean;
    public status: string;
    public projectMembers: Array<string>;
}
