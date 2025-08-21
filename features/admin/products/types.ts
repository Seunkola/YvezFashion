export type Category =
  | 'African designs'
  | 'Corporate looks'
  | 'Everyday fashion'
  | 'Chic Fashion'
  | 'Sporty'
  | 'Others'

export type Product = {
    name: string,
    description: string,
    price: number,
    stock_quantity: number,
    category: Category,
    image_url: string
}