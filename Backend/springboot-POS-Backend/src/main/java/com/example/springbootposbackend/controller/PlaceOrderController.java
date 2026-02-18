package com.example.springbootposbackend.controller;


import com.example.springbootposbackend.dto.OrderDTO;
import com.example.springbootposbackend.service.impl.OrderServiceIMPL;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@CrossOrigin

public class PlaceOrderController {
    private  final OrderServiceIMPL orderService;

    @PostMapping
    public ResponseEntity<String> placeOrder(@RequestBody OrderDTO orderDTO){
        orderService.placeOrder(orderDTO);
        return ResponseEntity.ok("Order placed successfully");
    }
}
