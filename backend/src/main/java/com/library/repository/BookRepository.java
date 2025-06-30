package com.library.repository;

import com.library.model.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface BookRepository extends MongoRepository<Book, String> {
    List<Book> findByDepartment(String department);
    
    @Query("{ $or: [ " +
           "{ 'title': { $regex: ?0, $options: 'i' }}, " +
           "{ 'author': { $regex: ?0, $options: 'i' }}, " +
           "{ 'description': { $regex: ?0, $options: 'i' }} " +
           "]}")
    List<Book> searchBooks(String query);
}