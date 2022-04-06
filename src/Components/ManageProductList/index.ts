import Component from 'Components/Abstract';
import ProductList from 'Components/@Shared/ProductList';
import ProductStore from 'Store/ProductStore';
import { validateProduct } from 'Utils/VendingMachine/validator';

export default class ManageProductList extends Component {
  template() {
    const { handleProductUpdate, handleRemoveProduct } = this;

    return this.createChildComponent<IProductListProps>(ProductList, {
      caption: '상품 현황',
      listType: 'manage',
      onProductUpdate: handleProductUpdate,
      onRemoveProduct: handleRemoveProduct,
    });
  }

  handleProductUpdate(productIndex: number, product: IProduct) {
    try {
      validateProduct(product);
    } catch (error) {
      alert(error.message);
      return;
    }

    ProductStore.updateProduct(productIndex, product);
  }

  handleRemoveProduct(productIndex: number) {
    ProductStore.updateProduct(productIndex);
  }
}
