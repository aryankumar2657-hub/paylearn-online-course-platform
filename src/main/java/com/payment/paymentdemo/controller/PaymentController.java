package com.payment.paymentdemo.controller;

import com.payment.paymentdemo.dto.CreateOrderRequest;
import com.payment.paymentdemo.dto.VerifyPaymentRequest;
import com.payment.paymentdemo.entity.Payment;
import com.payment.paymentdemo.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    private final PaymentRepository paymentRepository;
    @Autowired

    public PaymentController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @PostMapping("/create-order")
    public Map<String, Object> createOrder(@RequestBody CreateOrderRequest request) throws Exception {
        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", request.getAmount() * 100);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "course_receipt_" + System.currentTimeMillis());

        Order order = razorpay.orders.create(orderRequest);

        return Map.of(
                "key", razorpayKeyId,
                "orderId", order.get("id"),
                "amount", request.getAmount(),
                "currency", "INR",
                "courseTitle", request.getCourseTitle()
        );
    }

    @PostMapping("/verify")
    public Payment verifyPayment(@RequestBody VerifyPaymentRequest request) throws Exception {
        JSONObject options = new JSONObject();
        options.put("razorpay_order_id", request.getRazorpayOrderId());
        options.put("razorpay_payment_id", request.getRazorpayPaymentId());
        options.put("razorpay_signature", request.getRazorpaySignature());

        boolean isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);

        Payment payment = new Payment();
        payment.setCourseTitle(request.getCourseTitle());
        payment.setAmount(request.getAmount());
        payment.setRazorpayOrderId(request.getRazorpayOrderId());
        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setStatus(isValid ? "SUCCESS" : "FAILED");
        payment.setPaymentDate(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    @GetMapping
    public List<Payment> getPayments() {
        return paymentRepository.findAll();
    }
}
