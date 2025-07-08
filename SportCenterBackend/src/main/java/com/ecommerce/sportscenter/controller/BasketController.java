package com.ecommerce.sportscenter.controller;

import com.ecommerce.sportscenter.entity.Basket;
import com.ecommerce.sportscenter.entity.BasketItem;
import com.ecommerce.sportscenter.model.BasketItemResponse;
import com.ecommerce.sportscenter.model.BasketResponse;
import com.ecommerce.sportscenter.service.BasketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/baskets")
public class BasketController {

    private final BasketService basketService;

    public BasketController(BasketService basketService) {
        this.basketService = basketService;
    }

    @GetMapping
    public List<BasketResponse> getAllBaskets() {
        return basketService.getAllBaskets();
    }

    @GetMapping("/{basketId}")
    @PreAuthorize("isAuthenticated()")
    public BasketResponse getBasketById(@PathVariable String basketId){
        return basketService.getBasketById(basketId);
    }

    @DeleteMapping("/{basketId}")
    public void deleteBasketById(@PathVariable String basketId){
        basketService.deleteBasketById(basketId);
    }

    @PostMapping
    public ResponseEntity<BasketResponse> createBasket(@RequestBody BasketResponse basketResponse){
        // convert this Basket Response to basket Entity
        Basket basket = convertToBasketEntity(basketResponse);
        // call the service to create the basket
        BasketResponse createdBasket = basketService.createBasket(basket);
        
        return new ResponseEntity<>(createdBasket, HttpStatus.CREATED);

    }

    private Basket convertToBasketEntity(BasketResponse basketResponse) {
        Basket basket = new Basket();
        basket.setId(basketResponse.getId());
        basket.setItems(mapBasketItemResponsesToEntities(basketResponse.getItems()));
        
        return basket;
    }

    private List<BasketItem> mapBasketItemResponsesToEntities(List<BasketItemResponse> itemResponses) {
        return itemResponses.stream()
                .map(this::convertToBasketItemEntity)
                .collect(Collectors.toList());
    }

    private BasketItem convertToBasketItemEntity(BasketItemResponse itemRes) {
        BasketItem basketItem = new BasketItem();
        basketItem.setId(itemRes.getId());
        basketItem.setName(itemRes.getName());
        basketItem.setDescription(itemRes.getDescription());
        basketItem.setPrice(itemRes.getPrice());
        basketItem.setQuantity(itemRes.getQuantity());
        basketItem.setPictureUrl(itemRes.getPictureUrl());
        basketItem.setProductBrand(itemRes.getProductBrand());
        basketItem.setProductType(itemRes.getProductType());

        return basketItem;
    }
}
