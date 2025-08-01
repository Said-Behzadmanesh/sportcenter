package com.ecommerce.sportscenter.repository;


import com.ecommerce.sportscenter.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword%")
    List<Product> searchByName(@Param("keyword") String keyword);

    @Query("SELECT p FROM Product p WHERE p.brand.id = :brandId AND p.type.id = :typeId")
    List<Product> searchByBrandAndType(@Param("brandId") Integer brandId,
                                       @Param("typeId") Integer typeId);

    @Query("SELECT p FROM Product p WHERE p.brand.id = :brandId AND p.type.id = :typeId AND p.name LIKE %:keyword%")
    List<Product> searchByBrandTypeAndName(@Param("brandId") Integer brandId,
                                           @Param("typeId") Integer typeId,
                                           @Param("keyword") String keyword);

}
