package com.ecommerce.sportscenter.service;

import com.ecommerce.sportscenter.entity.Basket;
import com.ecommerce.sportscenter.entity.BasketItem;
import com.ecommerce.sportscenter.model.BasketItemResponse;
import com.ecommerce.sportscenter.model.BasketResponse;
import com.ecommerce.sportscenter.repository.BasketRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
public class BasketServiceImpl implements BasketService{

    private final BasketRepository basketRepository;

    public BasketServiceImpl(BasketRepository basketRepository) {
        this.basketRepository = basketRepository;
    }

    @Override
    public List<BasketResponse> getAllBaskets() {
        log.info("Fetching all Baskets");
        List<Basket> basketList = (List<Basket>) basketRepository.findAll();
        // now using stream operator to map with response
        List<BasketResponse> basketResponses = basketList.stream()
                .map(this::convertToBasketResponse)
                .collect(Collectors.toList());
        log.info("Fetched all Baskets");
        
        return basketResponses;
    }

    @Override
    public BasketResponse getBasketById(String basketId) {
        log.info("Fetching Basket by Id: {}");
        Optional<Basket> basketOptional = basketRepository.findById(basketId);
        if(basketOptional.isPresent()){
            Basket basket = basketOptional.get();
            log.info("Fetched Basket by Id: {}");
            return convertToBasketResponse(basket);
        } else {
            log.info("Basket not found by Id: {}");
            return null;
        }
    }

    @Override
    public void deleteBasketById(String basketId) {
        log.info("Deleting Basket by Id: {}", basketId);
        basketRepository.deleteById(basketId);
        log.info("Deleted Basket by Id: {}", basketId);
    }

    @Override
    public BasketResponse createBasket(Basket basket) {
        log.info("Creating Basket");
        Basket basket1 = basketRepository.save(basket);
        log.info("Basket created by id : {}", basket1.getId());
        return convertToBasketResponse(basket1);
    }

    private BasketResponse convertToBasketResponse(Basket basket) {
        if(basket == null){
            return null;
        }

        List<BasketItemResponse> itemResponses = basket.getItems().stream()
                .map(this::convertToBasketItemResponse)
                .collect(Collectors.toList());
        
        return BasketResponse.builder()
                .id(basket.getId())
                .items(itemResponses)
                .build();
    }

    private BasketItemResponse convertToBasketItemResponse(BasketItem basketItem) {
        return BasketItemResponse.builder()
                .id(basketItem.getId())
                .name(basketItem.getName())
                .description(basketItem.getDescription())
                .price(basketItem.getPrice())
                .pictureUrl(basketItem.getPictureUrl())
                .productBrand(basketItem.getProductBrand())
                .productType(basketItem.getProductType())
                .quantity(basketItem.getQuantity())
                .build();
    }
}
