package com.ecommerce.sportscenter.controller;

import com.ecommerce.sportscenter.model.BrandResponse;
import com.ecommerce.sportscenter.model.ProductResponse;
import com.ecommerce.sportscenter.model.TypeResponse;
import com.ecommerce.sportscenter.service.BrandService;
import com.ecommerce.sportscenter.service.ProductService;
import com.ecommerce.sportscenter.service.TypeService;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;
    private final TypeService typeService;
    private final BrandService brandService;

    public ProductController(ProductService productService, TypeService typeService, BrandService brandService) {
        this.productService = productService;
        this.typeService = typeService;
        this.brandService = brandService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable("id") Integer productId){
        ProductResponse productResponse = productService.getProductById(productId);

        return new ResponseEntity<>(productResponse, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<Page<ProductResponse>> getProducts(
            @PageableDefault(size = 10)Pageable pageable,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "brandId", required = false) Integer brandId,
            @RequestParam(name = "typeId", required = false) Integer typeId,
            @RequestParam(name = "sort", defaultValue = "name") String sort,
            @RequestParam(name = "order", defaultValue = "asc") String order){

        Page<ProductResponse> productResponsePage = null;
        if(brandId != null && typeId != null && keyword != null && !keyword.isEmpty()) {
            // search by brand, type and keyword
            List<ProductResponse> productResponseList = productService.searchProductsByBrandTypeAndName(brandId, typeId, keyword);
            productResponsePage = new PageImpl<>(productResponseList, pageable, productResponseList.size());
        }
        else if(brandId != null && typeId != null) {
            // search by brand, type and keyword
            List<ProductResponse> productResponseList = productService.searchProductsByBrandAndType(brandId, typeId);
            productResponsePage = new PageImpl<>(productResponseList, pageable, productResponseList.size());
        }
        else if(keyword != null && !keyword.isEmpty()){
                List<ProductResponse> productResponseList = productService.searchProductsByName(keyword);
                productResponsePage = new PageImpl<>(productResponseList, pageable, productResponseList.size());
        }
        else {
            // If no search criteria, then retrieve based on sorting options
            Sort.Direction direction = "asc".equalsIgnoreCase(order) ? Sort.Direction.ASC : Sort.Direction.DESC;
            Sort sorting = Sort.by(direction, sort);

            productResponsePage = productService.getProducts(PageRequest.of(pageable.getPageNumber(),
                                                                            pageable.getPageSize(),
                                                                            sorting));
        }

        return new ResponseEntity<>(productResponsePage, HttpStatus.OK);
    }

    @GetMapping("/brands")
    public ResponseEntity<List<BrandResponse>> getBrands(){
        List<BrandResponse> brandResponseList = brandService.getAllBrands();

        return new ResponseEntity<>(brandResponseList, HttpStatus.OK);
    }

    @GetMapping("/types")
    public ResponseEntity<List<TypeResponse>> getTypes(){
        List<TypeResponse> typeResponseList = typeService.getAllTypes();

        return new ResponseEntity<>(typeResponseList, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(@RequestParam("keyword") String keyword){
        List<ProductResponse> productResponseList = productService.searchProductsByName(keyword);

        return new ResponseEntity<>(productResponseList, HttpStatus.OK);
    }
}
