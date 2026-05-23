package com.payment.paymentdemo.repository;

import com.payment.paymentdemo.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CourseRepository extends JpaRepository<Course, Long> {
}
