import { IOrder } from "../models/Order";

// This is a mock email service. In production, use SendGrid, Resend, or AWS SES.
export const sendOrderConfirmationEmail = async (email: string, order: IOrder) => {
  console.log(`\n📧 [EMAIL MOCK] Order Confirmation sent to ${email}`);
  console.log(`   Order Number: ${order.orderNumber}`);
  console.log(`   Total Amount: ₹${order.totalAmount}`);
  return Promise.resolve(true);
};

export const sendShippingEmail = async (email: string, order: IOrder) => {
  console.log(`\n📧 [EMAIL MOCK] Shipping Update sent to ${email}`);
  console.log(`   Order Number: ${order.orderNumber}`);
  console.log(`   Tracking: ${order.trackingNumber}`);
  return Promise.resolve(true);
};

export const sendDeliveryEmail = async (email: string, order: IOrder) => {
  console.log(`\n📧 [EMAIL MOCK] Delivery Confirmation sent to ${email}`);
  console.log(`   Order Number: ${order.orderNumber}`);
  return Promise.resolve(true);
};
