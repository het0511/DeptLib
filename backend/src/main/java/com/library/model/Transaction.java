package com.library.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "transactions")
public class Transaction {
    
    @Id
    private String id;
    
    @DBRef
    private User user;
    
    @DBRef
    private Book book;
    
    private TransactionType type;
    
    private LocalDate date;
    
    private LocalDate returnDate;
    
    private TransactionStatus status;
    
    public enum TransactionType {
        PURCHASE, BORROW
    }
    
    public enum TransactionStatus {
        ACTIVE, RETURNED, COMPLETED
    }
}