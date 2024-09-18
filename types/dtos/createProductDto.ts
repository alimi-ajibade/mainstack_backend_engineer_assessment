export interface ICreateProductDto {
    title: string;
    description: string;
    unit_price: number;
    inventory: number;
    categoryId: string;
}
