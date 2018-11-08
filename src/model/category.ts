export class Category {

    public id: string;
    public order: number;

    constructor(public name: string, public description: string = null) {
    };
}