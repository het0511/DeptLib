package com.library.config;

import com.library.model.Book;
import com.library.model.User;
import com.library.repository.BookRepository;
import com.library.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.math.BigDecimal;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(BookRepository bookRepository, UserRepository userRepository, 
                                     PasswordEncoder passwordEncoder) {
        return args -> {
            // Create admin user
            // User admin = new User();
            // admin.setName("Admin User");
            // admin.setEmail("admin@example.com");
            // admin.setPassword(passwordEncoder.encode("password"));
            // admin.setRole(User.Role.ADMIN);
            // userRepository.save(admin);
            
            // // Create regular user
            // User user = new User();
            // user.setName("Regular User");
            // user.setEmail("user@example.com");
            // user.setPassword(passwordEncoder.encode("password"));
            // userRepository.save(user);
            
            // // Create sample books
            // Book book1 = new Book();
            // book1.setTitle("Introduction to Computer Science");
            // book1.setAuthor("John Smith");
            // book1.setDescription("A comprehensive introduction to the field of computer science.");
            // book1.setCoverImage("https://images.unsplash.com/photo-1517694712202-14dd9538aa97");
            // book1.setDepartment("Computer Science");
            // book1.setPrice(new BigDecimal("45.99"));
            // book1.setAvailableForPurchase(true);
            // book1.setAvailableForBorrow(true);
            // book1.setStock(10);
            // bookRepository.save(book1);
            
            // Book book2 = new Book();
            // book2.setTitle("Advanced Mathematics");
            // book2.setAuthor("Sarah Johnson");
            // book2.setDescription("An in-depth exploration of advanced mathematical concepts.");
            // book2.setCoverImage("https://images.unsplash.com/photo-1509228627152-72ae9ae6848d");
            // book2.setDepartment("Mathematics");
            // book2.setPrice(new BigDecimal("39.99"));
            // book2.setAvailableForPurchase(true);
            // book2.setAvailableForBorrow(true);
            // book2.setStock(8);
            // bookRepository.save(book2);
            
            // Book book3 = new Book();
            // book3.setTitle("Principles of Economics");
            // book3.setAuthor("Michael Brown");
            // book3.setDescription("A fundamental guide to economic principles and theories.");
            // book3.setCoverImage("https://images.unsplash.com/photo-1551288049-bebda4e38f71");
            // book3.setDepartment("Economics");
            // book3.setPrice(new BigDecimal("42.50"));
            // book3.setAvailableForPurchase(true);
            // book3.setAvailableForBorrow(true);
            // book3.setStock(5);
            // bookRepository.save(book3);
            
            // Book book4 = new Book();
            // book4.setTitle("Modern Physics");
            // book4.setAuthor("Emily Chen");
            // book4.setDescription("Exploring the latest developments in physics research.");
            // book4.setCoverImage("https://images.unsplash.com/photo-1532094349884-543bc11b234d");
            // book4.setDepartment("Physics");
            // book4.setPrice(new BigDecimal("49.99"));
            // book4.setAvailableForPurchase(true);
            // book4.setAvailableForBorrow(true);
            // book4.setStock(7);
            // bookRepository.save(book4);
            
            // Book book5 = new Book();
            // book5.setTitle("Organic Chemistry");
            // book5.setAuthor("David Wilson");
            // book5.setDescription("A detailed study of organic compounds and reactions.");
            // book5.setCoverImage("https://images.unsplash.com/photo-1532187863486-abf9dbad1b69");
            // book5.setDepartment("Chemistry");
            // book5.setPrice(new BigDecimal("52.75"));
            // book5.setAvailableForPurchase(true);
            // book5.setAvailableForBorrow(true);
            // book5.setStock(6);
            // bookRepository.save(book5);
            
            // Book book6 = new Book();
            // book6.setTitle("World History: Modern Era");
            // book6.setAuthor("Robert Taylor");
            // book6.setDescription("A comprehensive overview of world history from the 16th century to present day.");
            // book6.setCoverImage("https://images.unsplash.com/photo-1461360228754-6e81c478b882");
            // book6.setDepartment("History");
            // book6.setPrice(new BigDecimal("38.25"));
            // book6.setAvailableForPurchase(true);
            // book6.setAvailableForBorrow(true);
            // book6.setStock(9);
            // bookRepository.save(book6);
        };
    }
}