import UserModel from './User'
import CategoryModel from './Category'
import ProductModel from './Product'

const user = new UserModel()
const category = new CategoryModel()
const product = new ProductModel()
export default {
  user,
  category,
  product
}
