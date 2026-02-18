package com.example.springbootposbackend.controller;

import com.example.springbootposbackend.dto.CustomerDTO;
import com.example.springbootposbackend.dto.ItemDTO;
import com.example.springbootposbackend.service.ItemService;
import com.example.springbootposbackend.service.impl.ItemServiceIMPL;
import com.example.springbootposbackend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/v1/items")
@RestController
@RequiredArgsConstructor
@CrossOrigin
@Validated
public class ItemController {
    private final ItemServiceIMPL itemServiceIMPL;

    @PostMapping
    public ResponseEntity <APIResponse<String>> saveItem(@RequestBody ItemDTO itemDTO) {
        itemServiceIMPL.saveItem(itemDTO);
        return new ResponseEntity<>(new APIResponse<>(201, "Item saved successfully", null), HttpStatus.CREATED);
    }

    @PutMapping
    public  ResponseEntity <APIResponse<String>> updateItem(@RequestBody ItemDTO itemDTO) {
        itemServiceIMPL.updateItem(itemDTO);
        return new ResponseEntity<>(new APIResponse<>(200, "Item updated successfully", null), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity <APIResponse<String>> deleteItem(@PathVariable long id) {
        itemServiceIMPL.deleteItem(id);
        return new ResponseEntity<>(new APIResponse<>(200, "Item deleted successfully", null), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity <APIResponse<Iterable<ItemDTO>>> getAllItems() {
        Iterable<ItemDTO> itemDTOs = itemServiceIMPL.getAllItems();
        return new ResponseEntity<>(new APIResponse<>(200, "Items retrieved successfully", itemDTOs), HttpStatus.OK);
    }



}
