package com.example.springbootposbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int qty;
    private double unitPrice;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order; // Me variable name eka thamayi Order eke mappedBy ekata yanne

    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;
}