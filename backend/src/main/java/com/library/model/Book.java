package com.library.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "books")
public class Book {
    
    @Id
    private String id;
    
    private String title;
    
    private String author;
    
    private String description;
    
    private String coverImage;
    
    private String department;
    
    private BigDecimal price;
    
    private boolean availableForPurchase = true;
    
    private boolean availableForBorrow = true;
    
    private int stock;
    
    private Set<String> transactionIds = new HashSet<>();
}