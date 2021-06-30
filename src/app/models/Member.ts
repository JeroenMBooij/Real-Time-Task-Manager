import { roles } from "./roles";

export class Member {
    id?: string
    uid: string
    username: string
    role: roles

    constructor() {
        this.uid = "";
        this.username = "";
        this.role = roles.admin;
    };
    static toFirestore(member : Member) {
        return {
            uid: member.uid,
            username: member.username,
            role: member.role.toString()
        }
    };
    static fromFirestore(snapshot, options) {
        var user = new Member();
        user.id = snapshot.id;
        const data = snapshot.data(options);
        user.uid = data.uid;
        user.username = data.username;
        user.role = data.role;
        return user
    };
}