package com.library.service;

import com.library.model.Book;
import com.library.model.User;
import com.library.repository.BookRepository;
import com.library.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public AnalyticsService(BookRepository bookRepository, UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    public Map<String, Object> getBookAnalytics() {
        List<Book> books = bookRepository.findAll();

        long totalBooks = books.size();
        long availableToBorrow = books.stream().filter(Book::isAvailableForBorrow).count();
        long availableToPurchase = books.stream().filter(Book::isAvailableForPurchase).count();
        long outOfStock = books.stream().filter(book -> book.getStock() == 0).count();

        Map<String, Long> booksByDepartment = books.stream()
            .collect(Collectors.groupingBy(Book::getDepartment, Collectors.counting()));

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalBooks", totalBooks);
        analytics.put("availableToBorrow", availableToBorrow);
        analytics.put("availableToPurchase", availableToPurchase);
        analytics.put("outOfStockBooks", outOfStock);
        analytics.put("booksByDepartment", booksByDepartment);

        return analytics;
    }

    public Map<String, Object> getUserAnalytics() {
        List<User> users = userRepository.findAll();

        long totalUsers = users.size();
        long adminCount = users.stream().filter(u -> u.getRole() == User.Role.ADMIN).count();
        long userCount = totalUsers - adminCount;

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalUsers", totalUsers);
        analytics.put("totalAdmins", adminCount);
        analytics.put("totalRegularUsers", userCount);

        return analytics;
    }
}
