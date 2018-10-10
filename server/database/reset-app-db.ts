// tslint:disable:max-line-length
// import { RedisDatabase } from './redis'
import { Categories, DbProduct } from '../product/product-api'
import { serverConfig } from '../server-config'

const imageUrl = serverConfig.imageUrl

export interface KeyedObj<T> {
  [key: string]: T
}

// export const CATEGORIES: KeyedObj<Category> = {
export const categoriesPreload: Categories = {
  database: {
    key: 'database',
    lead: 'Ralph Tamlyn',
    title: 'Database Taxonomy'
  },
  manpower: {
    key: 'manpower',
    lead: 'Robert Tamlyn',
    title: 'Manpower Services'
  },
  'web-dev': {
    key: 'web-dev',
    lead: 'Kevin Tamlyn',
    title: 'Web Development'
  },
  veggies: {
    key: 'web-dev',
    lead: 'Kevin Tamlyn',
    title: 'Veggies'
  }
}

export function getPreloadProducts(assetsUrl = imageUrl) {
  console.log(`Using ${assetsUrl} for the assetsUrl`)
  const products: DbProduct[] = [
    {
      category: 'database',
      imageUrl: assetsUrl + '/' + 'assets/images/ch.jpg',
      price: 5,
      title: 'Taxonomy Services Lite'
    },
    {
      category: 'web-dev',
      imageUrl: assetsUrl + '/' + 'assets/images/hot-babe.jpg',
      price: 10,
      title: 'Web App Testing'
    },
    {
      category: 'manpower',
      imageUrl: assetsUrl + '/' + 'assets/images/mc1.jpg',
      price: 10,
      title: 'Web App Testing II'
    },
    {
      category: 'web-dev',
      imageUrl: assetsUrl + '/' + 'assets/images/pretty-lady.jpg',
      price: 22,
      title: 'Wordpress Sites'
    },
    {
      category: 'veggies',
      imageUrl: assetsUrl + '/' + 'assets/images/spinach.jpg',
      price: 2.5,
      title: 'Spinach'
    },
    {
      category: 'database',
      imageUrl: 'https://static.pexels.com/photos/2434/bread-food-healthy-breakfast.jpg',
      price: 3,
      title: 'Freshly Baked Bread'
    },
    {
      category: 'veggies',
      imageUrl: assetsUrl + '/' + 'assets/images/avocado.jpg',
      price: 1.75,
      title: 'Avacado'
    },
    {
      category: 'web-dev',
      imageUrl: 'https://static.pexels.com/photos/8390/food-wood-tomatoes.jpg',
      price: 2.5,
      title: 'Tomato'
    },
    {
      category: 'web-dev',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/7/7f/Lettuce_Mini_Heads_%287331119710%29.jpg',
      price: 1,
      title: 'Lettuce'
    },
    {
      category: 'web-dev',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Cauliflowers_-_20051021.jpg/1280px-Cauliflowers_-_20051021.jpg',
      price: 1.75,
      title: 'Cauliflower'
    },
    {
      category: 'manpower',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Bananas.jpg/1024px-Bananas.jpg',
      price: 1.25,
      title: 'Banana'
    },
    {
      category: 'manpower',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Orange-Fruit-Pieces.jpg',
      price: 1.7,
      title: 'Orange'
    },
    {
      category: 'manpower',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg',
      price: 2,
      title: 'Apple'
    },
    {
      category: 'manpower',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Kyoho-grape.jpg',
      price: 2,
      title: 'Grape'
    },
    {
      category: 'database',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Autumn_Red_peaches.jpg',
      price: 2,
      title: 'Peach'
    },
    {
      category: 'database',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Cinnamon-other.jpg',
      price: 0.5,
      title: 'Cinnamon Sticks'
    },
    {
      category: 'database',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Saffron_Crop.JPG',
      price: 3,
      title: 'Saffron'
    },
    {
      category: 'manpower',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Fabrication_du_lavash_%C3%A0_Noravank_%286%29.jpg/1280px-Fabrication_du_lavash_%C3%A0_Noravank_%286%29.jpg',
      price: 1.25,
      title: 'Lavash Bread'
    },
    {
      category: 'manpower',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Bagel-Plain-Alt.jpg',
      price: 1,
      title: 'Bagel Bread'
    },
    {
      category: 'manpower',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Strawberries.jpg',
      price: 1.95,
      title: 'Strawberry'
    },
    {
      category: 'manpower',
      imageUrl: 'https://static.pexels.com/photos/416607/pexels-photo-416607.jpeg',
      price: 1.25,
      title: 'Baguette Bread'
    }
  ]
  return products
}
