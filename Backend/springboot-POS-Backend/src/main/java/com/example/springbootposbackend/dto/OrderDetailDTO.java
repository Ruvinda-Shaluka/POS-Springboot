package com.example.springbootposbackend.dto;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderDetailDTO {
    private Long itemId;

    @Pattern(regexp = "\\d+" , message = "Quantity must be a valid integer")
    private int qty;

    @Pattern(regexp = "^[-+]?[0-9]*\\.?[0-9]+$ " , message = "Quantity must be a positive number")
    private double unitPrice;
}
