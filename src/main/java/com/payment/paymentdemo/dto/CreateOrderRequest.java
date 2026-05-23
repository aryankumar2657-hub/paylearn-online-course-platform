package com.payment.paymentdemo.dto;

import lombok.Data;
@Data
public class CreateOrderRequest {
    private Long amount;
    private String courseTitle;
}
