package com.ecommerce.sportscenter.service;

import com.ecommerce.sportscenter.model.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {

    ProductResponse getProductById(Integer productId);
    Page<ProductResponse> getProducts(Pageable pageable);
    List<ProductResponse> searchProductsByName(String keyword);

    List<ProductResponse> searchProductsByBrandTypeAndName(Integer brandId, Integer typeId, String keyword);

    List<ProductResponse> searchProductsByBrandAndType(Integer brandId, Integer typeId);
}
