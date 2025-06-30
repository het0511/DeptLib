package com.library.service;

import com.library.dto.TransactionDto;
import com.library.exception.ResourceNotFoundException;
import com.library.model.Book;
import com.library.model.Transaction;
import com.library.model.User;
import com.library.repository.BookRepository;
import com.library.repository.TransactionRepository;
import com.library.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository,
                             BookRepository bookRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    public List<TransactionDto> getUserTransactions(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        
        return transactionRepository.findByUser(user).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public TransactionDto getTransactionById(String id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", id));
        return mapToDto(transaction);
    }

    @Transactional
    public TransactionDto purchaseBook(String email, String bookId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", bookId));
        
        if (!book.isAvailableForPurchase() || book.getStock() <= 0) {
            throw new RuntimeException("Book is not available for purchase");
        }
        
        // Reduce book stock
        book.setStock(book.getStock() - 1);
        bookRepository.save(book);
        
        // Create transaction
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setBook(book);
        transaction.setType(Transaction.TransactionType.PURCHASE);
        transaction.setDate(LocalDate.now());
        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        
        Transaction savedTransaction = transactionRepository.save(transaction);

        // **Update user transactions**
        user.getTransactionIds().add(savedTransaction.getId());
        userRepository.save(user);  // Save updated user
        
        return mapToDto(savedTransaction);
    }

    @Transactional
    public TransactionDto borrowBook(String email, String bookId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", bookId));
        
        if (!book.isAvailableForBorrow() || book.getStock() <= 0) {
            throw new RuntimeException("Book is not available for borrowing");
        }
        
        // Reduce book stock
        book.setStock(book.getStock() - 1);
        bookRepository.save(book);
        
        // Create transaction with 14-day borrow period
        LocalDate borrowDate = LocalDate.now();
        LocalDate returnDate = borrowDate.plusDays(14);
        
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setBook(book);
        transaction.setType(Transaction.TransactionType.BORROW);
        transaction.setDate(borrowDate);
        transaction.setReturnDate(returnDate);
        transaction.setStatus(Transaction.TransactionStatus.ACTIVE);
        
        Transaction savedTransaction = transactionRepository.save(transaction);

        // **Update user transactions**
        user.getTransactionIds().add(savedTransaction.getId());
        userRepository.save(user);  // Save updated user

        return mapToDto(savedTransaction);
    }

    @Transactional
    public TransactionDto returnBook(String email, String transactionId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", transactionId));
        
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only return your own borrowed books");
        }
        
        if (transaction.getType() != Transaction.TransactionType.BORROW || 
            transaction.getStatus() != Transaction.TransactionStatus.ACTIVE) {
            throw new RuntimeException("This transaction cannot be returned");
        }
        
        // Update transaction status
        transaction.setStatus(Transaction.TransactionStatus.RETURNED);
        
        // Return book to stock
        Book book = transaction.getBook();
        book.setStock(book.getStock() + 1);
        bookRepository.save(book);
        
        Transaction updatedTransaction = transactionRepository.save(transaction);
        return mapToDto(updatedTransaction);
    }

    private TransactionDto mapToDto(Transaction transaction) {
        TransactionDto dto = new TransactionDto();
        dto.setId(transaction.getId());
        dto.setUserId(transaction.getUser().getId());
        dto.setBookId(transaction.getBook().getId());
        dto.setType(transaction.getType().name());
        dto.setDate(transaction.getDate().format(dateFormatter));
        if (transaction.getReturnDate() != null) {
            dto.setReturnDate(transaction.getReturnDate().format(dateFormatter));
        }
        dto.setStatus(transaction.getStatus().name());
        return dto;
    }
}