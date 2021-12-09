const { FRONT_END, STRIPE_WEBHOOK_SECRET } = require("../configs/environments");
const {
  firestore,
  increment,
  arrayUnion,
  timestamp,
} = require("../configs/firebase");
const stripe = require("../configs/stripe");
const { createOrGetCustomer } = require("../utils/stripeUtilityFunctions");
const { validateUser } = require("../utils/validateUser");

exports.products = async (req, res) => {
  try {
    validateUser(req);

    const { data } = await stripe.prices.list();

    const prices = data.map((item) => {
      return {
        id: item.id,
        amount: item.unit_amount / 100,
        currency: item.currency,
        quantity: item.transform_quantity.divide_by,
        name: item.nickname,
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

exports.checkout = async (req, res) => {
  try {
    const { uid } = validateUser(req);
    const customer = await createOrGetCustomer(uid);

    const priceId = req.body.id;

    // create a stripe checkout session with the priceId and customer
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer: customer.id,
      mode: "payment",
      success_url: `${FRONT_END}/payments?success=true&sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONT_END}/payments?success=false&sessionId={CHECKOUT_SESSION_ID}`,
      metadata: {
        priceId,
      },
    });

    res.status(200).json({
      message: "Checkout session created successfully",
      session,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.retrieveSessionDetails = async (req, res) => {
  try {
    const sessionId = req.body.sessionId;

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    // check if the payment was successful

    res.status(200).json({
      paymentStatus: session.payment_intent.status,
      session,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const event = stripe.webhooks.constructEvent(
    req["rawBody"],
    sig,
    STRIPE_WEBHOOK_SECRET
  );

  try {
    if (event.type === "checkout.session.completed") {
      const {
        customer,
        metadata: { priceId },
        payment_status,
        id: sessionId,
      } = event.data.object;

      // check if the payment was successful and then update user's call credits in firebase
      if (payment_status === "paid") {
        const {
          metadata: { firebaseUID },
        } = await stripe.customers.retrieve(customer);

        const {
          transform_quantity: { divide_by: credits },
        } = await stripe.prices.retrieve(priceId);

        const creditsRef = firestore.collection("accounts").doc(firebaseUID);

        if (!(await creditsRef.get()).exists) {
          await creditsRef.set({
            credits,
            sessionsArray: [
              {
                sessionId,
                createdAt: timestamp(),
              },
            ],
          });
        } else {
          await creditsRef.update({
            credits: increment(credits),
            sessionsArray: arrayUnion({
              sessionId,
              createdAt: timestamp(),
            }),
          });
        }
      }
    }

    res.status(200).json({
      message: "Webhook received successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({ webhookError: error.message });
  }
};
