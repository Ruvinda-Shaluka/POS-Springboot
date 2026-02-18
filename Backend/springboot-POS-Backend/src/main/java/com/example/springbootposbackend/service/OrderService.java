package com.example.springbootposbackend.service;

import com.example.springbootposbackend.dto.OrderDTO;

public interface OrderService {
    public void placeOrder(OrderDTO orderDTO);
}
