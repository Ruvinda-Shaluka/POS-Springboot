package com.example.springbootposbackend.service.impl;

import com.example.springbootposbackend.entity.Customer;
import com.example.springbootposbackend.repository.CustomerRepo;
import com.example.springbootposbackend.service.CustomerService;
import com.example.springbootposbackend.dto.CustomerDTO;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.NotFound;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceIMPL implements CustomerService {
    private final CustomerRepo customerRepo;
    private final ModelMapper modelMapper;

    @Override
    public void saveCustomer(CustomerDTO customerDTO) {
        customerRepo.save(modelMapper.map(customerDTO, Customer.class));

    }

    @Override
    public void updateCustomer(CustomerDTO customerDTO) {

//        customerRepo.findById(customerDTO.getId())
//                .orElseThrow(() ->
//                        new NullPointerException("Customer with ID " + customerDTO.getId() + " not found.")
//                );

        customerRepo.save(modelMapper.map(customerDTO, Customer.class));
    }

    @Override
    public void deleteCustomer(long customerId) {
        customerRepo.deleteById(customerId);

    }

    @Override
    public List<CustomerDTO> getAllCustomer() {
        List<Customer> customers = customerRepo.findAll();
        return modelMapper.map(customers, new TypeToken<List<CustomerDTO>>() {}.getType());
    }
}
