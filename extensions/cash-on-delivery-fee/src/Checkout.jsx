import {
  Banner,
  reactExtension,
  useCartLines,
  useApplyCartLinesChange,
  useSelectedPaymentOptions,
  useSettings,
  useDeliveryGroups
} from '@shopify/ui-extensions-react/checkout';
import { useEffect, useState } from 'react';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {

  const [selectedMethod, setSelectedMethod] = useState(false);
  const applyCartLinesChange = useApplyCartLinesChange();
  const cartLines = useCartLines();
  const deliveryGroups = useDeliveryGroups();
  const selectedPayment = useSelectedPaymentOptions();
  const { variantId } = useSettings();
  const isAvailable = cartLines.some(line => line.merchandise.id === variantId)
  const getFeeProduct = cartLines.find(get => get?.merchandise?.id === variantId)

  async function removeFromCart() {
    const removeItem = await applyCartLinesChange({
      type: "removeCartLine",
      id: getFeeProduct?.id,
      quantity: 1,
    });
    removeItem.type == 'success' ? console.log(removeItem.type) : console.error(removeItem.message);
  }

  async function addToCart() {
    if (!isAvailable) {
      const item = await applyCartLinesChange(
        {
          type: "addCartLine",
          merchandiseId: variantId,
          quantity: 1,
        }
      )
      item.type == 'success' ? console.log(item.type) : console.error(item.message);
    }
  }

  useEffect(() => {
    selectedPayment.forEach((payment) => {
      if (payment?.type?.toLocaleLowerCase().includes("delivery") && !selectedMethod) {
        addToCart();
      } else {
        removeFromCart();
      }
    });
  }, [selectedPayment]);

  useEffect(() => {
    deliveryGroups.every((group) => {
      const deliveryOptions = group?.deliveryOptions;
      const selectedOption = group?.selectedDeliveryOption?.handle;
      setSelectedMethod(deliveryOptions.some((option) => option.handle === selectedOption && option.title.toLocaleLowerCase().includes("express shipping")))
    })
  }, [deliveryGroups])

  return (
    <>
      
    </>
  );
}