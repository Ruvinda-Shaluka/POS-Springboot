package com.example.springbootposbackend.service.impl;

import com.example.springbootposbackend.dto.ItemDTO;
import com.example.springbootposbackend.entity.Item;
import com.example.springbootposbackend.repository.CustomerRepo;
import com.example.springbootposbackend.repository.ItemRepo;
import com.example.springbootposbackend.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemServiceIMPL implements ItemService {
    private final ItemRepo itemRepo;
    private final ModelMapper modelMapper;

    @Override
    public void saveItem(ItemDTO itemDTO) {
        itemRepo.save(modelMapper.map(itemDTO , Item.class));
    }

    @Override
    public void updateItem(ItemDTO itemDTO) {
        itemRepo.save(modelMapper.map(itemDTO , Item.class));
    }

    @Override
    public void deleteItem(long id) {
        itemRepo.deleteById(id);
    }

    @Override
    public List<ItemDTO> getAllItems() {
        List<Item> items = itemRepo.findAll();
        return modelMapper.map(items, new org.modelmapper.TypeToken<List<ItemDTO>>() {}.getType());
    }
}
