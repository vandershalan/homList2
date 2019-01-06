export class Category {

    public id: string;

    constructor(public name: string, public description: string = null, public order:number) {
    };
}