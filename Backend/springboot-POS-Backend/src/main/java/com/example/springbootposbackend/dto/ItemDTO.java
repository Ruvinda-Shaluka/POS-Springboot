package com.example.springbootposbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data

public class ItemDTO {

    @Pattern(regexp = "^\\d+$", message = "Item ID must be a valid integer")
    private Long id;

    @NotBlank(message = "Item description cannot be blank")
    private String description;

    @NotBlank(message = "Item price cannot be blank")
    @Pattern(regexp = "[+-]?(\\d+(\\.\\d*)?|\\.\\d+)([eE][+-]?\\d+)?" , message = "Invalid unit price")
    private double unitPrice;

    @Pattern(regexp = "^\\d+$", message = "Item qty must be a valid integer")
    @NotBlank(message = "Item qty cannot be blank")
    private int qtyOnHand;
}
