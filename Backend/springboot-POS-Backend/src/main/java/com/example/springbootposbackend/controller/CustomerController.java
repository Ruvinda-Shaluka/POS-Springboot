package com.example.springbootposbackend.controller;

import com.example.springbootposbackend.dto.CustomerDTO;
import com.example.springbootposbackend.service.CustomerService;
import com.example.springbootposbackend.service.impl.CustomerServiceIMPL;
import com.example.springbootposbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/v1/customers")
@RestController
@RequiredArgsConstructor
@CrossOrigin
@Validated

public class CustomerController {
    private final CustomerServiceIMPL customerServiceIMPL;

    @PostMapping
    public ResponseEntity <APIResponse<String>> saveCustomer(@RequestBody CustomerDTO customerDTO) {
        customerServiceIMPL.saveCustomer(customerDTO);
        return new ResponseEntity<>(new APIResponse<>(201, "Customer saved successfully", null), HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity <APIResponse<String>> updateCustomer(@RequestBody CustomerDTO customerDTO) {
        customerServiceIMPL.updateCustomer(customerDTO);
        return new ResponseEntity<>(new APIResponse<>(200, "Customer updated successfully", null), HttpStatus.OK);
    }

    @DeleteMapping("/{customerId}")
    public ResponseEntity <APIResponse<String>> deleteCustomer(@PathVariable long customerId) {
        customerServiceIMPL.deleteCustomer(customerId);
        return new ResponseEntity<>(new APIResponse<>(200, "Customer deleted successfully", null), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity <APIResponse<List<CustomerDTO>>> getAllCustomers() {
        List<CustomerDTO> customers = customerServiceIMPL.getAllCustomer();
        return new ResponseEntity<>(new APIResponse<>(200, "Customers retrieved successfully", customers), HttpStatus.OK);
    }

}
