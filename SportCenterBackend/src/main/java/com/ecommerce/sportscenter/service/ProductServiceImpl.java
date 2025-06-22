package com.ecommerce.sportscenter.service;

import com.ecommerce.sportscenter.entity.Product;
import com.ecommerce.sportscenter.model.ProductResponse;
import com.ecommerce.sportscenter.repository.ProductRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
public class ProductServiceImpl implements ProductService{

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public ProductResponse getProductById(Integer productId) {
        log.info("Fetching product by Id: {}", productId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product with given id dose not exist"));
        // now convert the product to product response
        ProductResponse productResponse = convertToProductResponse(product);
        log.info("Fetched product by Id: {}", productId);

        return productResponse;
    }

    @Override
    public Page<ProductResponse> getProducts(Pageable pageable) {
        log.info("Fetching all Products");
        // Fetching Products from DB
        Page<Product> productPage = productRepository.findAll(pageable);
        // now use stream operator to map with response
        Page<ProductResponse> productResponsePage = productPage
                .map(this::convertToProductResponse);
        log.info("fechted all Products");

        return productResponsePage;
    }

    private ProductResponse convertToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .description(product.getDescription())
                .pictureUrl(product.getPictureUrl())
                .productType(product.getType().getName())
                .productBrand(product.getBrand().getName())
                .build();
    }

    @Override
    public List<ProductResponse> searchProductsByName(String keyword) {
        log.info("Searching product(s) by name: {}", keyword);
        // call the custom query Method
        List<Product> productList = productRepository.searchByName(keyword);
        // Map
        List<ProductResponse> productResponseList = productList.stream()
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());

        return productResponseList;
    }

    @Override
    public List<ProductResponse> searchProductsByBrandTypeAndName(Integer brandId, Integer typeId, String keyword) {
        log.info("Searching product(s) by brandId: {}, and typeId: {}, and keyword: {}", brandId, typeId, keyword);
        // call the custom query Method
        List<Product> productList = productRepository.searchByBrandTypeAndName(brandId, typeId, keyword);
        // Map
        List<ProductResponse> productResponseList = productList.stream()
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());
        log.info("Fetched all products");

        return productResponseList;
    }

    @Override
    public List<ProductResponse> searchProductsByBrandAndType(Integer brandId, Integer typeId) {
        log.info("Searching product(s) by brandId: {}, and typeId: {}", brandId, typeId);
        // call the custom query Method
        List<Product> productList = productRepository.searchByBrandAndType(brandId, typeId);
        // Map
        List<ProductResponse> productResponseList = productList.stream()
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());
        log.info("Fetched all products");

        return productResponseList;
    }
}
