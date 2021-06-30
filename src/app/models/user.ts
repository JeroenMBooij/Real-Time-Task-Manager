
export class User {
    uid: string
    id?: string
    username: string

    constructor() {
        this.uid = "";
        this.username = ""
    };
    static toFirestore(user : User) {
        return {
            uid: user.uid,
            username: user.username
        }
    };
    static fromFirestore(snapshot, options) {
        var user = new User();
        user.id = snapshot.id;
        const data = snapshot.data(options);
        user.uid = data.uid;
        user.username = data.username;

        return user
    };
}