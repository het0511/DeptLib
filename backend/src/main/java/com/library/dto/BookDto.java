package com.library.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookDto {
    private String id;
    private String title;
    private String author;
    private String description;
    private String coverImage;
    private String department;
    private BigDecimal price;
    private boolean availableForPurchase;
    private boolean availableForBorrow;
    private int stock;
}