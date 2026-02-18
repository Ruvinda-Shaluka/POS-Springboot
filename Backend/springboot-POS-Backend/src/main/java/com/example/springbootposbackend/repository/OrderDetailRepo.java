package com.example.springbootposbackend.repository;

import com.example.springbootposbackend.dto.OrderDetailDTO;
import com.example.springbootposbackend.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderDetailRepo extends JpaRepository<OrderDetail, Long> {
}
