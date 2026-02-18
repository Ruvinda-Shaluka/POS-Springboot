package com.example.springbootposbackend.repository;


import com.example.springbootposbackend.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

    public interface CustomerRepo extends JpaRepository<Customer, Long> {
}
