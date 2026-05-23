package com.payment.paymentdemo.dto;

import lombok.Data;

@Data
public class VerifyPaymentRequest {
    private String courseTitle;
    private long amount;
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpaySignature;
}