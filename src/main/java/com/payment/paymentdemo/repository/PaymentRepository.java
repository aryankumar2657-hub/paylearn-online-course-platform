package com.payment.paymentdemo.repository;

import com.payment.paymentdemo.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
