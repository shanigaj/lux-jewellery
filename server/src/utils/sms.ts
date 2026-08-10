// This is a mock SMS service. In production, use Twilio, AWS SNS, or equivalent.

export const sendOrderSMS = async (phone: string, orderNumber: string) => {
  console.log(`\n📱 [SMS MOCK] Order Placed sent to ${phone}`);
  console.log(`   Message: Sparenza & Co.: Your order ${orderNumber} is confirmed.`);
  return Promise.resolve(true);
};

export const sendShippingSMS = async (phone: string, orderNumber: string, trackingNumber: string) => {
  console.log(`\n📱 [SMS MOCK] Order Shipped sent to ${phone}`);
  console.log(`   Message: Sparenza & Co.: Order ${orderNumber} shipped. Tracking: ${trackingNumber}`);
  return Promise.resolve(true);
};

export const sendDeliverySMS = async (phone: string, orderNumber: string) => {
  console.log(`\n📱 [SMS MOCK] Order Delivered sent to ${phone}`);
  console.log(`   Message: Sparenza & Co.: Order ${orderNumber} has been delivered. Enjoy!`);
  return Promise.resolve(true);
};
