package com.example.springbootposbackend.repository;

import com.example.springbootposbackend.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepo extends JpaRepository<Item,Long> {
}
