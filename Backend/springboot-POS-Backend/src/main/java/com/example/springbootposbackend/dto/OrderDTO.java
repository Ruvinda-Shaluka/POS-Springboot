package com.example.springbootposbackend.dto;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data

public class OrderDTO {
    private Long orderId;

    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$" , message = "Date must be in the format YYYY-MM-DD") /*YYYY-MM-DD*/
    private LocalDate date;

    private String customerId;

    private List<OrderDetailDTO> orderDetails;
}
