package com.example.springbootposbackend.service;


import com.example.springbootposbackend.dto.CustomerDTO;

import java.util.List;

public interface CustomerService {
    public void saveCustomer(CustomerDTO customerDTO);

    public void updateCustomer(CustomerDTO customerDTO);

    public void deleteCustomer(long customerId);

    public List<CustomerDTO> getAllCustomer();
}
