export class Category {

    public static WITHOUT_CATEGORY_NAME = 'Without category';
    public static WITHOUT_CATEGORY_DESCRIPTION = 'Category for items without category';
    public static WITHOUT_CATEGORY = new Category(Category.WITHOUT_CATEGORY_NAME, Category.WITHOUT_CATEGORY_DESCRIPTION, 0);

    public id: string;
    isDefault: boolean;

    constructor(public name: string, public description: string = null, public order:number) {
    };
}