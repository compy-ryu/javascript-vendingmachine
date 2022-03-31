import { $ } from '../../utils';
import { validateHoldingAmountToAdd } from '../../utils/VendingMachine/validator';
import HoldingAmountStore from '../../store/HoldingAmountStore';
import { template } from '../template';

export default class HoldingAmountPage {
  renderMethodList;

  $addFormSection;
  $addForm;

  $tableSection;
  $table;

  constructor() {
    HoldingAmountStore.addSubscriber(this.render);
    this.setRenderMethodList();
  }

  mountPage = () => {
    $('main').innerHTML = template.holdingAmountPage;

    this.setDom();
    this.render({
      state: HoldingAmountStore.getState(),
      changedStateNames: Object.keys(this.renderMethodList),
    });
    this.setEvents();
  };

  unmountPage() {
    this.$addForm = null;
    this.$addFormSection = null;

    this.$tableSection = null;
    this.$table = null;
  }

  setDom() {
    this.$addFormSection = $('#add-holding-amount-form-section');
    this.$addForm = $('#add-holding-amount-form', this.$addFormSection);

    this.$tableSection = $('#holding-amount-table-section');
    this.$table = $('#holding-amount-table', this.$tableSection);
  }

  setRenderMethodList() {
    this.renderMethodList = {
      coins: [this.drawTotalHoldingAmount, this.drawHoldingAmountList],
    };
  }

  setEvents() {
    this.$addForm.addEventListener('submit', this.onSubmitAddHoldingAmountForm);
  }

  render = ({ state, changedStateNames }) => {
    const renderTargetMethod = changedStateNames.reduce((previous, stateKey) => {
      this.renderMethodList[stateKey].forEach(renderMethod => previous.add(renderMethod));
      return previous;
    }, new Set());

    renderTargetMethod.forEach(renderMethod => renderMethod(state));
  };

  onSubmitAddHoldingAmountForm(event) {
    event.preventDefault();
    const $input = $('input[name="add-holding-amount"]', event.target);
    const totalAmount = HoldingAmountStore.getTotalAmount();

    try {
      validateHoldingAmountToAdd(Number($input.value), totalAmount);
    } catch (error) {
      alert(error.message);
      return;
    }

    HoldingAmountStore.addAmount($input.value);
    $input.value = '';
  }

  drawTotalHoldingAmount = () => {
    const totalAmount = HoldingAmountStore.getTotalAmount();

    $(
      '#total-holding-amount',
      this.$addFormSection,
    ).innerText = `${totalAmount.toLocaleString()}원`;
  };

  drawHoldingAmountList = ({ coins }) => {
    $('tbody', this.$table).innerHTML = template.holdingAmountTableRows(coins);
  };
}
