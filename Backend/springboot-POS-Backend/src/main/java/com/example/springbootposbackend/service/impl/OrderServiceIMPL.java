package com.example.springbootposbackend.service.impl;

import com.example.springbootposbackend.dto.OrderDTO;
import com.example.springbootposbackend.dto.OrderDetailDTO;
import com.example.springbootposbackend.entity.Customer;
import com.example.springbootposbackend.entity.Item;
import com.example.springbootposbackend.entity.Order;
import com.example.springbootposbackend.entity.OrderDetail;
import com.example.springbootposbackend.repository.CustomerRepo;
import com.example.springbootposbackend.repository.ItemRepo;
import com.example.springbootposbackend.repository.OrderRepo;
import com.example.springbootposbackend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceIMPL implements OrderService {

    private final OrderRepo orderRepo;
    private final CustomerRepo customerRepo;
    private final ItemRepo itemRepo;

    @Override
    public void placeOrder(OrderDTO orderDTO) {
        Customer customer = customerRepo.findById(Long.valueOf(orderDTO.getCustomerId()))
                .orElseThrow(() -> new RuntimeException("Customer not found: " + orderDTO.getCustomerId()));

        Order order = new Order();
        order.setDate(orderDTO.getDate());
        order.setCustomer(customer);

        List<OrderDetail> details = new ArrayList<>();

        for (OrderDetailDTO detailDTO : orderDTO.getOrderDetails()) {
            Item item = itemRepo.findById(detailDTO.getItemId())
                    .orElseThrow(() -> new RuntimeException("Item not found: " + detailDTO.getItemId()));

            if (item.getQtyOnHand() < detailDTO.getQty()) {
                throw new RuntimeException("Insufficient stock for item: " + item.getId());
            }


            item.setQtyOnHand(item.getQtyOnHand() - detailDTO.getQty());
            itemRepo.save(item);


            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(order);
            orderDetail.setItem(item);
            orderDetail.setQty(detailDTO.getQty());
            orderDetail.setUnitPrice(detailDTO.getUnitPrice());

            details.add(orderDetail);
        }

        order.setOrderDetails(details);

        orderRepo.save(order);
    }
}