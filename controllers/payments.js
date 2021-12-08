const stripe = require("../configs/stripe");

exports.products = async (_req, res) => {
  try {
    const { data } = await stripe.prices.list();

    const prices = data.map((item) => {
      return {
        id: item.id,
        amount: item.unit_amount / 100,
        currency: item.currency,
        quantity: item.transform_quantity.divide_by,
      };
    });

    // calculate percentatge discounts based on lowest price

    // lowest price
    const lowestPrice = prices.reduce((lowest, current) => {
      if (current.amount < lowest.amount) {
        return current;
      } else {
        return lowest;
      }
    });

    prices.forEach((item) => {
      const numberOfQuantityOfLowestPrice =
        item.quantity / lowestPrice.quantity;
      const ammountBasedOnLowestPrice =
        lowestPrice.amount * numberOfQuantityOfLowestPrice;
      const discount = ammountBasedOnLowestPrice - item.amount;

      const discountPercentage = (discount / ammountBasedOnLowestPrice) * 100;

      item.discountPercentage = discountPercentage;
    });

    res.status(200).json({
      message: "Products fetched successfully",
      prices,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message || "Something went wrong",
    });
  }
};
