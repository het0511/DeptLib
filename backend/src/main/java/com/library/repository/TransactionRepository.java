package com.library.repository;

import com.library.model.Transaction;
import com.library.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByUser(User user);
}