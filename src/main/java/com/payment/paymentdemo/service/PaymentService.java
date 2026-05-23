package com.payment.paymentdemo.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    public String createOrder(int amountInPaise, String receipt) throws RazorpayException {
        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        JSONObject request = new JSONObject();
        request.put("amount", amountInPaise);   // example: 49900 for ₹499
        request.put("currency", "INR");
        request.put("receipt", receipt);

        Order order = client.orders.create(request);

        log.info("Created Razorpay order: id={}, amount={}, currency={}",
                order.get("id"),
                order.get("amount"),
                order.get("currency"));

        return order.toString();
    }

    public boolean verifyPayment(String serverOrderId,
                                 String razorpayPaymentId,
                                 String razorpaySignature) throws RazorpayException {
        JSONObject options = new JSONObject();
        options.put("razorpay_order_id", serverOrderId);
        options.put("razorpay_payment_id", razorpayPaymentId);
        options.put("razorpay_signature", razorpaySignature);

        return Utils.verifyPaymentSignature(options, keySecret);
    }
}