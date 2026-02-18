package com.example.springbootposbackend.repository;

import com.example.springbootposbackend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepo extends JpaRepository<Order, String> {
}
