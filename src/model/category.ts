export class Category {

    public id: string;
    isDefault: boolean;

    constructor(public name: string, public description: string = null, public order:number) {
    };
}