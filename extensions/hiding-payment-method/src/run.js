// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const configuration = JSON.parse(
    input?.paymentCustomization?.metafield?.value ?? "{}"
  );

  const selectedShippingOption =
    input?.cart?.deliveryGroups[0]?.selectedDeliveryOption;

  // const getMethods = input?.paymentMethods.filter((method) => !method.name.toLocaleLowerCase().includes("cash on delivery"));
  // console.log(JSON.stringify(selectedShippingOption));
  // console.log(JSON.stringify(getMethods));

  // const allHides = getMethods.map((e) => {
  //   return {
  //     hide: {
  //       paymentMethodId: e?.id,
  //     },

  //   }
  // })

  const getPayMethod = input?.paymentMethods.find((method) => method.name.includes("Cash on Delivery"));
  if (selectedShippingOption?.title?.toLocaleLowerCase().includes("express")) {
    return {
      operations: [
        {
          hide: {
            paymentMethodId: getPayMethod?.id || '',
          }
        }
      ]
    }
  }
  // if (selectedShippingOption?.title?.toLocaleLowerCase().includes("(cash on delivery)")) {
  //   return {
  //     operations: allHides,
  //   }
  // }
  return NO_CHANGES;
};