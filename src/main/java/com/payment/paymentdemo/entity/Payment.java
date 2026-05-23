package com.payment.paymentdemo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String courseTitle;
    private double amount;
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String status;
    private LocalDateTime paymentDate;
}
